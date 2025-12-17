import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
  const passwordHash = await bcrypt.hash('password', 10)

  await prisma.user.create({
    data: {
      handle: '@abcde',
      name: 'テストユーザー',
      email: 'test@aaa.ac.jp',
      passwordHash,
      status: 'active',
    },
  })

  console.log('seed 完了')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
