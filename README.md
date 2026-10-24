# GaragePro — Gestion d’un garage automobile

Application web CRUD pour gérer les clients, véhicules, marques, modèles, employés, postes, rendez-vous, interventions, pièces, mouvements de stock, factures, lignes de facture et paiements.

**Technologies :** ReactJS + Vite, Django REST Framework, MySQL, `uvicorn` (serveur ASGI) et `mysql-connector-python` (connecteur MySQL pour Django).

L’interface reprend l’esprit du projet ExoTour fourni : navigation latérale bleu marine, accent orange, tableaux de données, formulaires modaux, recherche, confirmation de suppression et responsive.

## 1. Structure du projet

```text
GaragePro/
├── backend/
│   ├── config/                 # Paramètres Django, URLs, ASGI/WSGI
│   ├── garage/                 # Modèles, serializers, ViewSets, routes REST
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/App.jsx             # Interface et CRUD réutilisable pour les 15 ressources
│   ├── src/style.css           # Design responsive inspiré d’ExoTour
│   ├── package.json
│   └── .env.example
├── database/garage_schema.sql
└── render.yaml
```

## 2. Prérequis

- Python 3.10 ou supérieur
- Node.js 20 ou supérieur et npm
- MySQL 8.x
- Git (pour le déploiement)

## 3. Préparer MySQL en local

Dans MySQL, crée une base et un utilisateur. Exemple à adapter à ton environnement :

```sql
CREATE DATABASE garage_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'garage_user'@'localhost' IDENTIFIED BY 'MotDePasseSolide';
GRANT ALL PRIVILEGES ON garage_db.* TO 'garage_user'@'localhost';
FLUSH PRIVILEGES;
```

## 4. Démarrer le backend Django

Dans un terminal :

```bash
cd GaragePro/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Puis édite `backend/.env` et adapte `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST` et `MYSQL_PORT`. Les variables du fichier `.env` sont chargées automatiquement par `python-dotenv`. Exemple rapide pour le développement :

```bash
export DEBUG=True
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
export MYSQL_DATABASE=garage_db
export MYSQL_USER=garage_user
export MYSQL_PASSWORD='MotDePasseSolide'
python manage.py makemigrations garage
python manage.py migrate
python manage.py createsuperuser
uvicorn config.asgi:application --reload --host 0.0.0.0 --port 8000
```

API : `http://127.0.0.1:8000/api/`  
Test santé : `http://127.0.0.1:8000/api/health/`  
Admin Django : `http://127.0.0.1:8000/admin/`

> Remarque : `mysql-connector-python` fournit le backend Django `mysql.connector.django`. Si ta version du connecteur signale une incompatibilité avec ta version Django, utilise une combinaison de versions officiellement compatible avant de migrer la base.

## 5. Démarrer ReactJS

Dans un deuxième terminal :

```bash
cd GaragePro/frontend
npm install
cp .env.example .env
npm run dev
```

Ouvre l’adresse Vite indiquée dans le terminal, normalement `http://localhost:5173`.

## 6. Fonctionnalités CRUD

Pour les 15 ressources :

- **Create** : formulaire modal et envoi `POST` à l’API.
- **Read** : tableau avec recherche instantanée et compteurs dans la navigation.
- **Update** : formulaire prérempli et envoi `PATCH`.
- **Delete** : confirmation, puis envoi `DELETE`.
- Les listes de relations (client, véhicule, modèle, employé, facture, etc.) sont alimentées depuis l’API.
- Les erreurs de validation renvoyées par Django REST Framework sont affichées dans le formulaire.

Les routes API sont `/api/clients/`, `/api/vehicules/`, `/api/rendez-vous/`, `/api/interventions/`, `/api/pieces/`, `/api/factures/`, `/api/paiements/` et les autres routes déclarées dans `backend/garage/urls.py`.

## 7. Déployer sur Render

Render héberge le backend Django et le frontend React comme deux services distincts. La base MySQL doit être hébergée chez un fournisseur MySQL externe qui autorise les connexions depuis Render.

1. Crée un dépôt Git et pousse le dossier `GaragePro` complet.
2. Dans Render, crée un **Blueprint** depuis ce dépôt et sélectionne `render.yaml`, ou crée les services manuellement.
3. Configure le service `garagepro-api` avec les variables MySQL fournies par ton hébergeur de base de données : `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
4. Après création du service frontend, récupère son URL HTTPS et définis `CORS_ALLOWED_ORIGINS` sur le backend avec cette URL exacte, par exemple `https://garagepro-frontend.onrender.com`.
5. Dans les variables du frontend, définis `VITE_API_URL` avec l’URL HTTPS du backend suivie de `/api`, par exemple `https://garagepro-api.onrender.com/api`.
6. Redéploie les deux services. Vérifie `https://garagepro-api.onrender.com/api/health/`, puis ouvre l’URL frontend.

Le fichier `render.yaml` génère les migrations de l’application au démarrage pour faciliter le premier déploiement. Pour un projet maintenu en équipe, génère les migrations localement avec `python manage.py makemigrations garage`, vérifie-les puis ajoute-les au dépôt Git.

Les noms d’URL ci-dessus sont des exemples : utilise les URL réellement attribuées par Render. Ne publie jamais le mot de passe MySQL ni la `SECRET_KEY` dans le dépôt Git.

## 8. Important avant une mise en production publique

Ce projet est un point de départ pédagogique : les routes CRUD sont ouvertes (`AllowAny`) pour simplifier les tests. Avant d’y stocker des données réelles, ajoute une authentification, des permissions par rôle, une validation métier renforcée et une stratégie de sauvegarde MySQL. Les données financières doivent aussi être recalculées et validées côté serveur.
