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
  const wordSet = new Set<string>(message.trim().toLowerCase().split(' '));
  if (wordSet.has('slip') && (wordSet.has('day') || wordSet.has('days'))) {
    message = await appendSlipDays(message);
  }
  if (wordSet.has('eatery')) {
    message = await appendPod(message, 'eatery', process.env.SP25_EATERY_NOTION!);
  }
  if (wordSet.has('resell')) {
    message = await appendPod(message, 'resell', process.env.SP25_RESELL_NOTION!);
  }
  if (wordSet.has('uplift')) {
    message = await appendPod(message, 'uplift', process.env.SP25_UPLIFT_NOTION!);
  }
  if (wordSet.has('transit')) {
    message = await appendPod(message, 'transit', process.env.SP25_TRANSIT_NOTION!);
  }
  if (wordSet.has('score')) {
    message = await appendPod(message, 'score', process.env.SP25_SCORE_NOTION!);
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

async function appendPod(message: string, podName: string, pageId: string): Promise<string> {
  const podData = await fetchPodData(podName, pageId);
  message += '\nPod Info:\n';
  message += podData;
  return message;
}

async function fetchPodData(podName: string, pageId: string): Promise<string> {
  let allResults: (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[] = [];
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(response);

  // let hasMore = true;
  // let startCursor: string | undefined = undefined;

  try {
    // while (hasMore) {
    //   const response = await notion.databases.query({
    //     database_id: podPageId,
    //     start_cursor: startCursor,
    //   });

    //   allResults = allResults.concat(response.results);
    //   hasMore = response.has_more;
    //   startCursor = response.next_cursor ?? undefined;
    // }

    let podData = 'Name|Pod|Status\n';
    // podData += allResults
    //   .map(
    //     (
    //       row:
    //         | PageObjectResponse
    //         | PartialPageObjectResponse
    //         | PartialDatabaseObjectResponse
    //         | DatabaseObjectResponse,
    //     ) => {
    //       // @ts-ignore
    //       const props = row.properties || {};
    //       const firstName = props['First Name']?.title?.[0]?.text?.content ?? '';
    //       const lastName = props['Last Name']?.rich_text?.[0]?.plain_text ?? '';
    //       const pod = props['Pod']?.select?.name ?? 'None';
    //       const status = props['Status']?.select?.name ?? 'None';

    //       return `${firstName} ${lastName}|${pod}|${status}`;
    //     },
    //   )
    //   .join('\n');

    return podData;
  } catch (err) {
    console.error('Notion query failed:', err);
    return `[Error fetching ${podName} info from Notion]`;
  }
}
