-- DropIndex
DROP INDEX "public"."IndustryInsight_industry_subIndustry_idx";

-- DropIndex
DROP INDEX "public"."IndustryInsight_industry_subIndustry_key";

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_idx" ON "public"."IndustryInsight"("industry");
