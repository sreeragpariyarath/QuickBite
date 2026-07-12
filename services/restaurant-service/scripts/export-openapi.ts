import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { buildOpenApiDocument } from '../src/swagger';

async function run() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = buildOpenApiDocument(app);

  const outDir = join(__dirname, '..', '..', '..', 'docs', 'openapi');
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'restaurant-service.openapi.json');
  writeFileSync(outFile, JSON.stringify(document, null, 2));

  await app.close();
  console.log(`OpenAPI spec written to ${outFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
