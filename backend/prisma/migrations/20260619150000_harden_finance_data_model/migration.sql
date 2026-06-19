-- Tie categories to users so one user cannot read or mutate another user's categories.
ALTER TABLE "public"."categories" ADD COLUMN "userId" INTEGER;

-- Backfill is intentionally conservative for existing development data.
-- For production imports, assign categories to the correct owner before making this NOT NULL.
UPDATE "public"."categories"
SET "userId" = (SELECT "id" FROM "public"."users" ORDER BY "id" ASC LIMIT 1)
WHERE "userId" IS NULL;

ALTER TABLE "public"."categories" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "public"."categories"
ADD CONSTRAINT "categories_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "categories_userId_name_key" ON "public"."categories"("userId", "name");
CREATE INDEX "categories_userId_idx" ON "public"."categories"("userId");

-- Financial amounts should not use floating point storage.
ALTER TABLE "public"."Expense"
ALTER COLUMN "amount" TYPE DECIMAL(12, 2)
USING ROUND("amount"::numeric, 2);

CREATE INDEX "Expense_userId_date_idx" ON "public"."Expense"("userId", "date");
CREATE INDEX "Expense_categoryId_idx" ON "public"."Expense"("categoryId");
