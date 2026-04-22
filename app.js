// ===== MENU DATA =====
const menuItems = [
  { id: 1, name: "Dalma", emoji: "🍲", category: "rice", price: 149, veg: true, desc: "Classic Odia lentil & vegetable curry with spices" },
  { id: 2, name: "Pakhala Bhata", emoji: "🍚", category: "rice", price: 99, veg: true, desc: "Fermented rice soaked in water, served with badi, saga & pickle" },
  { id: 3, name: "Odia Thali", emoji: "🥘", category: "thali", price: 249, veg: true, desc: "Complete meal: rice, dal, 2 sabji, dalma, chutney & dessert" },
  { id: 4, name: "Non-Veg Thali", emoji: "🍱", category: "thali", price: 299, veg: false, desc: "Rice, fish curry, mutton/chicken, dal, sabji & sweet" },
  { id: 5, name: "Macha Jhola", emoji: "🐟", category: "curry", price: 199, veg: false, desc: "Authentic Odia fish curry in mustard & turmeric gravy" },
  { id: 6, name: "Aloo Potala Rasa", emoji: "🥔", category: "curry", price: 129, veg: true, desc: "Potato & pointed gourd curry in light tangy gravy" },
  { id: 7, name: "Mudhi Mixture", emoji: "🫙", category: "snacks", price: 59, veg: true, desc: "Puffed rice tossed with onion, tomato, chilli & spices" },
  { id: 8, name: "Bara (Lentil Fritters)", emoji: "🫓", category: "snacks", price: 79, veg: true, desc: "Crispy deep-fried urad dal fritters, served hot with chutney" },
  { id: 9, name: "Rasagola", emoji: "🍮", category: "sweets", price: 80, veg: true, desc: "Soft, spongy cottage cheese balls in light sugar syrup" },
  { id: 10, name: "Chenna Poda", emoji: "🧀", category: "sweets", price: 120, veg: true, desc: "Baked caramelised cottage cheese cake — Odisha's pride" },
  { id: 11, name: "Chhena Jhili", emoji: "🍯", category: "sweets", price: 90, veg: true, desc: "Fried cottage cheese dumplings in dense sugar syrup" },
  { id: 12, name: "Santula", emoji: "🥦", category: "curry", price: 109, veg: true, desc: "Healthy mixed vegetable preparation with minimal spices" },
];

let activeCategory = "all";

// ===== RENDER MENU =====
function renderMenu(cat = "all") {
  const grid = document.getElementById("menuGrid");
  const items = cat === "all" ? menuItems : menuItems.filter(i => i.category === cat);

  grid.innerHTML = items.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <div class="card-img">${item.emoji}</div>
      <div class="card-body">
        <div class="card-category">
          <span class="${item.veg ? 'veg-badge' : 'nonveg-badge'}"></span>
          ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== CATEGORY FILTER =====
document.getElementById("catGrid").addEventListener("click", (e) => {
  if (!e.target.matches(".cat-btn")) return;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  activeCategory = e.target.dataset.cat;
  renderMenu(activeCategory);
});

// ===== CART TOAST =====
let toastTimeout;
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const toast = document.getElementById("cartToast");
  toast.textContent = `✅ ${item.name} added — ₹${item.price}`;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ===== SCROLL TO MENU =====
function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// ===== HAMBURGER =====
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Close nav on link click
document.getElementById("navLinks").addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    document.getElementById("navLinks").classList.remove("open");
  }
});

// ===== ORDER FORM =====
function handleOrder(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const order = document.getElementById("order").value.trim();

  const msg = encodeURIComponent(
    `🍛 *New Order — Odisha Dhamaka*\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📍 Address: ${address}\n\n` +
    `🛒 Order:\n${order}`
  );

  // Opens WhatsApp with pre-filled message
  window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
}

// ===== INTERSECTION OBSERVER (fade-in) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

function setupAnimations() {
  document.querySelectorAll(".menu-card, .review-card, .info-item").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
}

// ===== INIT =====
renderMenu();
setupAnimations();
