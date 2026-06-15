const Inscription = () => `
    <!-- SECTION INSCRIPTION -->
    <section class="main" id="inscription">
        <div class="login-cha" id="inscriptionForm">
            <h1>TRENDYWEAR</h1>
            <h2>Créer un compte</h2>

            <label>NOM COMPLET</label>
            <input type="text" id="name" placeholder="Prenom Nom">

            <label>ADRESSE</label>
            <input type="text" id="address" placeholder="Rue, Ville, Pays">

            <label>E-MAIL</label>
            <input type="email" id="email" placeholder="votre@email.com">

            <label>MOT DE PASSE</label>
            <div class="password-box">
                <input type="password" id="password" placeholder="*****">
                <i class="fa fa-eye" id="toggleRegisterPw"></i>
            </div>

            <div class="terms">
                <input type="checkbox" id="terms">
                <label for="terms">J'accepte <span style="font-weight: bold;">les Conditions Générales</span></label>
            </div>

            <button type="button" onclick="register()">INSCRIPTION</button>

            <p class="signup">
                Déjà un compte ?
                <a href="javascript:void(0)" id="goConnexion"><span>SE CONNECTER</span></a>
            </p>
        </div>
        <div class="image-cha">
            <img src="/public/images/bgc.webp" alt="fashion">
        </div>
    </section>
`;

Inscription.afterRender = () => {
    const togglePw = document.getElementById('toggleRegisterPw');
    const pwInput = document.getElementById('password');
    if (togglePw && pwInput) {
        togglePw.addEventListener('click', () => {
            const type = pwInput.type === 'password' ? 'text' : 'password';
            pwInput.type = type;
            togglePw.classList.toggle('fa-eye-slash');
        });
    }

    const goConnexion = document.getElementById('goConnexion');
    if (goConnexion) {
        goConnexion.addEventListener('click', () => {
            window.location.hash = '/Connexion';
        }); 
    }
};

export default Inscription;