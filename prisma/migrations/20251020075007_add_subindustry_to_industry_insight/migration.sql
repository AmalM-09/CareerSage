/*
  Warnings:

  - A unique constraint covering the columns `[industry,subIndustry]` on the table `IndustryInsight` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."IndustryInsight_industry_idx";

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_subIndustry_idx" ON "public"."IndustryInsight"("industry", "subIndustry");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryInsight_industry_subIndustry_key" ON "public"."IndustryInsight"("industry", "subIndustry");
