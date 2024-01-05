-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Giveaways" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Giveaways_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Session" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Giveaways" ("createdAt", "end_date", "end_time", "id", "name", "short_name", "start_date", "start_time") SELECT "createdAt", "end_date", "end_time", "id", "name", "short_name", "start_date", "start_time" FROM "Giveaways";
DROP TABLE "Giveaways";
ALTER TABLE "new_Giveaways" RENAME TO "Giveaways";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
