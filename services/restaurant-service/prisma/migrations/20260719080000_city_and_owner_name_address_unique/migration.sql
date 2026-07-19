-- City field for restaurant discovery; backfill existing dev rows
ALTER TABLE "restaurants" ADD COLUMN "city" TEXT;
UPDATE "restaurants" SET "city" = 'Kochi' WHERE "city" IS NULL;
ALTER TABLE "restaurants" ALTER COLUMN "city" SET NOT NULL;

-- Same owner cannot create the same restaurant twice at the same address.
-- Names stay non-unique globally (same-name restaurants are a market reality).
CREATE UNIQUE INDEX "restaurants_ownerId_name_address_key" ON "restaurants"("ownerId", "name", "address");

-- CreateIndex
CREATE INDEX "restaurants_city_idx" ON "restaurants"("city");
