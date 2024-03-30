ALTER TABLE `anshin_order_items` MODIFY COLUMN `order_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `anshin_order_items` MODIFY COLUMN `product_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `anshin_order_items` ADD `price_in_cents` int unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `anshin_order_items` ADD `discount_in_cents` int unsigned NOT NULL;