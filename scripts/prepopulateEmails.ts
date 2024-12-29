import { PrismaClient } from '@prisma/client';
import { upsertAppDevUser } from '../src/app/utils/databaseUtils';

const prisma = new PrismaClient();

const appDevEmails = ['a@cornell.edu', 'b@cornell.edu', 'c@cornell.edu'];

async function main() {
  for (const email of appDevEmails) {
    await upsertAppDevUser(email);
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
