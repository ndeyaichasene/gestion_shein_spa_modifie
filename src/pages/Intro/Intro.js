import { footer } from '../../components/Footer.js';
import { carteProduit, attacherActionsProduits } from '../../components/ProductGrid.js';
import { API_BASE } from '../../config.js';

  //<img src="/public/images/tournesol.jpg" alt="Summer Edit" class="hero-bg">

const Intro = () => `
   <!-- HERO -->
    <section class="hero">
  <video autoplay muted loop playsinline class="hero-bg">
        <source src="public/videos/fonshionCon.mp4" type="video/mp4">
    </video>
       
        
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <span class="badge">OFFRE LIMITÉE</span>
            <h1>SUMMER EDIT :<br><em>Jusqu'à -50%</em></h1>
            <p>Découvrez notre nouvelle collection estivale...</p>
            <div class="hero-actions">
                <a href="#/Connexion" class="btn btn-femme">SE CONNECTER</a>
                <a href="#/Inscription" class="btn btn-homme">S'INSCRIRE</a>
            </div>
        </div>
    </section>

    <!-- CATALOGUE -->
  <section class="catalogue">
        <div class="container">
            <div class="catalogue-header">
                <div><div class="eyebrow">CATALOGUES</div><h2 class="catalogue-title font-serif">Nouveautés de la semaine</h2></div>
                <div class="sort">Trier par: <strong>Les plus récents ⌄</strong></div>
            </div>
            <div class="catalogue-grid">
                <aside class="sidebar">
                    <div class="sidebar-section"><h3>CATÉGORIES</h3><ul class="categories"><li><span>Robes</span><span>(124)</span></li><li><span>Hauts</span><span>(86)</span></li><li><span>Pantalons</span><span>(52)</span></li><li><span>Accessoires</span><span>(210)</span></li></ul></div>
                    <div class="sidebar-section"><h3>TAILLE</h3><div class="sizes"><button class="size-btn">XS</button><button class="size-btn active">S</button><button class="size-btn">M</button><button class="size-btn">L</button><button class="size-btn">XL</button></div></div>
                    <div class="sidebar-section"><h3>COULEUR</h3><div class="colors"><button class="color-btn c-black active"></button><button class="color-btn c-white"></button><button class="color-btn c-blue"></button><button class="color-btn c-red"></button><button class="color-btn c-green"></button></div></div>
                    <div class="sidebar-section"><h3>PRIX</h3><input type="range" min="0" max="500" value="350" class="price-range"><div class="price-labels"><span>0€</span><span>500€</span></div></div>
                </aside>
                <div>
                    <div class="products" id="products-liste">
                        <p>Chargement des produits...</p>
                    </div>
                    <div class="pagination"><button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn pink">3</button><button class="page-btn">›</button></div>
                </div>
            </div>
        </div>
    </section>
    ${footer}

`;

Intro.afterRender = async () => {
    // tout ce qui touche au DOM va ICI
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const liste = document.getElementById('products-liste');

    try {
        const res = await fetch(`${API_BASE}/produits`);
        const produits = await res.json();

        if (!produits.length) {
            liste.innerHTML = '<p>Aucun produit disponible pour le moment.</p>';
            return;
        }

        liste.innerHTML = produits.map(carteProduit).join('');
        await attacherActionsProduits(liste);

    } catch (err) {
        console.error(err);
        liste.innerHTML = '<p>Impossible de charger les produits.</p>';
    }
};

export default Intro;