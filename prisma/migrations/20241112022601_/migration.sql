/*
  Warnings:

  - A unique constraint covering the columns `[invite-url]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guest_invite-url_key" ON "Guest"("invite-url");
