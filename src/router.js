// Définition des routes : chemin -> nom de la page
// ':param' indique un segment dynamique (ex: /Produit/:id) récupéré dans params
const routes = [
    { pattern: '/', page: 'Intro' },
    { pattern: '/Intro', page: 'Intro' },
    { pattern: '/Connexion', page: 'Connexion' },
    { pattern: '/Inscription', page: 'Inscription' },
    { pattern: '/UserDashboard', page: 'UserDashboard' },
    { pattern: '/Admin', page: 'Admin' },
    { pattern: '/Favoris', page: 'Favoris' },
    { pattern: '/Panier', page: 'Panier' },
    { pattern: '/Catalogue/:categorie', page: 'Catalogue' },
    { pattern: '/Produit/:id', page: 'Produit' }
];

// Trouve la route correspondant au chemin demandé et extrait les paramètres
const matchRoute = (path) => {
    const pathSegments = path.split('/').filter(Boolean);

    for (const route of routes) {
        const patternSegments = route.pattern.split('/').filter(Boolean);
        if (patternSegments.length !== pathSegments.length) continue;

        const params = {};
        let matched = true;

        for (let i = 0; i < patternSegments.length; i++) {
            const segment = patternSegments[i];
            if (segment.startsWith(':')) {
                params[segment.slice(1)] = pathSegments[i];
            } else if (segment !== pathSegments[i]) {
                matched = false;
                break;
            }
        }

        if (matched) return { page: route.page, params };
    }

    return null;
};

const render = async (path) => {
    const app = document.getElementById('app');
    if (!app) return;

    const match = matchRoute(path);
    console.log(match ? match.page : 'NotFound');
    let pageModule;

    try {
        if (!match) {
            pageModule = await import('./pages/Notfound/Notfound.js');
        } else {
            pageModule = await import(`./pages/${match.page}/${match.page}.js`);
        }

        const pageComponent = pageModule.default;
        const params = match ? match.params : {};
        app.innerHTML = pageComponent(params);

        if (pageComponent.afterRender) {
            await pageComponent.afterRender(params);
        }
    } catch (error) {
        console.error(`Erreur de chargement : ${error}`);
        app.innerHTML = '<h1>Erreur technique</h1>';
    }
};

const navigate = (path) => {
    window.location.hash = path;
};

// const handleHashChange = async () => {
//     const path = window.location.hash.replace('#', '') || '/';
//     await render(path);
// };
const handleHashChange = async () => {
    const path = window.location.hash.replace('#', '') || '/';

    console.log("HASH PATH:", path);

    await render(path);
};

const initRouter = () => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
};

export { initRouter, navigate };