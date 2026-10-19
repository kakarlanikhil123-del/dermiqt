/* Dermiqt demo – all JavaScript.
   Fictional products and reviews. Cart, photos and form data stay in your browser only. */

// ============================================================
// 1. DATA
// ============================================================
// id, name, category, price, rating, picture kind, hue, description
const PRODUCTS = [
  { id: 1, name: "Sun Beauty Oil", cat: "Oils", price: 24, rating: 4.7, kind: "dropper", hue: 25, desc: "Lightweight dry oil with sea buckthorn and jojoba for a soft, sun-kissed glow." },
  { id: 2, name: "Exfoliator Gel", cat: "Cleansers", price: 46, rating: 4.5, kind: "tube", hue: 40, desc: "Gentle fruit-enzyme gel that lifts dullness without scrubbing." },
  { id: 3, name: "Rose Geranium Serum", cat: "Serums", price: 35, rating: 4.8, kind: "dropper", hue: 350, desc: "Balancing serum with rose water and hyaluronic acid for plump, even skin." },
  { id: 4, name: "Aloe Hydration Cream", cat: "Moisturizers", price: 29, rating: 4.6, kind: "jar", hue: 120, desc: "Cooling aloe and shea cream that keeps skin hydrated for 24 hours." },
  { id: 5, name: "Vitamin C Brightener", cat: "Serums", price: 38, rating: 4.4, kind: "dropper", hue: 35, desc: "Stable vitamin C and avocado extract to even tone and boost radiance." },
  { id: 6, name: "Clay Detox Mask", cat: "Cleansers", price: 22, rating: 4.3, kind: "jar", hue: 15, desc: "Kaolin clay mask that clears pores and calms redness in ten minutes." },
  { id: 7, name: "Night Repair Balm", cat: "Moisturizers", price: 44, rating: 4.9, kind: "jar", hue: 280, desc: "Rich overnight balm with bakuchiol and squalane for smoother mornings." },
  { id: 8, name: "Daily Foam Cleanser", cat: "Cleansers", price: 18, rating: 4.2, kind: "pump", hue: 160, desc: "Soft green-tea foam that cleanses without stripping your skin." }
];
const CATEGORIES = ["All", "Serums", "Moisturizers", "Cleansers", "Oils"];
const BENEFITS = [
  ["🌿", "Plant-based formulas", "Ingredients chosen for sensitive and everyday skin."],
  ["💧", "Science-backed hydration", "Humectants and ceramides that hold moisture in."],
  ["🐰", "Gentle and cruelty-free", "A fictional promise for this demo brand."]
];
const REVIEWS = [
  ["Amara K.", 5, "My skin looks calmer after two weeks. The serum feels light."],
  ["Jon P.", 4, "Simple routine, no irritation. The foam cleanser is my favorite."],
  ["Lena S.", 5, "The night balm made my mornings so much smoother."]
];
const FREE_SHIPPING_FROM = 50;

// ============================================================
// 2. HELPERS: storage, formatting, toast
// ============================================================
const $ = (id) => document.getElementById(id);
const money = (n) => "$" + n.toFixed(2);
const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { toast("Browser storage is full or blocked. Changes last for this visit only.", true); return false; }
}

let toastTimer;
function toast(message, isError) {
  const box = $("toast");
  box.textContent = message;
  box.className = "on" + (isError ? " bad" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (box.className = ""), 3000);
}

// State (saved in localStorage)
let cart = load("dq-cart", {});      // { productId: quantity }
let photos = load("dq-photos", {});  // { "product-1": dataUrl, hero: dataUrl }

