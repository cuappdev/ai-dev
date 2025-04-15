import { notion } from '../../notion';

export async function notionDispatch(message: string): Promise<string> {
  const wordSet = new Set<string>(message.trim().toLowerCase().split(' '));
  if (wordSet.has('slip') && (wordSet.has('day') || wordSet.has('days'))) {
    message = await appendSlipDays(message);
  }
  return message;
}

async function appendSlipDays(message: string): Promise<string> {
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

    message += '\nAttendance and Slip Day Information:\n';
    message += `Name | Absence Dates | Late Dates | IWS Makeups | Slip Days Remaining\n`;

    message += response.results
      .map((row: any) => {
        const props = row.properties || {};
        const firstName = props['First Name']?.title?.[0]?.text?.content ?? 'Unknown';
        const lastName = props['Last Name']?.rich_text?.[0]?.plain_text ?? '';
        const absences = props['Absence Dates']?.rich_text?.[0]?.plain_text ?? '';
        const lates = props['Late Dates']?.rich_text?.[0]?.plain_text ?? '';
        const iws = props['IWS Makeups']?.rich_text?.[0]?.plain_text ?? '';
        const slipDays = props['Slip Days Remaining']?.formula?.number ?? 0;

        return `${firstName} ${lastName} | ${absences} | ${lates} | ${iws} | ${slipDays}`;
      })
      .join('\n');
    return message;
  } catch (err) {
    console.error('Notion query failed:', err);
    message += '\n[Error fetching slip day info from Notion]\n';
    return message;
  }
}
