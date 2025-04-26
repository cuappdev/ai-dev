import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { notion } from '../../notion';

// Caches the attendance data to avoid fetching it multiple times in a day
let cachedAttendanceData: string | null = null;
let lastAttendanceQueryDate: Date | null = null;

// Caches the pod data to avoid fetching it multiple times in a day
let cachedPodData: Record<string, { data: string; lastQueryDate: Date }> | null = null;

export async function notionDispatch(message: string): Promise<string> {
  const wordSet = new Set<string>(message.trim().toLowerCase().split(' '));
  if (wordSet.has('slip') && (wordSet.has('day') || wordSet.has('days'))) {
    message = await appendSlipDays(message);
  }
  if (wordSet.has('eatery')) {
    message = await appendPodData(message, 'eatery', process.env.SP25_EATERY_DATABASE!);
  }
  if (wordSet.has('resell')) {
    message = await appendPodData(message, 'resell', process.env.SP25_RESELL_DATABASE!);
  }
  if (wordSet.has('uplift')) {
    message = await appendPodData(message, 'uplift', process.env.SP25_UPLIFT_DATABASE!);
  }
  if (wordSet.has('transit')) {
    message = await appendPodData(message, 'transit', process.env.SP25_TRANSIT_DATABASE!);
  }
  if (wordSet.has('score')) {
    message = await appendPodData(message, 'score', process.env.SP25_SCORE_DATABASE!);
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
    console.time('fetchAttendanceData');
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

    console.timeEnd('fetchAttendanceData');
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
    lastAttendanceQueryDate &&
    lastAttendanceQueryDate.toDateString() === today.toDateString()
  ) {
    return cachedAttendanceData;
  }

  // Update cache
  cachedAttendanceData = await fetchAttendanceData();
  lastAttendanceQueryDate = today;
  return cachedAttendanceData;
}

async function appendPodData(message: string, podName: string, pageId: string): Promise<string> {
  const podData = await getCachedPodData(podName, pageId);
  message += `\n${podName} Info:\n`;
  message += podData;
  return message;
}

async function fetchPodData(podName: string, databaseId: string): Promise<string> {
  let allResults: (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  try {
    console.time('fetchPodData');
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
      });

      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }

    let podData = 'Name|Subteam|Status|Due Date\n';
    // name, status, subteam, due date
    podData += allResults
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
          const name = props['Name']?.title[0]?.text?.content ?? '?';
          const status = props['Status']?.status?.name ?? '?';
          const subteam = props['Subteam']?.multi_select?.[0]?.name ?? '?';
          const dueDate = props['Due Date']?.date?.start ?? '?';

          return `${name}|${subteam}|${status}|${dueDate}`;
        },
      )
      .join('\n');
    console.log('Pod data:', podData);

    console.timeEnd('fetchPodData');
    return podData;
  } catch (err) {
    console.error('Notion query failed:', err);
    return `[Error fetching ${podName} info from Notion]`;
  }
}

async function getCachedPodData(podName: string, podId: string): Promise<string> {
  const today = new Date();
  if (
    cachedPodData &&
    cachedPodData[podName] &&
    cachedPodData[podName].lastQueryDate.toDateString() === today.toDateString()
  ) {
    return cachedPodData[podName].data;
  }

  // Update cache
  const podData = await fetchPodData(podName, podId);
  cachedPodData = {
    ...cachedPodData,
    [podName]: {
      data: podData,
      lastQueryDate: today,
    },
  };
  return podData;
}
