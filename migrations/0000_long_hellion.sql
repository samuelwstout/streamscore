CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text,
	`title` text,
	`messages` blob
);
--> statement-breakpoint
CREATE INDEX `userId_index` ON `conversations` (`userId`);