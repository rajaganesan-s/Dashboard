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
  // Wait for up to 10 seconds for other processes to finish.
  lock.tryLock(10000);

  try {
    // ----------------------------------------------------
    // 1. SMART ACTION DETECTION
    // ----------------------------------------------------
    // Context: When using "Content-Type: text/plain" to bypass CORS, 
    // the data is in e.postData.contents. Param parsing might differ.
    
    let action = e.parameter ? e.parameter.action : null; 
    let payload = {};

    // Attempt to parse existing body
    if (e.postData && e.postData.contents) {
      try {
        const rawContent = e.postData.contents;
        payload = JSON.parse(rawContent);
        // If action wasn't in URL, check body
        if (!action && payload.action) {
          action = payload.action;
        }
      } catch (err) {
        // Body was not JSON (maybe just empty or standard form data), ignore.
      }
    }

    // Default to "read" if no action specified
    if (!action) {
      action = "read";
    }
    
    // Normalize action
    action = action.toLowerCase();
    // ----------------------------------------------------

    const doc = SpreadsheetApp.openById(SHEET_ID);
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Initialize headers if new sheet
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
      // Expecting _rowIndex in payload
      if (payload._rowIndex === undefined) {
         return response({status: "error", message: "Missing _rowIndex for update"});
      }
      
      const rowIndex = parseInt(payload._rowIndex);
      const sheetRow = rowIndex + 2; // +1 for header, +1 for 0-index
      const headers = sheet.getDataRange().getValues()[0];
      
      headers.forEach((h, colIndex) => {
        // Update only fields present in payload, exclude internal keys
        if (payload[h] !== undefined && h !== "_rowIndex" && h !== "action") {
          sheet.getRange(sheetRow, colIndex + 1).setValue(payload[h]);
        }
      });
      return response({status: "success", message: "Row updated"});
    }

    // --- DELETE ---
    if (action == "delete") {
      if (payload._rowIndex === undefined) {
         return response({status: "error", message: "Missing _rowIndex for delete"});
      }
      const rowIndex = parseInt(payload._rowIndex);
      const sheetRow = rowIndex + 2;
      sheet.deleteRow(sheetRow);
      return response({status: "success", message: "Row deleted"});
    }

    return response({status: "error", message: "Action not recognized: " + action});

  } catch (err) {
    return response({status: "error", message: "Script Error: " + err.toString()});
  } finally {
    lock.releaseLock();
  }
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}