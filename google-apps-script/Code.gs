const SHEET_NAME = "Reservations";
const DRIVE_FOLDER_ID = "REPLACE_WITH_GOOGLE_DRIVE_FOLDER_ID";

function doPost(request) {
  try {
    const payload = JSON.parse(request.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`Missing sheet: ${SHEET_NAME}`);
    }

    const screenshot = payload.screenshot;
    const blob = Utilities.newBlob(
      Utilities.base64Decode(screenshot.data),
      screenshot.type,
      screenshot.name
    );
    const file = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);

    sheet.appendRow([
      new Date(),
      payload.package,
      payload.amount,
      payload.fullName,
      payload.messenger,
      payload.contactNumber,
      file.getUrl(),
      "Pending verification",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
