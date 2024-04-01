ALTER TABLE `anshin_wishlist_items` DROP FOREIGN KEY `anshin_wishlist_items_wishlist_id_anshin_wishlist_id_fk`;
--> statement-breakpoint
ALTER TABLE `anshin_wishlist_items` ADD CONSTRAINT `anshin_wishlist_items_wishlist_id_anshin_wishlist_id_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `anshin_wishlist`(`id`) ON DELETE cascade ON UPDATE no action;