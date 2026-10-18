import { google, sheets_v4 } from "googleapis";

export type ReservationSheetRow = {
  id: string | number;
  createdAt: Date;
  packageKey: string;
  amount: number;
  fullName: string;
  messenger: string;
  contactNumber: string;
  status: string;
};

const SHEET_RANGE = "'reservations-3.csv'!A:H";

let cachedClient: sheets_v4.Sheets | null = null;

function getSheetsClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_B64;

  if (!encoded) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_B64 is not configured.");
  }

  const credentials = JSON.parse(
    Buffer.from(encoded, "base64").toString("utf8"),
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

function neutralize(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function resolveSpreadsheetId(value: string) {
  const match = value.trim().match(/\/spreadsheets\/d\/([A-Za-z0-9-_]+)/);
  return match ? match[1] : value.trim();
}

export async function appendReservationToSheet(row: ReservationSheetRow) {
  const configuredId = process.env.SHEET_ID;

  if (!configuredId) {
    throw new Error("SHEET_ID is not configured.");
  }

  await getSheetsClient().spreadsheets.values.append({
    spreadsheetId: resolveSpreadsheetId(configuredId),
    range: SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          String(row.id),
          row.createdAt.toISOString(),
          row.packageKey,
          String(row.amount),
          neutralize(row.fullName),
          neutralize(row.messenger),
          neutralize(row.contactNumber),
          neutralize(row.status),
        ],
      ],
    },
  });
}
