const SHEET_NAME = "Reservations";
const PACKAGE_KEYS = { eclipse: true, prestige: true };

function doGet(request) {
  return jsonResponse({ ok: true });
}

function doPost(request) {
  let lock;
  let lockAcquired = false;

  try {
    const payload = JSON.parse(request.postData.contents);
    const packageKey = String(payload.package || "").toLowerCase();

    if (!PACKAGE_KEYS[packageKey]) {
      return jsonResponse({ ok: false, error: "INVALID_PACKAGE" });
    }

    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    lockAcquired = true;

    const sheet = getReservationsSheet();

    sheet.appendRow([
      new Date(),
      packageKey,
      payload.amount,
      payload.fullName,
      payload.messenger,
      payload.contactNumber,
      "Not Reviewed/New",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

function getReservationsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("This script must be bound to the reservations Google Sheet.");
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Package",
      "Amount",
      "Full Name",
      "Messenger",
      "Contact Number",
      "Status",
    ]);
  }

  return sheet;
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
