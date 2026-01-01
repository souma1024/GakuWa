-- CreateTable
CREATE TABLE `article_tags` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `articleId` BIGINT NOT NULL,
    `tagId` INTEGER NOT NULL,

    UNIQUE INDEX `article_tags_articleId_tagId_key`(`articleId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
