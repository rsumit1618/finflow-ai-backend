-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE INDEX "documents_category_idx" ON "public"."documents"("category");
