const products = [
  {id:'c1',cat:'Cookies',name:'Le Normal',price:600,note:'chocolat noir, façon Levain Bakery'},
  {id:'c2',cat:'Cookies',name:'Gingembre',price:650},
  {id:'c3',cat:'Cookies',name:'Chamallow',price:700},
  {id:'c4',cat:'Cookies',name:'Chocolat & Café',price:750,note:"testé lors d'une fête de famille"},
  {id:'c5',cat:'Cookies',name:'Trois Chocolats',price:750},
  {id:'b1',cat:'Brownies',name:'Classique + glaçage caramel',price:950},
  {id:'b2',cat:'Brownies',name:'Classique + glaçage mangue',price:1050},
  {id:'b3',cat:'Brownies',name:'Brookies + glaçage caramel',price:1100,note:'mi-brownie, mi-cookie'},
  {id:'b4',cat:'Brownies',name:'Brookies + glaçage mangue',price:1200},
  {id:'b5',cat:'Brownies',name:'Classique + glaçage chocolat',price:1400},
  {id:'b6',cat:'Brownies',name:'Brookies + glaçage chocolat',price:1550},
  {id:'r1',cat:'Cinnamon Rolls',name:'Nature + glaçage vanille',price:400},
  {id:'r2',cat:'Cinnamon Rolls',name:'Nature + glaçage passion',price:500},
  {id:'r3',cat:'Cinnamon Rolls',name:'Nature + glaçage bissap',price:550},
  {id:'r4',cat:'Cinnamon Rolls',name:'Chocolat + glaçage vanille',price:650},
  {id:'r5',cat:'Cinnamon Rolls',name:'Nature + glaçage chocolat',price:700},
  {id:'r6',cat:'Cinnamon Rolls',name:'Chocolat + glaçage passion',price:750},
  {id:'r7',cat:'Cinnamon Rolls',name:'Chocolat + glaçage bissap',price:800},
  {id:'r8',cat:'Cinnamon Rolls',name:'Chocolat + glaçage chocolat',price:950},
  {id:'r9',cat:'Cinnamon Rolls',name:'Nature + glaçage cream cheese',price:1050,note:'vrai Philadelphia'},
  {id:'r10',cat:'Cinnamon Rolls',name:'Chocolat + glaçage cream cheese',price:1250},
  {id:'d1',cat:'Donuts',name:'Glaçage vanille',price:300},
  {id:'d2',cat:'Donuts',name:'Glaçage mangue',price:400},
  {id:'d3',cat:'Donuts',name:'Glaçage passion',price:450},
  {id:'d4',cat:'Donuts',name:'Glaçage chocolat',price:650},
  {id:'x1',cat:'Box découverte',name:'Box Cookies',price:3050,note:'les 5 saveurs, une pièce de chaque'},
  {id:'x2',cat:'Box découverte',name:'Box Brownies',price:6400,note:'les 6 variantes'},
  {id:'x3',cat:'Box découverte',name:'Box Cinnamon Nature',price:2800,note:'5 glaçages, base nature'},
  {id:'x4',cat:'Box découverte',name:'Box Cinnamon Chocolat',price:3850,note:'5 glaçages, base chocolat'},
  {id:'x5',cat:'Box découverte',name:'Box Donuts',price:1600,note:'les 4 saveurs'},
  {id:'x6',cat:'Box découverte',name:'Box Sweet Glaze',price:2700,note:'1 cookie, 1 brownie, 1 cinnamon roll, 1 donut'},
  {id:'s1',cat:'Suppléments',name:'Oreo concassé',price:200,noMinMax:true,note:'à ajouter à une pièce'},
  {id:'s2',cat:'Suppléments',name:"M&M's",price:200,noMinMax:true,note:'à ajouter à une pièce'},
  {id:'s3',cat:'Suppléments',name:'Kinder',price:300,noMinMax:true,note:'à ajouter à une pièce'},
  {id:'s4',cat:'Suppléments',name:'Caramel',price:300,noMinMax:true,note:'à ajouter à une pièce'}
];

let cart = {};
const FORM_ENDPOINT = 'https://formspree.io/f/xdekoalg';
const LAST_ORDERS_KEY = 'sweetGlazeRecentOrders';

function fmt(n){ return n.toLocaleString('fr-FR') + ' F'; }

