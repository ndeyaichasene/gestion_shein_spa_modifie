const NotFound = () => `
    <div>
        <h1>404 - Page introuvable</h1>
        <p>La route demandée n'existe pas.</p>
        <button id="homeLink">Retour à l'accueil</button>
    </div>
`;

NotFound.afterRender = () => {
    document.getElementById('homeLink')?.addEventListener('click', () => {
        window.location.hash = '/';
    });
};

export default NotFound;