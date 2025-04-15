import { PrismaClient } from '@prisma/client';
import { Client } from '@notionhq/client';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

const prisma = new PrismaClient();
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function fetchAllUsers(databaseId: string) {
  let allUsers: (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
    });

    allUsers = allUsers.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return allUsers;
}

async function main() {
  const databaseId = process.env.NOTION_ROSTER_DATABASE_ID!;
  const allUsers = await fetchAllUsers(databaseId);

  for (const user of allUsers) {
    // @ts-ignore
    const properties = user.properties;
    const email = properties.Email.formula.string;
    const isAppDev = true;

    await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        isAppDev: isAppDev,
      },
      create: {
        email: email,
        isAppDev: isAppDev,
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
