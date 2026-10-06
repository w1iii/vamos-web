const SHEET_NAME = "Reservations";
const SLOT_LIMITS = { eclipse: 8, prestige: 4 };

function doGet(request) {
  try {
    if (request && request.parameter && request.parameter.action !== "slots") {
      return jsonResponse({ ok: false, error: "UNKNOWN_ACTION" });
    }

    return jsonResponse({ ok: true, slots: getSlotSummary() });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function doPost(request) {
  let lock;
  let lockAcquired = false;

  try {
    const payload = JSON.parse(request.postData.contents);
    const packageKey = String(payload.package || "").toLowerCase();

    if (!SLOT_LIMITS[packageKey]) {
      return jsonResponse({ ok: false, error: "INVALID_PACKAGE" });
    }

    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    lockAcquired = true;

    const sheet = getReservationsSheet();
    const taken = countReservations(sheet, packageKey);
    const left = SLOT_LIMITS[packageKey] - taken;

    if (left <= 0) {
      return jsonResponse({ ok: false, error: "SOLD_OUT" });
    }

    sheet.appendRow([
      new Date(),
      packageKey,
      payload.amount,
      payload.fullName,
      payload.messenger,
      payload.contactNumber,
      "Reserved",
    ]);

    return jsonResponse({ ok: true, left: left - 1 });
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

function getSlotSummary() {
  const sheet = getReservationsSheet();

  return Object.keys(SLOT_LIMITS).reduce(function (summary, packageKey) {
    const taken = countReservations(sheet, packageKey);
    summary[packageKey] = {
      total: SLOT_LIMITS[packageKey],
      taken: taken,
      left: Math.max(0, SLOT_LIMITS[packageKey] - taken),
    };
    return summary;
  }, {});
}

function countReservations(sheet, packageKey) {
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return 0;
  }

  return sheet
    .getRange(2, 2, lastRow - 1, 1)
    .getValues()
    .filter(function (row) {
      return String(row[0]).toLowerCase() === packageKey;
    }).length;
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
