-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "attendeeCount" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "creditCount" INTEGER;

-- CreateTable
CREATE TABLE "ClassPass" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "remainingCredits" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingCreditUsage" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "classPassId" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingCreditUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassPass_purchaseId_key" ON "ClassPass"("purchaseId");

-- CreateIndex
CREATE INDEX "ClassPass_userId_idx" ON "ClassPass"("userId");

-- CreateIndex
CREATE INDEX "ClassPass_expiresAt_idx" ON "ClassPass"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_purchaseId_key" ON "Membership"("purchaseId");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_expiresAt_idx" ON "Membership"("expiresAt");

-- CreateIndex
CREATE INDEX "BookingCreditUsage_bookingId_idx" ON "BookingCreditUsage"("bookingId");

-- CreateIndex
CREATE INDEX "BookingCreditUsage_classPassId_idx" ON "BookingCreditUsage"("classPassId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCreditUsage_bookingId_classPassId_key" ON "BookingCreditUsage"("bookingId", "classPassId");

-- AddForeignKey
ALTER TABLE "ClassPass" ADD CONSTRAINT "ClassPass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassPass" ADD CONSTRAINT "ClassPass_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCreditUsage" ADD CONSTRAINT "BookingCreditUsage_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCreditUsage" ADD CONSTRAINT "BookingCreditUsage_classPassId_fkey" FOREIGN KEY ("classPassId") REFERENCES "ClassPass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
