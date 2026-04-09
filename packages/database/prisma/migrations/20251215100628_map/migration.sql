-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "configJson" JSONB NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);
