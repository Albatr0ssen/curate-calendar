ALTER TABLE `calendars` ADD `pid` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_calendars` (
	`id` text PRIMARY KEY,
	`pid` text UNIQUE,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	CONSTRAINT `fk_calendars_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_calendars`(`id`, `user_id`, `name`, `url`) SELECT `id`, `user_id`, `name`, `url` FROM `calendars`;--> statement-breakpoint
DROP TABLE `calendars`;--> statement-breakpoint
ALTER TABLE `__new_calendars` RENAME TO `calendars`;--> statement-breakpoint
PRAGMA foreign_keys=ON;