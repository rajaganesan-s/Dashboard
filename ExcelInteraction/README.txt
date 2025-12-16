================================================================================
EXCEL PROJECT DASHBOARD - USER GUIDE & SETUP
================================================================================

This dashboard allows you to visualize and manage tasks from Excel files. 
It supports two modes:
1. Local File Mode (Open files directly from your computer)
2. OneDrive Cloud Mode (Sync changes directly to your OneDrive)

--------------------------------------------------------------------------------
1. LOCAL FILE MODE (No Setup Required)
--------------------------------------------------------------------------------
- Simply open 'excelDashboard.html' in your web browser.
- Click "Local File" tab.
- Drag and drop your .xlsx file or click to select/browse.
- You can Edit, Add, and Delete tasks.
- Click "Save & Download" to get the updated file back.

--------------------------------------------------------------------------------
2. ONEDRIVE CLOUD MODE (Setup Required)
--------------------------------------------------------------------------------
To edit files directly on OneDrive without downloading/uploading, you need to 
connect the dashboard to your Microsoft Account using Azure.

*** PREREQUISITES ***
- A Microsoft Account (Personal or Business).
- The dashboard MUST be accessed via a Web Server (http://localhost...), 
  NOT directly as a file (file://...).
  
  Since you are using XAMPP, access the dashboard at:
  http://localhost/Google%20Sheet%20and%20Excel%20Dashboard/ExcelInteraction/excelDashboard.html

*** AZURE SETUP STEPS (One-Time Setup) ***

1. Go to the Azure Portal: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
   (Sign in with your Microsoft account if needed).

2. Click "+ New registration".

3. Fill in the form:
   - Name: "Excel Dashboard" (or any name you like).
   - Supported account types: Select "Accounts in any organizational directory and personal Microsoft accounts".
     (This ensures it works with both Personal Outlook/Hotmail and Business accounts).
   - Redirect URI (Platform): 
     - Select "Single-page application (SPA)".
     - Enter the URL where you host the dashboard. 
       Based on your folder, it is likely:
       http://localhost/Google%20Sheet%20and%20Excel%20Dashboard/ExcelInteraction/excelDashboard.html
       
       *IMPORTANT*: This URL must match EXACTLY what you see in your browser address bar.

4. Click "Register".

5. On the Overview page, look for "Application (client) ID".
   - Copy this Copy this alphanumeric ID (e.g., a1b2c3d4-...).

*** CONNECTING THE DASHBOARD ***

1. Open the dashboard in your browser (via http://localhost...).
2. Switch to the "OneDrive Cloud" tab.
3. Paste the Client ID you copied into the "Client ID" box.
4. Click "Sign In with Microsoft".
5. Accept the permissions popup.
6. Browse and select your Excel file from your OneDrive.

--------------------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------------------
- "Redirect URI Mismatch Error":
  This means the URL in valid Browser Address bar does not match the URI you 
  entered in Azure. Go to Azure Portal > Authentication and ensure they match exactly.

- "Cross-Origin / Network Error":
  Ensure you are running the dashboard via a server (http://) and not as a 
  local file (file://).

================================================================================
