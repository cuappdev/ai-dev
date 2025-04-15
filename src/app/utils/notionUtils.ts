import { notion } from '../../notion';

// Caches the attendance data to avoid fetching it multiple times in a day
let cachedAttendanceData: string | null = null;
let lastQueryDate: Date | null = null;

export async function notionDispatch(message: string): Promise<string> {
  const wordSet = new Set<string>(message.trim().toLowerCase().split(' '));
  if (wordSet.has('slip') && (wordSet.has('day') || wordSet.has('days'))) {
    message = await appendSlipDays(message);
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
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Active',
        },
      },
    });

    let attendanceData = 'Name|Absence Dates|Late Dates|IWS Makeups|Slip Days Remaining\n';
    attendanceData += response.results
      .map((row: any) => {
        const props = row.properties || {};
        const firstName = props['First Name']?.title?.[0]?.text?.content ?? '';
        const lastName = props['Last Name']?.rich_text?.[0]?.plain_text ?? '';
        const absences = props['Absence Dates']?.rich_text?.[0]?.plain_text ?? '';
        const lates = props['Late Dates']?.rich_text?.[0]?.plain_text ?? '';
        const iws = props['IWS Makeups']?.rich_text?.[0]?.plain_text ?? '';
        const slipDays = props['Slip Days Remaining']?.formula?.number ?? 0;

        return `${firstName} ${lastName}|${absences}|${lates}|${iws}|${slipDays}`;
      })
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