// ============================================================
// 3. ILLUSTRATIONS: pictures drawn as SVG (no image files needed)
// ============================================================
function art(kind, hue = 20) {
  const glass = `hsl(${hue},55%,32%)`, label = "#fff6ee", bg = `hsl(${hue},55%,82%)`;
  const base = `<rect width='400' height='300' fill='${bg}'/><ellipse cx='200' cy='262' rx='130' ry='20' fill='hsl(${hue},40%,68%)'/>`;
  const scenes = {
    dropper: base + `<rect x='160' y='110' width='80' height='150' rx='14' fill='${glass}'/><rect x='170' y='160' width='60' height='60' rx='6' fill='${label}'/><rect x='188' y='72' width='24' height='42' fill='#222'/><ellipse cx='200' cy='64' rx='16' ry='24' fill='#111'/>`,
    jar: base + `<rect x='125' y='160' width='150' height='100' rx='16' fill='${glass}'/><rect x='118' y='132' width='164' height='34' rx='10' fill='#2b1a12'/><rect x='150' y='188' width='100' height='44' rx='6' fill='${label}'/>`,
    tube: base + `<path d='M150 250 L165 90 Q200 70 235 90 L250 250z' fill='${glass}'/><rect x='168' y='60' width='64' height='36' rx='8' fill='#2b1a12'/><rect x='172' y='150' width='56' height='60' rx='6' fill='${label}'/>`,
    pump: base + `<rect x='150' y='120' width='100' height='140' rx='18' fill='${glass}'/><rect x='186' y='80' width='28' height='44' fill='#2b1a12'/><rect x='186' y='72' width='64' height='14' rx='6' fill='#2b1a12'/><rect x='165' y='170' width='70' height='56' rx='6' fill='${label}'/>`,
    // Transparent bottle used on the peach feature card
    bottle: `<rect x='140' y='110' width='90' height='180' rx='14' fill='hsl(25,60%,38%)'/><rect x='150' y='170' width='70' height='70' rx='6' fill='${label}'/><rect x='168' y='70' width='34' height='44' fill='#222'/><ellipse cx='185' cy='62' rx='20' ry='26' fill='#111'/>`,
    // Portrait used in the hero (light foam) and glow section
    face: `<rect width='400' height='300' fill='hsl(${hue},70%,52%)'/><path d='M60 300 Q70 210 200 205 Q330 210 340 300z' fill='#f6e7d8'/><rect x='178' y='170' width='44' height='50' fill='hsl(25,45%,32%)'/><ellipse cx='200' cy='120' rx='62' ry='76' fill='hsl(25,45%,38%)'/><path d='M138 108 Q150 40 205 44 Q262 50 262 108 Q240 70 200 72 Q160 72 138 108z' fill='#1c120d'/><circle cx='228' cy='150' r='20' fill='#fff' opacity='.9'/><circle cx='214' cy='164' r='14' fill='#fff' opacity='.9'/><circle cx='178' cy='112' r='5' fill='#1c120d'/><circle cx='222' cy='112' r='5' fill='#1c120d'/><path d='M180 148 Q200 160 220 148' stroke='#1c120d' stroke-width='4' fill='none'/>`
  };
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>${scenes[kind] || ""}</svg>`;
  // Encode so it is safe inside CSS url(...) and an HTML style attribute
  const encoded = encodeURIComponent(svg).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27");
  return `url(data:image/svg+xml,${encoded})`;
}

// Uploaded photo if there is one, otherwise the drawn picture
const productPicture = (p) => (photos["product-" + p.id] ? `url(${photos["product-" + p.id]})` : art(p.kind, p.hue));

// ============================================================
// 4. PHOTO UPLOAD (resized in the browser before saving)
// ============================================================
function readImage(file, done) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return toast("Please choose an image file.", true);
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => toast("Could not read that image.", true);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function setPhoto(key, dataUrl) {
  if (dataUrl) photos[key] = dataUrl; else delete photos[key];
  save("dq-photos", photos);
  paintPictures();
  renderShop();
}

// ============================================================
// 5. PAGE PICTURES + STATIC SECTIONS
// ============================================================
function paintPictures() {
  $("heroImg").style.setProperty("--img", photos.hero ? `url(${photos.hero})` : art("face", 30));
  $("glowImg").style.setProperty("--img", art("face", 18));
  $("featImg").style.setProperty("--img", art("bottle"));
}
$("benefits").innerHTML = BENEFITS.map(([icon, title, text]) =>
  `<div class="benefit"><div class="icon">${icon}</div><h3>${title}</h3><p>${text}</p></div>`).join("");
$("reviewList").innerHTML = REVIEWS.map(([name, rating, text]) =>
  `<div class="review"><div class="stars">${stars(rating)}</div><p>${text}</p><small>– ${name}</small></div>`).join("");

$("heroUp").onchange = (e) => readImage(e.target.files[0], (url) => { setPhoto("hero", url); toast("Hero photo updated."); });
$("heroRm").onclick = () => { setPhoto("hero"); toast("Hero photo reset."); };
$("burger").onclick = () => $("nav").classList.toggle("open");
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => $("nav").classList.remove("open")));

// ============================================================
// 6. SHOP: search, category filter, sort
// ============================================================
let category = "All";

function visibleProducts() {
  const query = $("q").value.trim().toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (category === "All" || p.cat === category) && (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(query));
  const sorters = {
    pop: (a, b) => b.rating - a.rating,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    az: (a, b) => a.name.localeCompare(b.name)
  };
  return list.sort(sorters[$("sort").value]);
}

function renderShop() {
  $("cats").innerHTML = CATEGORIES.map((c) => `<button class="${c === category ? "on" : ""}" data-cat="${c}">${c}</button>`).join("");
  const list = visibleProducts();
  $("grid").innerHTML = list.length
    ? list.map((p) => `
      <article class="card">
        <div class="pimg" data-open="${p.id}" style="--img:${productPicture(p)}" role="button" tabindex="0" aria-label="View ${p.name}"></div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="meta"><span class="stars">${stars(p.rating)}</span><span class="price">${money(p.price)}</span></div>
          <small>${p.cat}</small>
          <button class="pill yellow" data-add="${p.id}">Add to cart</button>
        </div>
      </article>`).join("")
    : `<p class="empty">No products match. Clear the search or choose “All”.</p>`;
}
$("q").oninput = renderShop;
$("sort").onchange = renderShop;
$("cats").onclick = (e) => { if (e.target.dataset.cat) { category = e.target.dataset.cat; renderShop(); } };
$("grid").addEventListener("click", (e) => {
  if (e.target.dataset.add) addToCart(+e.target.dataset.add);
  if (e.target.dataset.open) openProduct(+e.target.dataset.open);
});
$("grid").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.dataset.open) openProduct(+e.target.dataset.open);
});

// ============================================================
// 7. CART
// ============================================================
function addToCart(id, qty = 1) {
  cart[id] = (cart[id] || 0) + qty;
  save("dq-cart", cart);
  renderCart();
  toast(PRODUCTS.find((p) => p.id === id).name + " added to cart.");
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  save("dq-cart", cart);
  renderCart();
}
function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + PRODUCTS.find((p) => p.id === +id).price * qty, 0);
}
function renderCart() {
  const entries = Object.entries(cart);
  $("cartCount").textContent = entries.reduce((n, [, q]) => n + q, 0);
  $("cartItems").innerHTML = entries.length
    ? entries.map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === +id);
        return `<div class="line">
          <div class="pimg" style="--img:${productPicture(p)}"></div>
          <div><b>${p.name}</b><br><small>${money(p.price)}</small>
            <div class="qty"><button data-dec="${p.id}" aria-label="Decrease">−</button>${qty}<button data-inc="${p.id}" aria-label="Increase">+</button></div></div>
          <button class="link" data-del="${p.id}" aria-label="Remove ${p.name}">✕</button></div>`;
      }).join("")
    : `<p class="empty">Your cart is empty. Add a product to get started.</p>`;
  const total = cartTotal();
  $("subtotal").textContent = money(total);
  $("shipNote").textContent = total === 0 ? "" : total >= FREE_SHIPPING_FROM
    ? "Free shipping applied (demo)."
    : `Add ${money(FREE_SHIPPING_FROM - total)} more for free shipping (demo).`;
}
$("cartItems").onclick = (e) => {
  const d = e.target.dataset;
  if (d.inc) changeQty(+d.inc, 1);
  if (d.dec) changeQty(+d.dec, -1);
  if (d.del) { delete cart[d.del]; save("dq-cart", cart); renderCart(); }
};
$("cartBtn").onclick = () => $("drawer").classList.add("open");
$("closeCart").onclick = () => $("drawer").classList.remove("open");
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("drawer").classList.remove("open"); });
$("checkout").onclick = () => {
  if (!Object.keys(cart).length) return toast("Your cart is empty.", true);
  const total = money(cartTotal());
  cart = {}; save("dq-cart", cart); renderCart();
  $("drawer").classList.remove("open");
  toast(`Demo order placed: ${total}. No payment was taken.`);
};

// ============================================================
// 8. PRODUCT POPUP (details + photo upload)
// ============================================================
const dlg = $("dlg");
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // click backdrop to close

function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id), key = "product-" + id;
  $("dlgBody").innerHTML = `
    <div class="modal">
      <div>
        <div class="pimg" style="--img:${productPicture(p)}"></div>
        <div class="row">
          <label class="up">📷 ${photos[key] ? "Replace" : "Upload"} photo<input type="file" accept="image/*" hidden id="pUp"></label>
          <button class="up" id="pRm">Remove photo</button>
        </div>
      </div>
      <div>
        <button class="link" style="float:right" id="pClose" aria-label="Close">✕</button>
        <small>${p.cat}</small><h2 style="font-size:30px">${p.name}</h2>
        <div class="stars">${stars(p.rating)} <small>${p.rating.toFixed(1)}</small></div>
        <p style="margin:12px 0">${p.desc}</p>
        <p class="price" style="font-size:22px">${money(p.price)}</p>
        <button class="pill yellow wide" id="pAdd">Add to cart</button>
      </div>
    </div>`;
  $("pClose").onclick = () => dlg.close();
  $("pAdd").onclick = () => { addToCart(id); dlg.close(); };
  $("pUp").onchange = (e) => readImage(e.target.files[0], (url) => { setPhoto(key, url); renderCart(); openProduct(id); toast("Photo saved."); });
  $("pRm").onclick = () => {
    if (!photos[key]) return toast("No uploaded photo to remove.", true);
    setPhoto(key); renderCart(); openProduct(id); toast("Photo removed.");
  };
  if (!dlg.open) dlg.showModal();
}

// ============================================================
// 9. FORMS (validated; nothing is sent anywhere)
// ============================================================
const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

$("contactForm").onsubmit = (e) => {
  e.preventDefault();
  const f = e.target.elements, msg = $("contactMsg");
  let error = "";
  if (f.name.value.trim().length < 2) error = "Enter your name.";
  else if (!validEmail(f.email.value)) error = "Enter a valid email address.";
  else if (f.msg.value.trim().length < 10) error = "Message must be at least 10 characters.";
  msg.className = error ? "err" : "ok";
  msg.textContent = error || "Thanks! This is a demo, so nothing was sent.";
  if (!error) e.target.reset();
};
$("newsForm").onsubmit = (e) => {
  e.preventDefault();
  const input = $("newsEmail"), msg = $("newsMsg"), ok = validEmail(input.value);
  msg.className = ok ? "ok" : "err";
  msg.textContent = ok ? "Subscribed (demo). Nothing was sent." : "Enter a valid email address.";
  if (ok) input.value = "";
};

// ============================================================
// 10. START
// ============================================================
paintPictures();
renderShop();
renderCart();
