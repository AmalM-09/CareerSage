-- CreateTable
CREATE TABLE "public"."SkillPath" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recommendedSkills" TEXT[],
    "learningPath" TEXT[],
    "resources" TEXT[],
    "personalizedAdvice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillPath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillPath_userId_key" ON "public"."SkillPath"("userId");

-- AddForeignKey
ALTER TABLE "public"."SkillPath" ADD CONSTRAINT "SkillPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
