// ==========================================
// CONFIGURATION
// ==========================================
const SHEET_ID = "1qrXaaqEvCnSiYmu6wsAWCqLCF3qyPzj5AIpuoHmPKGw"; 
const SHEET_NAME = "Project Details"; 
// ==========================================
// MAIN CODE
// ==========================================
function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); 

  try {
    // ----------------------------------------------------
    // 1. SMART ACTION DETECTION (The Fix)
    // ----------------------------------------------------
    let action = e.parameter.action; // Check URL first (?action=read)
    let payload = {};

    // If not in URL, check the Body (JSON)
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
        if (!action) action = payload.action; 
      } catch (err) {}
    }

    // IF STILL UNKNOWN, DEFAULT TO "READ" (Prevents the error)
    if (!action) {
      // If we have no action but we have a sheet, let's just return data to be helpful
      action = "read";
    }
    // ----------------------------------------------------

    const doc = SpreadsheetApp.openById(SHEET_ID);
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(["APP", "PROJECT", "DELIVERABLES", "OWNER", "TARGET DATE", "STATUS", "REMARKS"]);
    }

    // --- READ ---
    if (action == "read") {
      const data = sheet.getDataRange().getValues();
      // If empty or just header
      if (data.length <= 1) return response([]); 

      const headers = data[0];
      const rows = data.slice(1);
      
      const json = rows.map((row, index) => {
        let obj = { _rowIndex: index }; 
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });
      return response(json);
    }

    // --- ADD ---
    if (action == "add") {
      const headers = sheet.getDataRange().getValues()[0];
      const newRow = headers.map(h => payload[h] || "");
      sheet.appendRow(newRow);
      return response({status: "success", message: "Row added"});
    }

    // --- UPDATE ---
    if (action == "update") {
      const rowIndex = parseInt(payload._rowIndex);
      const sheetRow = rowIndex + 2; 
      const headers = sheet.getDataRange().getValues()[0];
      
      headers.forEach((h, colIndex) => {
        if (payload[h] !== undefined && h !== "_rowIndex" && h !== "action") {
          sheet.getRange(sheetRow, colIndex + 1).setValue(payload[h]);
        }
      });
      return response({status: "success", message: "Row updated"});
    }

    // --- DELETE ---
    if (action == "delete") {
      const rowIndex = parseInt(payload._rowIndex);
      const sheetRow = rowIndex + 2;
      sheet.deleteRow(sheetRow);
      return response({status: "success", message: "Row deleted"});
    }

    return response({status: "error", message: "Action not recognized: " + action});

  } catch (err) {
    return response({status: "error", message: err.toString()});
  } finally {
    lock.releaseLock();
  }
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}