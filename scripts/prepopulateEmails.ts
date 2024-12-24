import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const appDevEmails = [
  'aa2328@cornell.edu'
];

async function main() {
  for (const email of appDevEmails) {
    await prisma.email.upsert({
      where: { email: email },
      create: { email: email },
      update: {},
    })
  }
  console.log(await prisma.email.findMany());
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
