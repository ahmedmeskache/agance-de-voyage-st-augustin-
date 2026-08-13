# Saint Augustin Toolisme & Voyages — Site + Backend + Admin

Site vitrine (HTML) + **backend Node.js/Express/SQLite** + **panneau d'administration** + **espace client** (comptes, réservations).

## Ce qui est inclus

- **Site vitrine** : les pages HTML existantes (accueil, circuits, excursions, blog…).
- **Espace client** (`/login.html`) : création de compte / connexion par **email**, **Google** ou **Facebook** (style « type Insta »).
- **Réservations** : un bouton « Réserver » sur les pages circuits/excursions ; la demande s'affiche dans l'admin.
- **Admin** (`/admin`) :
  - 📊 **Tableau de bord** (stats + dernières réservations / inscrits)
  - 🧭 **Circuits & Excursions** : ajouter / modifier / publier / masquer / supprimer, avec **nom, type, catégorie, détails, programme, tarif, durée et photo**
  - 📋 **Réservations** : voir les demandes, confirmer / annuler, supprimer
  - 📝 **Blog** : créer / modifier des articles (avec photo)
  - ✨ **Extra** : blocs de contenu libres (citations, contacts, réseaux…)

## Démarrer en local

Prérequis : **Node.js 18+** installé.

```bash
cd server
npm install
cp .env.example .env    # (Windows) : Copy-Item .env.example .env
npm run dev             # ou : npm start
```

Ensuite ouvrez dans le navigateur :

| Quoi | Adresse |
|---|---|
| Le site | http://localhost:3000 |
| Espace client (connexion) | http://localhost:3000/login.html |
| Panneau admin | http://localhost:3000/admin |

### Identifiants admin par défaut

Renseignez-les dans `server/.env` **avant** le premier lancement (compte admin créé au démarrage) :

```
ADMIN_EMAIL=admin@satv.dz
ADMIN_PASSWORD=admin123456
```

> Changez impérativement le mot de passe et `JWT_SECRET` avant la mise en ligne.

## Activer Google / Facebook

La connexion sociale nécessite de créer des apps (les clés restent côté serveur dans `.env`).

1. **Google** → https://console.cloud.google.com (OAuth). Autorisez l'URL :
   `https://VOTRE-DOMAINE/api/auth/google/callback`
2. **Facebook** → https://developers.facebook.com. Autorisez :
   `https://VOTRE-DOMAINE/api/auth/facebook/callback`

Puis renseignez dans `server/.env` :
```
PUBLIC_URL=https://VOTRE-DOMAINE
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

> Sans ces clés, les boutons Google/Facebook affichent un message « non configuré ». Le compte **email** fonctionne toujours hors ligne.

## Architecture rapide

```
server/
  src/
    server.js             # point d'entrée (API + site statique + admin + uploads)
    db.js                 # schéma SQLite
    seed.js               # (CLI) crée l'admin  —  npm run seed
    middleware/auth.js    # JWT (authRequired / adminRequired)
    routes/auth.js        # register / login / me / google / facebook / admin/login
    routes/offers.js      # circuits & excursions (CRUD + upload photo)
    routes/reservations.js# création (client) + gestion (admin)
    routes/blog.js        # articles (CRUD + upload photo)
    routes/admin.js       # stats du dashboard + paramètres "Extra"
  public/admin/           # panneau d'administration (SPA)
  .env.example
uploads/                  # photos téléversées (offres / articles)
assets/app.js             # script client (connexion + bouton Réserver)
login.html                # page de connexion / création de compte
```

## Mettre le site en ligne (déploiement)

Vous n'avez pas de serveur actuellement. Une fois la décision prise, le plus simple :

### Option A — VPS (DigitalOcean / Hetzner / OVH, ~5$/mois) [recommandé]
```bash
# sur le serveur (Ubuntu)
sudo apt update && sudo apt install -y nodejs npm git
git clone VOTRE-DEPOT site && cd site/server
npm install
cp .env.example .env && nano .env         # remplissez les vraies valeurs
sudo npm i -g pm2
pm2 start src/server.js --name satv
pm2 startup && pm2 save                   # redémarre au boot
# + ouvrez le port 3000 dans le firewall, et pointez votre domaine via Nginx en reverse-proxy
```

### Option B — PaaS (Render / Railway / Fly.io)
- Poussez le dossier complet sur **GitHub**.
- Créez un service **Web service** Node sur Render/Railway.
- Commande de démarrage : `cd server && npm install && npm start` (Render : le dossier racine est la racine du repo).
- Définissez les variables d'environnement (PORT, JWT_SECRET, ADMIN_*, PUBLIC_URL…).

### Après déploiement (obligatoire pour être « en ligne »)
1. Renseignez `PUBLIC_URL=https://votre-domaine` dans l'environnement.
2. Générez un vrai `JWT_SECRET`.
3. Changez le mot de passe admin.
4. (Optionnel) Activez Google/Facebook avec votre domaine.

## API (résumé)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /api/auth/register | public | Créer un compte |
| POST | /api/auth/login | public | Se connecter (email) |
| POST | /api/auth/admin/login | public | Connexion admin |
| GET | /api/auth/me | client | Profil courant |
| GET | /api/auth/google/login | public | Connexion Google |
| GET | /api/auth/facebook/login | public | Connexion Facebook |
| GET/POST | /api/offers | public | Liste / création (admin) |
| PUT/DELETE | /api/offers/:id | admin | Modifier / supprimer |
| POST | /api/reservations | client | Créer une réservation |
| GET | /api/reservations | admin | Toutes les réservations |
| PATCH/DELETE | /api/reservations/:id | admin | Statut / suppression |
| GET/POST | /api/blog | public/admin | Articles |
| GET | /api/admin/stats | admin | Stats du dashboard |
| GET/PUT | /api/admin/settings | admin | Contenu « Extra » |

## Sécurité à faire avant production

- `JWT_SECRET` fort + mot de passe admin fort.
- **HTTPS** (certificat via Nginx/Caddy ou géré par la plateforme PaaS).
- Les chemins serveur (`/server`, `/node_modules`, `.env`, BDD) sont déjà bloqués par le serveur.