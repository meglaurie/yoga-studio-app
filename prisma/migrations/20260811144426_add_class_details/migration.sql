-- CreateEnum
CREATE TYPE "ClassLevel" AS ENUM (
  'BEGINNER',
  'ALL_LEVELS',
  'INTERMEDIATE',
  'ADVANCED'
);

-- Add the new columns as nullable first.
ALTER TABLE "Class"
ADD COLUMN "instructorName" TEXT,
ADD COLUMN "level" "ClassLevel";

-- Populate the existing development classes.
UPDATE "Class"
SET
  "instructorName" = CASE "name"
    WHEN 'Morning Flow' THEN 'Maya Chen'
    WHEN 'Gentle Yoga' THEN 'Sarah Bennett'
    WHEN 'Power Vinyasa' THEN 'Maya Chen'
    WHEN 'Yin & Restore' THEN 'Emma Wilson'
    WHEN 'Weekend Flow' THEN 'Sarah Bennett'
    ELSE 'Stillwater Yoga'
  END,
  "level" = CASE "name"
    WHEN 'Morning Flow' THEN 'ALL_LEVELS'::"ClassLevel"
    WHEN 'Gentle Yoga' THEN 'BEGINNER'::"ClassLevel"
    WHEN 'Power Vinyasa' THEN 'INTERMEDIATE'::"ClassLevel"
    WHEN 'Yin & Restore' THEN 'ALL_LEVELS'::"ClassLevel"
    WHEN 'Weekend Flow' THEN 'ALL_LEVELS'::"ClassLevel"
    ELSE 'ALL_LEVELS'::"ClassLevel"
  END;

-- Now that every existing row has values, make the columns required.
ALTER TABLE "Class"
ALTER COLUMN "instructorName" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL;