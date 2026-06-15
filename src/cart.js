import { API_BASE } from './config.js';

// Met à jour le badge affiché sur l'icône panier du header (nombre total d'articles)
export async function mettreAJourBadgePanier() {
    const badge = document.getElementById('badgePanier');
    if (!badge) return;

    try {
        const items = await listerPanier();
        const total = items.reduce((somme, item) => somme + (item.quantite || 0), 0);

        if (total > 0) {
            badge.textContent = total > 99 ? '99+' : total;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    } catch (err) {
        console.error('Impossible de mettre à jour le badge du panier :', err);
    }
}

// Ajoute un produit au panier (ou augmente la quantité si même produit/taille/couleur déjà présent)
// options : { taille, couleur, quantite }
export async function ajouterAuPanier(produitId, options = {}) {
    const { taille = null, couleur = null, quantite: qte = 1 } = options;

    const res = await fetch(`${API_BASE}/panier?produitId=${produitId}`);
    const existants = await res.json();

    // On cherche une ligne avec exactement la même taille et la même couleur
    const item = existants.find(e => (e.taille ?? null) === taille && (e.couleur ?? null) === couleur);

    if (item) {
        await fetch(`${API_BASE}/panier/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantite: item.quantite + qte })
        });
    } else {
        await fetch(`${API_BASE}/panier`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produitId, quantite: qte, taille, couleur })
        });
    }

    await mettreAJourBadgePanier();
}

// Modifie la quantité d'une ligne du panier. Supprime la ligne si la quantité tombe à 0.
export async function modifierQuantitePanier(itemId, quantite) {
    if (quantite < 1) {
        await retirerDuPanier(itemId);
        return;
    }
    await fetch(`${API_BASE}/panier/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantite })
    });
    await mettreAJourBadgePanier();
}

// Retourne la liste des entrées favoris (chaque entrée a un id + produitId)
export async function listerFavoris() {
    const res = await fetch(`${API_BASE}/favoris`);
    return res.json();
}

// Ajoute ou retire un produit des favoris. Retourne true si désormais favori, false sinon.
export async function basculerFavori(produitId) {
    const res = await fetch(`${API_BASE}/favoris?produitId=${produitId}`);
    const existants = await res.json();

    if (existants.length > 0) {
        await fetch(`${API_BASE}/favoris/${existants[0].id}`, { method: 'DELETE' });
        return false;
    } else {
        await fetch(`${API_BASE}/favoris`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produitId })
        });
        return true;
    }
}

// Retire un élément du panier (par id de l'entrée panier, pas du produit)
export async function retirerDuPanier(itemId) {
    await fetch(`${API_BASE}/panier/${itemId}`, { method: 'DELETE' });
    await mettreAJourBadgePanier();
}

// Retire un élément des favoris (par id de l'entrée favoris, pas du produit)
export async function retirerDesFavoris(itemId) {
    await fetch(`${API_BASE}/favoris/${itemId}`, { method: 'DELETE' });
}

export async function listerPanier() {
    const res = await fetch(`${API_BASE}/panier`);
    return res.json();
}

// Vide entièrement le panier (utilisé après validation de la commande)
export async function viderPanier() {
    const items = await listerPanier();
    await Promise.all(
        items.map(item => fetch(`${API_BASE}/panier/${item.id}`, { method: 'DELETE' }))
    );
    await mettreAJourBadgePanier();
}

// Crée une commande (utilisé lors du passage à la caisse)
// articles : détail des lignes commandées (produit, quantité, prix, taille, couleur)
export async function validerCommande({ montant, articles = [], adresse = '', paiement = '' }) {
    const commande = {
        date: new Date().toISOString().slice(0, 10),
        montant: Math.round(montant * 100) / 100,
        articles,
        adresse,
        paiement
    };

    const res = await fetch(`${API_BASE}/commandes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commande)
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la création de la commande');
    }

    return res.json();
}