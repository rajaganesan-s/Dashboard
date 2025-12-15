# How to Connect this Dashboard to OneDrive

To connect this dashboard effectively to your OneDrive, we will use the **Microsoft Graph API**. This allows the dashboard to "talk" to your Excel file directly over the internet without downloading it.

## Step 1: Prepare your Excel File on OneDrive
1. Upload your Excel file to OneDrive.
2. Open it in Excel Online.
3. **CRITICAL STEP**: Select your data (headers and rows) -> Go to `Insert` -> `Table`.
   - Check "My table has headers".
   - Name the table `TasksTable` (click inside the table -> Table Design tab -> Table Name).
   - *The API can ONLY read/write to official Excel Tables, not just random cells.*

## Step 2: Get a Client ID (One-time setup)
Microsoft requires you to register this "app" to allow it to access your files.
1. Go to the [Azure Portal - App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. Click **New Registration**.
3. **Name**: `MyDashboard` (or anything you like).
4. **Supported Account Types**: Select **"Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"**.
   - *This ensures it works with both personal Outlook/Hotmail and Business OneDrive.*
5. **Redirect URI**:
   - Select `Single-page application (SPA)` from the dropdown.
   - URL: `http://localhost:8000/excelDashboard.html`
   - *Note: For security, Microsoft often blocks `file://`. We will run a simple local server to make this work.*
6. Click **Register**.

## Step 3: Configure Permissions
1. Once registered, copy the **Application (client) ID**. You will need this later.
2. In the left sidebar, click **API Permissions**.
3. It should already have `User.Read`.
4. Click **Add a permission** -> **Microsoft Graph** -> **Delegated permissions**.
5. Search for and check: `Files.ReadWrite`.
6. Click **Add permissions**.

## Step 4: Run the Dashboard
Since Microsoft requires a callback URL (redirect URI), we need to run this on `localhost` instead of just double-clicking the file.

1. Open your terminal (PowerShell/Command Prompt).
2. Navigate to the folder:
   ```powershell
   cd "c:\Users\info\OneDrive\Desktop\Dashboard\ExcelInteraction"
   ```
3. Run a simple local server:
   ```powershell
   npx -y http-server -p 8000
   ```
   *(Or if you have Python: `python -m http.server 8000`)*

4. Open your browser to: `http://localhost:8000/excelDashboard.html`
5. Enter your **Client ID** (from Step 3) into the dashboard login screen.
6. Sign in and select your file!
