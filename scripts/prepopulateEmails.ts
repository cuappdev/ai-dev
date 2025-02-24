import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: Finish
const appDevEmails = ['a@cornell.edu', 'b@cornell.edu', 'c@cornell.edu'];

async function main() {
  for (const email of appDevEmails) {
    await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        isAppDev: true,
      },
      create: {
        email: email,
        isAppDev: true,
      },
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
