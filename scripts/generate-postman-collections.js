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
  {
    spec: 'order-service.openapi.json',
    out: 'QuickBite-Order.postman_collection.json',
    baseUrlVar: '{{orderBaseUrl}}',
    name: 'QuickBite — Order Service',
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

// Saved example responses ("Untitled Response", one per documented status
// code) clutter the sidebar — expected responses are documented in each
// request's description instead.
function stripSavedExamples(items) {
  for (const item of items) {
    if (item.response) item.response = [];
    if (item.item) stripSavedExamples(item.item);
  }
}

// Fallback for endpoints without a summary: "{{baseUrl}}/x" → "METHOD /x"
function cleanRequestNames(items) {
  for (const item of items) {
    if (item.request && item.name.includes('{{baseUrl}}')) {
      const path = item.name.replace('{{baseUrl}}', '') || '/';
      item.name = `${item.request.method} ${path}`;
    }
    if (item.item) cleanRequestNames(item.item);
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
        // Names come from @ApiOperation summaries — keep them short in code
        requestNameSource: 'Fallback',
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
        stripSavedExamples(collection.item);
        cleanRequestNames(collection.item);

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

// ---------------------------------------------------------------------------
// E2E Flows collection — a connected, run-top-to-bottom test script split by
// role. Customer and owner keep separate tokens so both stay logged in.
// ---------------------------------------------------------------------------

const FLOW_SAVER_SCRIPT = [
  "let body; try { body = pm.response.json(); } catch (e) { body = null; }",
  'if (!body || pm.response.code >= 400) { return; }',
  "if (body.devOtp) pm.environment.set('devOtp', String(body.devOtp));",
  'if (body.id) {',
  "  if (body.ownerId) { pm.environment.set('restaurantId', body.id); }",
  "  else if (body.price !== undefined) { pm.environment.set('menuItemId', body.id); }",
  "  else if (body.customerId || body.total !== undefined) { pm.environment.set('orderId', body.id); }",
  "  else if (body.restaurantId) { pm.environment.set('categoryId', body.id); }",
  '}',
];

function flowReq(name, method, url, { body, description, noauth, test } = {}) {
  const item = {
    name,
    request: {
      method,
      header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
      url,
      description,
    },
    response: [],
  };
  if (body) {
    item.request.body = {
      mode: 'raw',
      raw: JSON.stringify(body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }
  if (noauth) item.request.auth = { type: 'noauth' };
  if (test) {
    item.event = [
      { listen: 'test', script: { type: 'text/javascript', exec: test } },
    ];
  }
  return item;
}

function folder(name, tokenVar, items, description) {
  return {
    name,
    description,
    auth: {
      type: 'bearer',
      bearer: [{ key: 'token', value: `{{${tokenVar}}}`, type: 'string' }],
    },
    item: items,
  };
}

function buildFlowsCollection() {
  const saveToken = (prefix) => [
    'const b = pm.response.json();',
    `if (b.accessToken) pm.environment.set('${prefix}AccessToken', b.accessToken);`,
    `if (b.refreshToken) pm.environment.set('${prefix}RefreshToken', b.refreshToken);`,
  ];

  const ownerSetup = folder(
    '1 · Owner — login & setup',
    'ownerAccessToken',
    [
      flowReq('Request OTP (owner)', 'POST', '{{authBaseUrl}}/auth/otp/request', {
        body: { phone: '{{ownerPhone}}' },
        noauth: true,
        description: 'devOtp is auto-saved for the next step.',
      }),
      flowReq('Verify OTP → owner login', 'POST', '{{authBaseUrl}}/auth/otp/verify', {
        body: { phone: '{{ownerPhone}}', otp: '{{devOtp}}', role: 'OWNER' },
        noauth: true,
        test: saveToken('owner'),
        description: 'Saves ownerAccessToken — owner requests use it automatically.',
      }),
      flowReq('Create restaurant', 'POST', '{{restaurantBaseUrl}}/restaurants', {
        body: {
          name: 'Spice Garden {{$timestamp}}',
          description: 'Authentic Indian cuisine',
          address: '123 Main Street, Kochi',
          city: 'Kochi',
        },
        description:
          'restaurantId auto-saves. Name includes a timestamp so re-running the flow never hits the duplicate 409.',
      }),
      flowReq('Add category', 'POST', '{{restaurantBaseUrl}}/restaurants/{{restaurantId}}/categories', {
        body: { name: 'Main Course' },
        description: 'categoryId auto-saves.',
      }),
      flowReq('Add menu item', 'POST', '{{restaurantBaseUrl}}/restaurants/{{restaurantId}}/menu-items', {
        body: {
          name: 'Butter Chicken',
          description: 'Creamy tomato-based curry',
          price: 250.0,
          categoryId: '{{categoryId}}',
        },
        description: 'menuItemId auto-saves.',
      }),
    ],
    'Run top to bottom. Logs in as OWNER and creates a restaurant with one menu item.',
  );

  const customerOrder = folder(
    '2 · Customer — browse & order',
    'customerAccessToken',
    [
      flowReq('Request OTP (customer)', 'POST', '{{authBaseUrl}}/auth/otp/request', {
        body: { phone: '{{customerPhone}}' },
        noauth: true,
      }),
      flowReq('Verify OTP → customer login', 'POST', '{{authBaseUrl}}/auth/otp/verify', {
        body: { phone: '{{customerPhone}}', otp: '{{devOtp}}', role: 'CUSTOMER' },
        noauth: true,
        test: saveToken('customer'),
        description: 'Saves customerAccessToken — customer requests use it automatically.',
      }),
      flowReq('Set my name', 'PATCH', '{{authBaseUrl}}/auth/me', {
        body: { name: 'Test Customer' },
      }),
      flowReq('Browse restaurants', 'GET', '{{restaurantBaseUrl}}/restaurants', {
        noauth: true,
        test: [
          'const arr = pm.response.json();',
          'if (Array.isArray(arr) && arr.length) {',
          "  pm.environment.set('restaurantId', arr[0].id);",
          '}',
        ],
        description:
          'Public. Saves the newest restaurant (the one owner just created) as restaurantId.',
      }),
      flowReq('Restaurant menu', 'GET', '{{restaurantBaseUrl}}/restaurants/{{restaurantId}}', {
        noauth: true,
        test: [
          'const r = pm.response.json();',
          'const items = [...(r.menuItems || []), ...((r.categories || []).flatMap(c => c.menuItems || []))];',
          "if (items.length) pm.environment.set('menuItemId', items[0].id);",
        ],
        description: 'Public. Saves the first available menu item as menuItemId.',
      }),
      flowReq('Place order', 'POST', '{{orderBaseUrl}}/orders', {
        body: {
          restaurantId: '{{restaurantId}}',
          items: [{ menuItemId: '{{menuItemId}}', quantity: 2 }],
        },
        description:
          'Prices are snapshotted server-side; total computed by the backend. orderId auto-saves.',
      }),
      flowReq('My orders', 'GET', '{{orderBaseUrl}}/orders'),
    ],
    'Logs in as CUSTOMER, browses the menu, places an order (status: PENDING).',
  );

  const ownerFulfil = folder(
    '3 · Owner — fulfil the order',
    'ownerAccessToken',
    [
      flowReq('Incoming orders', 'GET', '{{orderBaseUrl}}/orders', {
        description: 'Owner view — orders for their restaurants.',
      }),
      flowReq('Accept order', 'PATCH', '{{orderBaseUrl}}/orders/{{orderId}}/accept'),
      flowReq('Start preparing', 'PATCH', '{{orderBaseUrl}}/orders/{{orderId}}/prepare'),
      flowReq('Mark delivered', 'PATCH', '{{orderBaseUrl}}/orders/{{orderId}}/deliver', {
        description: 'PREPARING → DELIVERED; COD payment flips to PAID.',
      }),
      flowReq('(alt) Reject order', 'PATCH', '{{orderBaseUrl}}/orders/{{orderId}}/reject', {
        description:
          'Alternative to Accept — only valid while the order is PENDING. Expect 400 after the happy path above.',
      }),
    ],
    'Uses ownerAccessToken. Takes the customer order through the full status flow.',
  );

  const customerTrack = folder(
    '4 · Customer — track & cancel',
    'customerAccessToken',
    [
      flowReq('Order details', 'GET', '{{orderBaseUrl}}/orders/{{orderId}}'),
      flowReq('(alt) Cancel order', 'PATCH', '{{orderBaseUrl}}/orders/{{orderId}}/cancel', {
        description:
          'Only valid while PENDING or ACCEPTED. Expect 400 after delivery — place a fresh order in folder 2 to test cancelling.',
      }),
    ],
    'Uses customerAccessToken.',
  );

  const collection = {
    info: {
      name: 'QuickBite — E2E Flows',
      description: {
        content:
          'GENERATED FILE — do not edit; regenerate with `pnpm postman`.\n\nConnected end-to-end script, split by role. Run folders 1 → 4 top to bottom. Owner and customer keep separate tokens (ownerAccessToken / customerAccessToken) so both stay logged in. All ids (restaurantId, categoryId, menuItemId, orderId) chain automatically via response scripts.\n\nRequires services on authBaseUrl/restaurantBaseUrl/orderBaseUrl and dev-mode OTP (devOtp in responses).',
      },
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [ownerSetup, customerOrder, ownerFulfil, customerTrack],
    event: [
      {
        listen: 'test',
        script: { type: 'text/javascript', exec: FLOW_SAVER_SCRIPT },
      },
    ],
    variable: [
      { key: 'customerPhone', value: '+919876500001' },
      { key: 'ownerPhone', value: '+919876500002' },
    ],
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, 'QuickBite-Flows.postman_collection.json');
  fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
  console.log(`✔ QuickBite — E2E Flows → ${path.relative(process.cwd(), outPath)}`);
}

Promise.all(SERVICES.map(convert))
  .then(buildFlowsCollection)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
