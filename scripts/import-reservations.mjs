import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const source = process.argv[2];

if (!source) {
  console.error("Usage: npm run import:reservations -- <csv-file-or-url>");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

let csv;
if (source.startsWith("http")) {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Could not download CSV (${response.status}).`);
  }
  csv = await response.text();
} else {
  csv = await readFile(source, "utf8");
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
  }

  return rows;
}

const rows = parseCsv(csv);
const headers = rows.shift()?.map((header) => header.toLowerCase()) ?? [];
const column = (row, name) => row[headers.indexOf(name)] ?? "";
const sql = neon(process.env.DATABASE_URL);
let imported = 0;

for (const row of rows) {
  const packageKey = column(row, "package").toLowerCase();
  const fullName = column(row, "full name");
  const messenger = column(row, "messenger");
  const contactNumber = column(row, "contact number");
  const status = column(row, "status") || "Not Reviewed/New";
  const timestamp = column(row, "timestamp");
  const amount = Number(column(row, "amount").replace(/[^\d.-]/g, ""));
  const createdAt = timestamp ? new Date(timestamp) : new Date();

  if (
    !["eclipse", "prestige"].includes(packageKey) ||
    !fullName ||
    !messenger ||
    !contactNumber ||
    !Number.isFinite(amount) ||
    Number.isNaN(createdAt.getTime())
  ) {
    console.warn("Skipping invalid row:", row);
    continue;
  }

  await sql`
    INSERT INTO reservations (
      created_at,
      package_key,
      amount,
      full_name,
      messenger,
      contact_number,
      status
    )
    VALUES (
      ${createdAt},
      ${packageKey},
      ${amount},
      ${fullName},
      ${messenger},
      ${contactNumber},
      ${status}
    )
  `;
  imported += 1;
}

console.log(`Imported ${imported} reservation(s).`);
