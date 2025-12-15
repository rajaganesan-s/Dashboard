Appscript project URL : https://script.google.com/macros/s/AKfycbwdrRgbF79CUKS4oSmuiLrC4sfAMn2HhW30kzZowqFeIUywscafrYTFWm3MJKA-7HOv7g/exec

Steps to run this project:
1. Create google sheet with sheet name "Project Data".
2. Add data in sheet with following columns:
    APP, PROJECT, OWNER, DEV TEST CONDUCTED ON, QA TEST CONDUCTED ON, ALPHA TEST CONDUCTED ON, TARGET DATE, STATUS, REMARKS
3. Create Appscript project and add the appscript code in it then update the google sheet id in code.gs .
4. Deploy the appscript file with everyone permission.
    Click Deploy > New deployment.
    Click the "Select type" (gear icon) next to "Select type" and choose Web app.
    Description: (Optional, e.g., "Version 2").
    Execute as: Me (your email).
    Who has access: Anyone <--- CRITICAL!
    Do NOT select "Anyone with Google Account".
    Do NOT select "Only myself".
    It MUST be Anyone.
    Click Deploy.
    Copy the Web App URL (it ends in /exec).
5. Copy the deployed appscript URL.
6. Run the GoogleSheetDashboard.html file in browser.
7. Paste the deployed appscript URL in the GoogleSheetDashboard.html file.
8. Now you can use the dashboard.