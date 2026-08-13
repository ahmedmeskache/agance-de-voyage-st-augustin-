SAINT AUGUSTIN - ADMIN PANEL
=============================================

HOW TO OPEN THE ADMIN PANEL (EASY WAY - NO TECHNICAL SKILLS):

  1. On Windows, double-click the file:

        Start-Admin.cmd        (English)
        Demarrer-Admin.cmd     (Francais)

  2. A black window (command prompt) opens and the server starts.
     Keep it OPEN - do not close it.

  3. Your browser opens automatically at:
        http://localhost:3000/admin

     (If the page is blank, wait 2 seconds and type that address.)

  4. Log in with:
        Email:     admin@satv.dz
        Password:  bv0vQwe8dh14nf&

  IMPORTANT: change the password after first login:
     sidebar -> 🔑 Changer le mot de passe

=============================================

IF THE AUTOMATIC LAUNCH DOESN'T WORK, MANUAL WAY:

  1. Open the 'server' folder.
  2. In the address bar of the file window, type 'cmd' and press Enter
     (a black terminal opens directly in that folder).
  3. Type and press Enter:
        npm install
     then:
        npm start
  4. Open http://localhost:3000/admin in your browser.

=============================================
NOTES
- The main site is at http://localhost:3000
- Data (SQLite) is stored in server\src\data\satv.db.
- This is a LOCAL panel: data stays on the computer where it runs.