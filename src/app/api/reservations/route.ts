import { NextResponse } from "next/server";
import {
  getDatabase,
  getPackageAmount,
  isPackageKey,
} from "@/lib/reservations";

type ReservationPayload = {
  package?: unknown;
  fullName?: unknown;
  messenger?: unknown;
  contactNumber?: unknown;
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: ReservationPayload;

  try {
    payload = (await request.json()) as ReservationPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_REQUEST" }, { status: 400 });
  }

  const packageKey = textValue(payload.package);
  const fullName = textValue(payload.fullName);
  const messenger = textValue(payload.messenger);
  const contactNumber = textValue(payload.contactNumber);

  if (
    !isPackageKey(packageKey) ||
    !fullName ||
    !messenger ||
    !contactNumber ||
    fullName.length > 200 ||
    messenger.length > 300 ||
    contactNumber.length > 50
  ) {
    return NextResponse.json({ ok: false, error: "INVALID_REQUEST" }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const amount = getPackageAmount(packageKey);

    await sql`
      INSERT INTO reservations (
        package_key,
        amount,
        full_name,
        messenger,
        contact_number,
        status
      )
      VALUES (
        ${packageKey},
        ${amount},
        ${fullName},
        ${messenger},
        ${contactNumber},
        'Not Reviewed/New'
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save reservation.", error);
    return NextResponse.json({ ok: false, error: "DATABASE_ERROR" }, { status: 500 });
  }
}
