// server.js
//
// Remplace json-server : sert les fichiers du SPA (index.html, /public, /src)
// et expose une API REST (GET/POST/PATCH/DELETE) qui lit et écrit directement
// dans db.json, avec les mêmes routes que celles déjà utilisées par le front
// (/produits, /utilisateurs, /panier, /favoris, /commandes).
//
// Lancement : node server.js   (ou : npm start)
// Le site est ensuite accessible sur http://localhost:10000

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const DB_PATH = path.join(__dirname, 'db.json');

// Augmente la limite par défaut car les photos produits sont envoyées
// encodées en base64 dans le corps des requêtes JSON.
app.use(express.json({ limit: '20mb' }));

// Autorise les requêtes venant d'une autre origine (utile si le front est
// servi par un outil différent, ex: Live Server sur un autre port).
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// ---------------------------------------------------------------------
// Lecture / écriture de db.json
// ---------------------------------------------------------------------

function lireDB() {
    const contenu = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(contenu);
}

function ecrireDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Génère un identifiant aléatoire (façon json-server) et vérifie qu'il
// n'existe pas déjà dans la collection avant de le renvoyer.
function genererId(liste) {
    let id;
    do {
        id = Math.random().toString(36).slice(2, 11);
    } while (liste.some((item) => String(item.id) === id));
    return id;
}

// ---------------------------------------------------------------------
// API REST générique pour chaque collection de db.json
// ---------------------------------------------------------------------

const COLLECTIONS = ['utilisateurs', 'produits', 'panier', 'favoris', 'commandes'];

COLLECTIONS.forEach((nom) => {
    const route = `/${nom}`;

    // GET /xxx -> liste complète, filtrable avec ?champ=valeur
    // (plusieurs filtres possibles, combinés en ET, ex: ?email=...&motDePasse=...)
    app.get(route, (req, res) => {
        const db = lireDB();
        let items = db[nom] || [];

        Object.entries(req.query).forEach(([champ, valeur]) => {
            items = items.filter((item) => String(item[champ]) === String(valeur));
        });

        res.json(items);
    });

    // GET /xxx/:id -> un seul élément
    app.get(`${route}/:id`, (req, res) => {
        const db = lireDB();
        const item = (db[nom] || []).find((it) => String(it.id) === String(req.params.id));

        if (!item) {
            return res.status(404).json({ error: `${nom} introuvable` });
        }

        res.json(item);
    });

    // POST /xxx -> création d'un nouvel élément (id généré automatiquement)
    app.post(route, (req, res) => {
        const db = lireDB();
        if (!db[nom]) db[nom] = [];

        const nouvelItem = { id: genererId(db[nom]), ...req.body };
        db[nom].push(nouvelItem);
        ecrireDB(db);

        res.status(201).json(nouvelItem);
    });

    // PATCH /xxx/:id -> mise à jour partielle (l'id ne peut pas être modifié)
    app.patch(`${route}/:id`, (req, res) => {
        const db = lireDB();
        const liste = db[nom] || [];
        const index = liste.findIndex((it) => String(it.id) === String(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: `${nom} introuvable` });
        }

        liste[index] = { ...liste[index], ...req.body, id: liste[index].id };
        ecrireDB(db);

        res.json(liste[index]);
    });

    // DELETE /xxx/:id -> suppression
    app.delete(`${route}/:id`, (req, res) => {
        const db = lireDB();
        const liste = db[nom] || [];
        const index = liste.findIndex((it) => String(it.id) === String(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: `${nom} introuvable` });
        }

        const [supprime] = liste.splice(index, 1);
        ecrireDB(db);

        res.json(supprime);
    });
});

// ---------------------------------------------------------------------
// Fichiers statiques du SPA (index.html, /public, /src)
// ---------------------------------------------------------------------

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------------------------------------------------------------------
// Démarrage
// ---------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Serveur TrendyWear démarré : http://localhost:${PORT}`);
});
