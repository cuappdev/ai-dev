import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const appDevEmails = ['a@cornell.edu', 'b@cornell.edu', 'c@cornell.edu'];

async function main() {
  for (const email of appDevEmails) {
    await prisma.email.upsert({
      where: { email: email },
      create: { email: email },
      update: {},
    });
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
