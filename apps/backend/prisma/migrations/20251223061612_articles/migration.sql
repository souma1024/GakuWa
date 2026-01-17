-- CreateTable
CREATE TABLE `articles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `handle` VARCHAR(50) NOT NULL,
    `author_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content_md` TEXT NOT NULL,
    `content_html` TEXT NOT NULL,
    `likes_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `bookmarks_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `views_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `articles_handle_key`(`handle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
