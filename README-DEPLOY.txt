DEPLOYING SITE + ADMIN TO RAILWAY (from GitHub)
================================================

This project now runs the FULL stack on Railway (public site + backend
+ admin panel). It is deployed from the GitHub repo
  https://github.com/ahmedmeskache/agance-de-voyage-st-augustin-

-----------------------------------------------
WHY IT FAILED BEFORE (npm: not found, exit 127)
-----------------------------------------------
Railway uses Nixpacks, which only enables Node/npm when it finds a
package.json at the PROJECT ROOT. The backend lived in server/ with no
root package.json, so npm was never installed.
FIXED BY: adding root package.json + railway.json (see those files).
DO NOT DELETE THEM.

-----------------------------------------------
HOW RAILWAY RUNS IT
-----------------------------------------------
- Build  : npm install --prefix server   (installs backend deps)
- Start  : npm --prefix server start     (runs node server/src/server.js)
- Port   : reads process.env.PORT (Railway sets it automatically)
- Config : railway.json

-----------------------------------------------
DEPLOYMENT CHECKLIST (do once, then every push auto-deploys)
-----------------------------------------------
1. Set these Variables in the Railway service (Variables tab):
     JWT_SECRET       -> a long random string (mandatory)
     ADMIN_EMAIL      -> admin@satv.dz
     ADMIN_PASSWORD   -> your strong login password
     ADMIN_NAME       -> Administrateur
2. Your live URLs:
     Site   : https://your-app.up.railway.app
     Admin  : https://your-app.up.railway.app/admin
3. Find the real URL in Railway: Deployments tab / Settings > Networking.

-----------------------------------------------
IMPORTANT: YOUR REAL DOMAIN (for Google search)
-----------------------------------------------
Before going live publicly, replace the placeholder domain
  https://votre-domaine.up.railway.app
with your REAL URL in these two files:
  - sitemap.xml
  - robots.txt
Then submit sitemap.xml to Google Search Console.

-----------------------------------------------
GETTING ON GOOGLE SEARCH (SEO)
-----------------------------------------------
1. Deploy must succeed (check Deployments tab).
2. Go to https://search.google.com/search-console and add your domain.
3. Verify it (HTML meta tag method - paste a line into index.html).
4. Submit your sitemap:  https://your-app.up.railway.app/sitemap.xml
5. Wait days-to-weeks for Google to index (Search Console "Request Indexing").

-----------------------------------------------
KNOWN LIMIT (IMPORTANT BEFORE SELLING)
-----------------------------------------------
SQLite stores data in a local file. On Railway the file resets whenever
the app restarts (esp. free tier), so offers/reservations you add in the
admin can disappear. For a reliable production launch, the backend must
use a persistent database (e.g. Railway-managed Postgres). This code is
currently SQLite-only.

-----------------------------------------------
ADMIN LOGIN (local and after deploy)
-----------------------------------------------
Login: admin@satv.dz / your ADMIN_PASSWORD
(If ADMIN_PASSWORD not set, default is admin123456 - CHANGE IT.)
