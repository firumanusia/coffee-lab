-- Reshape Bean (variety-first; drop process/roast/agtron, add category + cupPotential)
-- and Process (standalone name/description/flavor). Rows are re-seeded, so clear first
-- to allow adding NOT NULL columns on previously-populated tables.
DELETE FROM "Bean";
DELETE FROM "Process";

ALTER TABLE "Bean"
  DROP COLUMN IF EXISTS "aroma",
  DROP COLUMN IF EXISTS "elevation",
  DROP COLUMN IF EXISTS "processes",
  DROP COLUMN IF EXISTS "roastIdeal",
  DROP COLUMN IF EXISTS "agtron",
  ADD COLUMN "category" TEXT NOT NULL,
  ADD COLUMN "cupPotential" TEXT NOT NULL;

ALTER TABLE "Process"
  DROP COLUMN IF EXISTS "nameId",
  DROP COLUMN IF EXISTS "nameEn",
  DROP COLUMN IF EXISTS "extraction",
  DROP COLUMN IF EXISTS "flavorId",
  DROP COLUMN IF EXISTS "flavorEn",
  ADD COLUMN "name" TEXT NOT NULL,
  ADD COLUMN "description" TEXT NOT NULL,
  ADD COLUMN "flavor" TEXT NOT NULL;
