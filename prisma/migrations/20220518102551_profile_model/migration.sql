-- CreateTable
CREATE TABLE "Profile" (
    "userId" INTEGER NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "points" INTEGER,
    "level" TEXT NOT NULL DEFAULT E'beginner',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
