-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_address_key" ON "Contract"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_website_key" ON "Contract"("website");