function readRecentOrders(){
  try{
    const saved = localStorage.getItem(LAST_ORDERS_KEY);
    const orders = saved ? JSON.parse(saved) : [];
    return Array.isArray(orders) ? orders : [];
  }catch(e){
    console.error('Lecture des commandes récentes impossible :', e);
    return [];
  }
}

function rememberOrder(order){
  try{
    const orders = [order, ...readRecentOrders()].slice(0, 5);
    localStorage.setItem(LAST_ORDERS_KEY, JSON.stringify(orders));
    updateLastOrderButton();
  }catch(e){
    console.error('Enregistrement de la commande récente impossible :', e);
  }
}

function updateLastOrderButton(){
  const button = document.getElementById('lastOrderBtn');
  if(button) button.hidden = readRecentOrders().length === 0;
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[character]));
}

function renderMenu(){
  const cats = [...new Set(products.map(p=>p.cat))];
  const mount = document.getElementById('menuMount');
  const showcase = `
    <div class="menu-showcase" aria-label="Aperçu des créations">
      <figure class="showcase-card showcase-cookie">
        <img src="images/cookie.jpeg" alt="Cookie Sweet Glaze">
        <figcaption><span>Le fait maison</span><strong>Cookies généreux</strong></figcaption>
      </figure>
      <figure class="showcase-card showcase-roll">
        <img src="images/cinnamon-roll.jpeg" alt="Cinnamon roll Sweet Glaze">
        <figcaption><span>Tout doux</span><strong>Cinnamon rolls</strong></figcaption>
      </figure>
      <figure class="showcase-card showcase-cookies">
        <img src="images/cookies.jpeg" alt="Cookies artisanaux Sweet Glaze">
        <figcaption><span>À partager</span><strong>Douceurs artisanales</strong></figcaption>
      </figure>
    </div>
  `;
  mount.innerHTML = showcase + cats.map(cat => `
    <div class="category">
      <h3>${cat}</h3>
      ${products.filter(p=>p.cat===cat).map(p => `
        <div class="menu-item">
          <div class="menu-item-info">
            <span class="name">${p.name}</span>
            ${p.note ? `<span class="note">${p.note}</span>` : ''}
          </div>
          <span class="fill"></span>
          <span class="price">${fmt(p.price)}</span>
          <div class="stepper">
            <button onclick="changeQty('${p.id}',-1)" aria-label="Retirer">−</button>
            <span class="qty" id="qty-${p.id}">${cart[p.id]||0}</span>
            <button onclick="changeQty('${p.id}',1)" aria-label="Ajouter">+</button>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function changeQty(id, delta){
  const p = products.find(p=>p.id===id);
  const min = 1;
  const max = 6;
  const current = cart[id] || 0;
  const next = delta > 0
    ? (current === 0 ? min : Math.min(current + 1, max))
    : (current <= min ? 0 : current - 1);
  if(next === 0){ delete cart[id]; } else { cart[id] = next; }
  const qtyEl = document.getElementById('qty-'+id);
  if(qtyEl) qtyEl.textContent = cart[id] || 0;
  updateCartCount();
  renderDrawer();
}

function updateCartCount(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = count;
}

function cartTotal(){
  return Object.entries(cart).reduce((sum,[id,qty]) => {
    const p = products.find(p=>p.id===id);
    return sum + (p ? p.price*qty : 0);
  }, 0);
}

function renderDrawer(){
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const entries = Object.entries(cart);
  if(entries.length === 0){
    body.innerHTML = '<div class="empty-cart">Ton panier est vide pour le moment.</div>';
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = entries.map(([id,qty]) => {
    const p = products.find(p=>p.id===id);
    return `
      <div class="cart-row">
        <div>
          <div class="ci-name">${p.name}</div>
          <div class="ci-price">${qty} × ${fmt(p.price)}</div>
          <div class="ci-subtotal">Sous-total : ${fmt(p.price * qty)}</div>
        </div>
        <div class="stepper">
          <button onclick="changeQty('${id}',-1)" aria-label="Retirer">−</button>
          <span class="qty">${qty}</span>
          <button onclick="changeQty('${id}',1)" aria-label="Ajouter">+</button>
        </div>
      </div>
    `;
  }).join('');
  foot.innerHTML = `
    <div class="total-row"><span>Total</span><span>${fmt(cartTotal())}</span></div>
    <button class="btn-full" onclick="showCheckout()">Commander</button>
  `;
}

function openCart(){
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.querySelector('.drawer-head h3').textContent = 'Ton panier';
  renderDrawer();
}

function openRecentOrders(){
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.querySelector('.drawer-head h3').textContent = 'Dernières commandes';
  renderRecentOrders();
}

function closeCart(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

function renderRecentOrders(){
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const orders = readRecentOrders();
  body.innerHTML = `
    <p class="recent-orders-intro">Retrouve les dernières commandes passées pour te rappeler ce que tu as goûté.</p>
    ${orders.map(order => `
      <article class="recent-order">
        <div class="recent-order-head">
          <strong>${escapeHtml(new Date(order.date).toLocaleDateString('fr-FR'))}</strong>
          <span>${fmt(Number(order.total) || 0)}</span>
        </div>
        <p>${escapeHtml(order.lines).replace(/\n/g, '<br>')}</p>
        <button type="button" class="recent-order-review" onclick="prepareOrderReview()">Laisser un avis sur cette commande</button>
      </article>
    `).join('')}
  `;
  foot.innerHTML = '<button class="btn-full" onclick="openCart()">Voir le panier</button>';
}

function showCheckout(){
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  body.innerHTML = `
    <p class="checkout-intro">Vérifie tes informations avant de confirmer ta commande.</p>
    <div class="checkout-section">
    <div class="checkout-section-title">Tes coordonnées</div>
    <div class="field">
      <label for="ck-name">Nom complet</label>
      <input id="ck-name" type="text" autocomplete="name">
    </div>
    <div class="field">
      <label for="ck-email">Email <span class="optional-label">(facultatif)</span></label>
      <input id="ck-email" type="email" autocomplete="email">
    </div>
    <div class="field">
      <label for="ck-phone">Numéro de téléphone</label>
      <input id="ck-phone" type="tel">
    </div>
    <div class="field">
      <label for="ck-address">Adresse de livraison</label>
      <input id="ck-address" type="text">
    </div>
    </div>
    <div class="checkout-section checkout-payment-section">
    <div class="checkout-section-title">Ton moyen de paiement</div>
    <div class="field">
      <div class="payment-options">
        <label class="payment-option"><input type="radio" name="pay" value="Wave"> <span>Wave</span></label>
        <label class="payment-option"><input type="radio" name="pay" value="Moov Money"> <span>Moov Money</span></label>
        <label class="payment-option"><input type="radio" name="pay" value="Espèces"> <span>Espèces à la livraison</span></label>
      </div>
    </div>
    </div>
    <div class="error-text" id="ck-error">Merci de remplir tous les champs et de choisir un moyen de paiement.</div>
  `;
  foot.innerHTML = `
    <div class="total-row"><span>Total</span><span>${fmt(cartTotal())}</span></div>
    <button id="submitBtn" class="btn-full" onclick="submitOrder()">Valider ma commande</button>
  `;
}

async function submitOrder(){
  const nameInput = document.getElementById('ck-name');
  const emailInput = document.getElementById('ck-email');
  const phoneInput = document.getElementById('ck-phone');
  const addressInput = document.getElementById('ck-address');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const pay = document.querySelector('input[name="pay"]:checked');
  const error = document.getElementById('ck-error');

  const missing = [];
  [nameInput, phoneInput, addressInput].forEach(input => input.classList.remove('input-error'));
  document.querySelectorAll('input[name="pay"]').forEach(input => input.closest('.payment-option').classList.remove('input-error'));

  if(!name){ missing.push('le nom complet'); nameInput.classList.add('input-error'); }
  if(!phone){ missing.push('le numéro de téléphone'); phoneInput.classList.add('input-error'); }
  if(!address){ missing.push("l'adresse de livraison"); addressInput.classList.add('input-error'); }
  if(!pay){
    missing.push('le moyen de paiement');
    document.querySelectorAll('input[name="pay"]').forEach(input => input.closest('.payment-option').classList.add('input-error'));
  }

  if(missing.length){
    error.textContent = `Il manque : ${missing.join(', ')}.`;
    error.classList.add('visible');
    return;
  }
  error.classList.remove('visible');

  const total = cartTotal();
  const lines = Object.entries(cart).map(([id,qty]) => {
    const p = products.find(p=>p.id===id);
    return `${p.name} — ${qty} × ${fmt(p.price)} = ${fmt(p.price*qty)}`;
  }).join('\n');
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const submitBtn = document.getElementById('submitBtn');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours...'; }

  let success = false;
  try{
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Accept':'application/json'},
      body: JSON.stringify({
        _subject: `Nouvelle commande Sweet Glaze — ${fmt(total)}`,
        nom: name, email: email, telephone: phone, adresse: address,
        paiement: pay.value, commande: lines, total: fmt(total)
      })
    });
    success = res.ok;
  }catch(e){
    console.error('Envoi de la commande impossible :', e);
  }

  if(!success){
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Valider ma commande'; }
    body.innerHTML += '<div class="error-text submit-error visible">Une erreur est survenue lors de l\'envoi. Réessaie, ou contacte Sweet Glaze directement.</div>';
    return;
  }

  const order = {
    date: new Date().toISOString(),
    lines,
    total
  };
  rememberOrder(order);

  body.innerHTML = `
    <div class="confirm-box">
      <h4>Commande envoyée !</h4>
      <p>Merci ${name.split(' ')[0]}, ta commande de ${fmt(total)} a bien été reçue par Sweet Glaze.</p>
      <p>Tu recevras une confirmation sous 24h, puis les instructions pour payer par ${pay.value === 'Espèces' ? 'espèces à la livraison' : pay.value}. Livraison via Yango à l'adresse indiquée.</p>
      <button type="button" class="btn-full" onclick="prepareOrderReview()">Commande reçue ? Laisse-nous un avis</button>
    </div>
  `;
  foot.innerHTML = '<button class="btn-full" onclick="closeCart()">Fermer</button>';
  cart = {};
  updateCartCount();
  renderMenu();
  updateLastOrderButton();
}

function showMenu(){
  document.getElementById('homeSections').style.display = 'none';
  const el = document.getElementById('menu');
  el.style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

function hideMenu(){
  document.getElementById('menu').style.display = 'none';
  document.getElementById('homeSections').style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

function updatePhotoName(input){
  const name = document.getElementById('photoName');
  const clearButton = document.getElementById('clearPhotoBtn');
  const file = input.files[0];
  name.textContent = file ? file.name : 'Aucun fichier sélectionné';
  clearButton.hidden = !file;
}

function clearPhoto(){
  const input = document.getElementById('rv-photo');
  input.value = '';
  updatePhotoName(input);
}

function prepareReview(){
  const menu = document.getElementById('menu');
  const home = document.getElementById('homeSections');
  const form = document.getElementById('reviewForm');

  if(menu.style.display !== 'none'){
    menu.style.display = 'none';
    home.style.display = 'block';
  }
  document.getElementById('rv-product').value = 'Toute la commande';
  form.scrollIntoView({behavior:'smooth', block:'center'});
  document.getElementById('rv-name').focus({preventScroll:true});
}

function prepareOrderReview(){
  closeCart();
  prepareReview();
}

async function handleReviewSubmit(event){
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById('reviewStatus');

  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Envoi en cours...';
  status.className = 'review-status visible';
  status.textContent = '';

  try{
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {Accept: 'application/json'},
      body: new FormData(form)
    });
    if(!response.ok){
      throw new Error(`Formspree a répondu avec le statut ${response.status}.`);
    }

    form.reset();
    document.getElementById('rv-product').value = 'Toute la commande';
    updatePhotoName(document.getElementById('rv-photo'));
    status.textContent = 'Merci pour ton avis ! Il a bien été envoyé à Sweet Glaze.';
    window.setTimeout(() => {
      status.textContent = '';
      status.className = 'review-status';
    }, 5000);
  }catch(error){
    console.error('Envoi de l’avis impossible :', error);
    status.className = 'review-status visible error';
    status.textContent = 'Impossible d’envoyer ton avis pour le moment. Réessaie dans quelques instants.';
  }finally{
    submitButton.disabled = false;
    submitButton.textContent = 'Envoyer mon avis';
  }
}

function scrollToCustom(event){
  event.preventDefault();
  const section = document.getElementById('custom');
  section.scrollIntoView({behavior:'smooth', block:'start'});
  section.classList.remove('focused');
  window.setTimeout(() => section.classList.add('focused'), 450);
  window.setTimeout(() => section.classList.remove('focused'), 1800);
}

function openImage(src, name){
  const lightbox = document.getElementById('imageLightbox');
  const image = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');
  image.src = src;
  image.alt = name;
  caption.textContent = name;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeImage(){
  const lightbox = document.getElementById('imageLightbox');
  const image = document.getElementById('lightboxImage');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  image.src = '';
  document.body.classList.remove('lightbox-open');
}

document.addEventListener('keydown', event => {
  if(event.key === 'Escape') closeImage();
});

document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
renderMenu();
