import { navigate } from './router.js';
import { API_BASE } from './config.js';
import { mettreAJourBadgePanier } from './cart.js';

async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Email et mot de passe sont obligatoires");
        return;
    }

    try {
        const res = await fetch(
            `${API_BASE}/utilisateurs?email=${encodeURIComponent(email)}&motDePasse=${encodeURIComponent(password)}`
        );
        const utilisateurs = await res.json();

        if (!utilisateurs.length) {
            alert("Email ou mot de passe incorrect.");
            return;
        }

        const user = utilisateurs[0];

        if (user.role === "admin") {
            navigate('/Admin');
        } else {
            navigate('/UserDashboard');
        }

    } catch (err) {
        console.error(err);
        alert("Le serveur est indisponible");
    }
}



async function register() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("tous les champs sont obligatoires");
        return;
    }

    try {
        // Vérifier que l'email n'est pas déjà utilisé
        const checkRes = await fetch(`${API_BASE}/utilisateurs?email=${encodeURIComponent(email)}`);
        const existants = await checkRes.json();

        if (existants.length > 0) {
            alert("Cet email est déjà utilisé.");
            return;
        }

        const res = await fetch(`${API_BASE}/utilisateurs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom: name,
                address,
                email,
                motDePasse: password,
                role: "user"
            })
        });

        if (!res.ok) {
            alert("Erreur lors de l'inscription");
            return;
        }

        alert("Compte créé avec succès ! Veuillez vous connecter.");
        navigate('/Connexion');

    } catch (err) {
        console.error(err);
        alert("erreur register");
    }
}



function logout() {
    navigate('/Connexion');
}

// Expose ces fonctions globalement car elles sont appelées
// depuis les attributs onclick="..." et window.login() des pages
window.login = login;
window.register = register;
window.logout = logout;

// Icônes de la navbar de droite (header global, hors routeur)
document.getElementById('iconUser')?.addEventListener('click', () => {
    navigate('/Connexion');
});

document.getElementById('iconFavoris')?.addEventListener('click', () => {
    navigate('/Favoris');
});

document.getElementById('iconPanier')?.addEventListener('click', () => {
    navigate('/Panier');
});

// Recherche en direct : filtre les produits affichés sur la page courante
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', () => {
    const terme = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('#app .product').forEach(produit => {
        const titre = produit.querySelector('.product-title')?.textContent.toLowerCase() || '';
        produit.style.display = titre.includes(terme) ? '' : 'none';
    });
});

// Affiche le badge du panier dès le chargement de l'application
mettreAJourBadgePanier();