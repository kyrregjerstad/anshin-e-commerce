CREATE TABLE `anshin_address` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`street_address_1` varchar(255) NOT NULL,
	`street_address_2` varchar(255),
	`city` varchar(255),
	`state` varchar(255),
	`postal_code` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`type` enum('shipping','billing') NOT NULL,
	CONSTRAINT `anshin_address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_cart` (
	`id` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`session_id` varchar(64),
	`user_id` varchar(64),
	CONSTRAINT `anshin_cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_cart_items` (
	`cart_id` varchar(64) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` smallint unsigned NOT NULL,
	CONSTRAINT `anshin_cart_items_cart_id_product_id_pk` PRIMARY KEY(`cart_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_images` (
	`id` varchar(36) NOT NULL,
	`url` varchar(255) NOT NULL,
	`alt` varchar(255) NOT NULL,
	`item_id` varchar(36),
	CONSTRAINT `anshin_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_order_items` (
	`order_id` varchar(36),
	`product_id` varchar(36),
	`quantity` smallint unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `anshin_orders` (
	`id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`user_id` varchar(64),
	`status` enum('pending','completed','cancelled'),
	CONSTRAINT `anshin_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_products` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(1000) NOT NULL,
	`price_in_cents` int unsigned NOT NULL,
	`discount_in_cents` int unsigned NOT NULL,
	CONSTRAINT `anshin_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_reviews` (
	`id` varchar(36) NOT NULL,
	`username` varchar(255) NOT NULL,
	`rating` tinyint unsigned NOT NULL,
	`description` varchar(1000) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	CONSTRAINT `anshin_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_sessions` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64),
	`refresh_token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `anshin_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_tags` (
	`tag_name` varchar(255) NOT NULL,
	`item_id` varchar(36),
	CONSTRAINT `anshin_tags_tag_name` PRIMARY KEY(`tag_name`)
);
--> statement-breakpoint
CREATE TABLE `anshin_users` (
	`id` varchar(64) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`hashed_password` varchar(255) NOT NULL,
	CONSTRAINT `anshin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `anshin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `anshin_wishlist` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`public` boolean NOT NULL DEFAULT false,
	CONSTRAINT `anshin_wishlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anshin_wishlist_items` (
	`wishlist_id` varchar(64) NOT NULL,
	`product_id` varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `anshin_address` ADD CONSTRAINT `anshin_address_user_id_anshin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `anshin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_cart` ADD CONSTRAINT `anshin_cart_session_id_anshin_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `anshin_sessions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_cart` ADD CONSTRAINT `anshin_cart_user_id_anshin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `anshin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_cart_items` ADD CONSTRAINT `anshin_cart_items_cart_id_anshin_cart_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `anshin_cart`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_cart_items` ADD CONSTRAINT `anshin_cart_items_product_id_anshin_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `anshin_products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_images` ADD CONSTRAINT `anshin_images_item_id_anshin_products_id_fk` FOREIGN KEY (`item_id`) REFERENCES `anshin_products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_order_items` ADD CONSTRAINT `anshin_order_items_order_id_anshin_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `anshin_orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_order_items` ADD CONSTRAINT `anshin_order_items_product_id_anshin_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `anshin_products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_orders` ADD CONSTRAINT `anshin_orders_user_id_anshin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `anshin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_reviews` ADD CONSTRAINT `anshin_reviews_item_id_anshin_products_id_fk` FOREIGN KEY (`item_id`) REFERENCES `anshin_products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_sessions` ADD CONSTRAINT `anshin_sessions_user_id_anshin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `anshin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_tags` ADD CONSTRAINT `anshin_tags_item_id_anshin_products_id_fk` FOREIGN KEY (`item_id`) REFERENCES `anshin_products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_wishlist` ADD CONSTRAINT `anshin_wishlist_user_id_anshin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `anshin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_wishlist_items` ADD CONSTRAINT `anshin_wishlist_items_wishlist_id_anshin_wishlist_id_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `anshin_wishlist`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anshin_wishlist_items` ADD CONSTRAINT `anshin_wishlist_items_product_id_anshin_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `anshin_products`(`id`) ON DELETE no action ON UPDATE no action;