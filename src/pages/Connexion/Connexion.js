        

const Connexion = () => `
<!-- SECTION CONNEXION -->
<section class="main" id="connexion">
    <div class="image-cha">
     
<img src="/public/images/manteau1.png" alt="fashion" >
        <div class="quote">"La mode n'est pas seulement quelque chose qui existe dans les robes."</div>
    </div>
    <div class="login-cha">
        <h1>TRENDYWEAR</h1>
        <h2>Bienvenue</h2>
        <label>E-MAIL</label>
        <input type="email" id="loginEmail" placeholder="votre@email.com">
        <label>MOT DE PASSE</label>
        <div class="password-box">
            <input type="password" id="loginPassword" placeholder="*****">
            <i class="fa fa-eye" id="toggleLoginPw"></i>
        </div>
        <button id="btnLogin">Se connecter</button>
        <p class="signup">
            Nouveau chez Trendywear ?
            <a href="javascript:void(0)" id="goInscription"><span>CRÉER UN COMPTE</span></a>
        </p>
    </div>
</section>
`;
Connexion.afterRender = () => {
    // œil mot de passe
    const togglePw = document.getElementById('toggleLoginPw');
    const pwInput = document.getElementById('loginPassword');
    if (togglePw && pwInput) {
        togglePw.addEventListener('click', () => {
            const type = pwInput.type === 'password' ? 'text' : 'password';
            pwInput.type = type;
            togglePw.classList.toggle('fa-eye-slash');
        });
    }
    // bouton login → appelle la fonction globale de auth.js
    document.getElementById('btnLogin')?.addEventListener('click', () => {
        window.login();
    });
    // lien vers inscription
    document.getElementById('goInscription')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '/Inscription';
    });
};

export default Connexion;