-- Normalize existing company names (trim, collapse whitespace, lowercase) before
-- enforcing case-insensitive uniqueness via a single unique column.
UPDATE "Company"
SET "name" = lower(regexp_replace(btrim("name"), '\s+', ' ', 'g'));

-- DropIndex
DROP INDEX "Company_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");
