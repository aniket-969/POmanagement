-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('creator', 'approver', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'suspended');
 
-- CreateEnum
CREATE TYPE "PoStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PoAction" AS ENUM ('created', 'updated', 'submitted', 'approved', 'rejected', 'comment_added');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" SERIAL NOT NULL,
    "po_number" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "status" "PoStatus" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "submitted_at" TIMESTAMPTZ(6),
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_history" (
    "id" SERIAL NOT NULL,
    "po_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "action" "PoAction" NOT NULL,
    "description" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "po_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE INDEX "idx_po_status" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "idx_po_created_by" ON "purchase_orders"("created_by");

-- CreateIndex
CREATE INDEX "idx_po_created_at" ON "purchase_orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_po_submitted_at" ON "purchase_orders"("submitted_at");

-- CreateIndex
CREATE INDEX "idx_po_reviewed_by" ON "purchase_orders"("reviewed_by");

-- CreateIndex
CREATE INDEX "idx_po_history_po_id" ON "po_history"("po_id");

-- CreateIndex
CREATE INDEX "idx_po_history_po_created" ON "po_history"("po_id", "created_at", "id");

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_history" ADD CONSTRAINT "po_history_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_history" ADD CONSTRAINT "po_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
