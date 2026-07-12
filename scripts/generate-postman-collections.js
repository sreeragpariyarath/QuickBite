/**
 * Converts the exported OpenAPI specs into importable Postman collections.
 *
 * Pipeline: NestJS → Swagger → OpenAPI (docs/openapi) → THIS SCRIPT → Postman Import
 *
 * The generated collections are build artifacts — never edit them by hand.
 * Injected on top of the plain conversion:
 *   - collection-level Bearer auth: {{accessToken}}
 *   - collection-level post-response script that saves accessToken,
 *     refreshToken, userId, restaurantId, categoryId, menuItemId, orderId
 *     (and devOtp) to the active environment whenever a response contains them
 *   - baseUrl collection variable pointing at {{authBaseUrl}} / {{restaurantBaseUrl}}
 *
 * Usage:  pnpm postman   (root)
 */
const fs = require('fs');
const path = require('path');
const Converter = require('openapi-to-postmanv2');

const SPEC_DIR = path.join(__dirname, '..', 'docs', 'openapi');
const OUT_DIR = path.join(__dirname, '..', 'postman', 'generated');

const SERVICES = [
  {
    spec: 'auth-service.openapi.json',
    out: 'QuickBite-Auth.postman_collection.json',
    baseUrlVar: '{{authBaseUrl}}',
    name: 'QuickBite — Auth Service',
  },
  {
    spec: 'restaurant-service.openapi.json',
    out: 'QuickBite-Restaurant.postman_collection.json',
    baseUrlVar: '{{restaurantBaseUrl}}',
    name: 'QuickBite — Restaurant Service',
  },
];

// Saves ids/tokens to the environment after every successful response.
// Entity detection is shape-based because responses don't carry type names:
//   ownerId  → restaurant, price → menu item, customerId/total → order,
//   restaurantId (without price) → category, role → user.
const POST_RESPONSE_SCRIPT = [
  "let body; try { body = pm.response.json(); } catch (e) { body = null; }",
  "if (!body || pm.response.code >= 400) { return; }",
  "if (body.accessToken) pm.environment.set('accessToken', body.accessToken);",
  "if (body.refreshToken) pm.environment.set('refreshToken', body.refreshToken);",
  "if (body.devOtp) pm.environment.set('devOtp', String(body.devOtp));",
  "if (body.user && body.user.id) pm.environment.set('userId', body.user.id);",
  "if (body.id) {",
  "  if (body.ownerId) { pm.environment.set('restaurantId', body.id); }",
  "  else if (body.price !== undefined) { pm.environment.set('menuItemId', body.id); }",
  "  else if (body.customerId || body.total !== undefined) { pm.environment.set('orderId', body.id); }",
  "  else if (body.restaurantId) { pm.environment.set('categoryId', body.id); }",
  "  else if (body.role) { pm.environment.set('userId', body.id); }",
  "}",
];

function stripRequestAuth(items) {
  for (const item of items) {
    if (item.request) delete item.request.auth;
    if (item.item) stripRequestAuth(item.item);
  }
}

function convert(service) {
  const specPath = path.join(SPEC_DIR, service.spec);
  const spec = fs.readFileSync(specPath, 'utf8');

  return new Promise((resolve, reject) => {
    Converter.convert(
      { type: 'string', data: spec },
      {
        folderStrategy: 'Tags',
        requestParametersResolution: 'Example',
        exampleParametersResolution: 'Example',
        enableOptionalParameters: false,
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result.result) {
          return reject(new Error(`Conversion failed: ${result.reason}`));
        }

        const collection = result.output[0].data;

        collection.info.name = service.name;
        collection.info.description = {
          content:
            'GENERATED FILE — do not edit. Regenerate with `pnpm openapi` (service) + `pnpm postman` (root). Uses the Local environment: baseUrl variables, {{accessToken}} bearer auth, and auto-saved ids via the collection post-response script.',
        };

        // Collection-level bearer auth; requests inherit it
        collection.auth = {
          type: 'bearer',
          bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
        };
        stripRequestAuth(collection.item);

        // Collection-level post-response script
        collection.event = [
          {
            listen: 'test',
            script: { type: 'text/javascript', exec: POST_RESPONSE_SCRIPT },
          },
        ];

        // Point the converter's baseUrl variable at the environment variable
        collection.variable = (collection.variable || []).filter(
          (v) => v.key !== 'baseUrl',
        );
        collection.variable.push({ key: 'baseUrl', value: service.baseUrlVar });

        fs.mkdirSync(OUT_DIR, { recursive: true });
        const outPath = path.join(OUT_DIR, service.out);
        fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
        console.log(`✔ ${service.name} → ${path.relative(process.cwd(), outPath)}`);
        resolve();
      },
    );
  });
}

Promise.all(SERVICES.map(convert)).catch((err) => {
  console.error(err);
  process.exit(1);
});
