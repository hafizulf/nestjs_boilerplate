-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "avatar_path" VARCHAR(255),
    "created_at" VARCHAR(100) NOT NULL,
    "updated_at" VARCHAR(100) NOT NULL,
    "deleted_at" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
