DEPLOYING THE PUBLIC SITE TO VERCEL (from GitHub)
==================================================

WHAT WORKS ON VERCEL:
  - The PUBLIC WEBSITE (all .html pages). Deploys free and easily.

WHAT CANNOT RUN ON VERCEL:
  - The ADMIN PANEL. It needs a live backend + database (Vercel
    serverless storage cannot persist data, login, or uploads).
  - Keep using the ADMIN locally for now (see below).

-----------------------------------------------
STEP 1 - Put the project on GitHub
-----------------------------------------------
Open Command Prompt in the project folder and run:

  git init
  git add -A
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
  git push -u origin main

(The .gitignore automatically excludes node_modules, the database,
uploads, and server/.env - so no secrets are uploaded.)

-----------------------------------------------
STEP 2 - Connect to Vercel
-----------------------------------------------
1. Go to vercel.com and sign in (with GitHub).
2. Click "New Project" -> Import your GitHub repo.
3. Vercel auto-detects it as a static site (vercel.json included).
4. Click "Deploy". Done.

Your public site is now live at a URL like:
  https://your-project.vercel.app

-----------------------------------------------
THE ADMIN PANEL (localhost)
-----------------------------------------------
Admin must run on a real server. On your computer:

  1. Double-click  Start-Admin.cmd
  2. Keep its black window OPEN.
  3. Browser opens http://localhost:3000/admin
  4. Login:  admin@satv.dz   /   bv0vQwe8dh14nf&
  5. Change the password after first login.

-----------------------------------------------
IF YOU WANT THE ADMIN ONLINE TOO
-----------------------------------------------
Upload the SAME repo to Railway or Render (railway.app / render.com),
start command: node src/server.js, working dir: server.
Then admin is at https://yourapp.up.railway.app/admin.