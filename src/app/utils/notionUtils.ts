import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { notion } from '../../notion';

// Caches the attendance data to avoid fetching it multiple times in a day
let cachedAttendanceData: string | null = null;
let lastQueryDate: Date | null = null;

export async function notionDispatch(message: string): Promise<string> {
  let dispatched = false;
  const wordSet = new Set<string>(message.trim().toLowerCase().split(' '));
  if (wordSet.has('slip') && (wordSet.has('day') || wordSet.has('days'))) {
    message = await appendSlipDays(message);
    dispatched = true;
  }

  if (dispatched) {
    message +=
      '\nYou are a customer service agent that helps a customer with answering questions. Please answer the question based on the provided context above. Make sure not to make any changes to the context, if possible, when preparing answers to provide accurate responses.  If the answer cannot be found in context, just politely say that you do not know, do not try to make up an answer.';
  }
  return message;
}

async function appendSlipDays(message: string): Promise<string> {
  const attendanceData = await getCachedAttendanceData();
  message += '\nAttendance Info:\n';
  message += attendanceData;
  return message;
}

async function fetchAttendanceData(): Promise<string> {
  const databaseId = process.env.SP25_NOTION_ATTENDANCE_DATABASE_ID!;
  let allResults: (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  try {
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        filter: {
          property: 'Status',
          select: {
            equals: 'Active',
          },
        },
      });

      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }

    let attendanceData = 'Name|Absence Dates|Late Dates|IWS Makeups|Slip Days Remaining\n';
    attendanceData += allResults
      .map(
        (
          row:
            | PageObjectResponse
            | PartialPageObjectResponse
            | PartialDatabaseObjectResponse
            | DatabaseObjectResponse,
        ) => {
          // @ts-ignore
          const props = row.properties || {};
          const firstName = props['First Name']?.title?.[0]?.text?.content ?? '';
          const lastName = props['Last Name']?.rich_text?.[0]?.plain_text ?? '';
          const absences = props['Absence Dates']?.rich_text?.[0]?.plain_text ?? 'None';
          const lates = props['Late Dates']?.rich_text?.[0]?.plain_text ?? 'None';
          const iws = props['IWS Makeups']?.rich_text?.[0]?.plain_text ?? 'None';
          const slipDays = props['Slip Days Remaining']?.formula?.number ?? 3;

          return `${firstName} ${lastName}|${absences}|${lates}|${iws}|${slipDays}`;
        },
      )
      .join('\n');

    return attendanceData;
  } catch (err) {
    console.error('Notion query failed:', err);
    return '[Error fetching slip day info from Notion]';
  }
}

async function getCachedAttendanceData(): Promise<string> {
  const today = new Date();
  if (
    cachedAttendanceData &&
    lastQueryDate &&
    lastQueryDate.toDateString() === today.toDateString()
  ) {
    return cachedAttendanceData;
  }

  // Update cache
  cachedAttendanceData = await fetchAttendanceData();
  lastQueryDate = today;
  return cachedAttendanceData;
}
