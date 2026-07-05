import { Article, ArticleStatus, PrismaClient, Tag, User, UserStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { uuidGenerator } from '../src/utils/uuidGenerator';


const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "Password123!";
const SALT_ROUNDS = 10;
const STATUS: UserStatus = 'active';
const TAGS = ['react', 'javascript', 'docker', 'git', 'github', 'nginx', 'php', 'SVN', 'docker compose', '応用情報技術者試験', '基本情報技術者試験', 'ITパスポート', '情報セキュリティ', 'AI', 'claude mythos', 'GO', 'ruby', 'python', 'node.js', 'vercel'];
const ARTICLE_STATUS: ArticleStatus[] = ['draft', 'published', 'archived'];

async function main() {
    // ユーザテーブルに20件新規作成
    let users: User[]         = [];
    let tags: Tag[]           = [];
    let articles: Article[]   = [];

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    for (let i:number = 0; i < 20; i++) {
        const name = faker.person.fullName();
        const handle = `user${i + 1}`;
        const email = `${handle}@test.ac.jp`;

        const user =  await prisma.user.create({
            data: {
               name: name,
               email: email,
               handle: handle,
               passwordHash: passwordHash,
               status: STATUS,
            }
        });
        users.push(user);
    }

    // タグテーブルに20件新規登録
    for (const name of TAGS) {
        const tag = await prisma.tag.create({
            data: {
                name: name
            }
        });
        tags.push(tag);
    }

    // 記事テーブルに60件新規作成
    for (let i:number = 0; i < 60; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randStatus: number = Math.floor(Math.random() * ARTICLE_STATUS.length);
        const article = await prisma.article.create({
            data: {
                title: 'これはテストです！！！' + randomUser.id,
                handle: uuidGenerator(),
                contentMd: '## hello#  hello### HELLO',
                contentHtml: '<h2>hello</h2><h1>hello</h1><h3>HELLO</h3>',
                author: { connect: { id: randomUser.id}},
                status: ARTICLE_STATUS[randStatus],
            }
        });
        articles.push(article);
    }

    // 記事タグテーブルに新規登録
    for (const article of articles) {
        const tagCount = Math.floor(Math.random() * 4) + 1;
        const selectedTags = faker.helpers.arrayElements(tags, tagCount);
        for (const tag of selectedTags) {
            await prisma.articleTag.create({
            data: {
                articleId: article.id,
                tagId: tag.id,
            },
            });
        }
    }

    // イベントテーブルに新規登録
    for (let i: number = 0; i < 10; i++) {
        const difficulty: number = Math.floor(Math.random() * 5) + 1;
        await prisma.event.create({
            data: {
                name: 'EVENT ' + String(i + 1),
                details: 'これはテストです。これはテストです。これはテストです。これはテストです。これはテストです。',
                difficulty: difficulty,
                startDateTime: faker.date.soon({ days: 30 })
            }
        })
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });