-- CreateTable
CREATE TABLE "Guest" (
    "phone_number" TEXT NOT NULL,
    "country_code" TEXT NOT NULL DEFAULT 'portugal',
    "name" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("phone_number")
);
