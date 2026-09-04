/* main.js — utilidades comunes, almacenamiento, sesión y navegación */

const STORAGE_KEYS = {
  USERS: 'af_users',
  FLIGHTS: 'af_flights',
  RESERVATIONS: 'af_reservations',
  SEATS: 'af_seats',
  SESSION: 'af_session',
  CART: 'af_cart'
};

// Lee y parsea un valor guardado en localStorage bajo la key dada.
function getData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

// Serializa y guarda un valor en localStorage bajo la key dada.
function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Formatea un número como monto en pesos chilenos (ej: $12.345).
function formatCLP(value) {
  return '$' + Math.round(Number(value) || 0).toLocaleString('es-CL');
}

// Convierte una fecha ISO (YYYY-MM-DD) al formato DD-MM-YYYY.
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

// Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD).
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* La app vive a lo más un nivel de profundidad (html/ o admin/), así que
   basta con distinguir raíz de subcarpeta para construir rutas relativas. */
function getBasePath() {
  const p = location.pathname;
  return (p.includes('/html/') || p.includes('/admin/')) ? '../' : '';
}

// Obtiene el valor de un parámetro de la URL actual.
function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

// Muestra un mensaje flotante temporal (toast) en pantalla.
function showToast(message, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} toast-visible`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, 3200);
}

// Muestra un diálogo de confirmación nativo del navegador.
function confirmDialog(message) {
  return window.confirm(message);
}

// Dibuja la barra de navegación superior según haya o no sesión activa.
function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;
  const base = getBasePath();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  let rightLinks;
  if (user) {
    const panelLink = user.rol === 'admin'
      ? `<a href="${base}admin/index.html">Panel Admin</a>`
      : `<a href="${base}html/historial-reservas.html">Mis Reservas</a>`;
    rightLinks = `
      <span class="nav-user">Hola, ${user.nombre.split(' ')[0]}</span>
      ${panelLink}
      <a href="#" id="nav-logout">Cerrar sesión</a>
    `;
  } else {
    rightLinks = `
      <a href="${base}html/login.html">Iniciar sesión</a>
      <a href="${base}html/registro.html" class="nav-cta">Registrarse</a>
    `;
  }

  el.innerHTML = `
    <div class="nav-inner">
      <a class="nav-brand" href="${base}index.html">
        <img src="${base}images/avion.svg" alt="" class="nav-brand-icon">
        AERO FJF
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú">☰</button>
      <nav class="nav-links" id="nav-links">${rightLinks}</nav>
    </div>
  `;

  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('nav-links-open'));
  }
}

// Dibuja el menú lateral del panel admin, marcando la sección activa.
function renderAdminSidebar(active) {
  const el = document.getElementById('admin-sidebar');
  if (!el) return;
  const base = getBasePath();
  const items = [
    { key: 'inicio', label: 'Inicio', href: `${base}admin/index.html` },
    { key: 'vuelos', label: 'Vuelos', href: `${base}admin/vuelos.html` },
    { key: 'nuevo', label: 'Nuevo vuelo', href: `${base}admin/nuevo-vuelo.html` }
  ];
  el.innerHTML = `
    <div class="admin-sidebar-brand">✈ AERO FJF</div>
    <nav class="admin-sidebar-nav">
      ${items.map(i => `<a href="${i.href}" class="${i.key === active ? 'active' : ''}">${i.label}</a>`).join('')}
      <a href="${base}index.html">Ver sitio público</a>
      <a href="#" id="admin-logout">Cerrar sesión</a>
    </nav>
  `;
  const logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

// Inicializa datos de ejemplo (seeds) y la navbar al cargar cualquier página.
function initApp() {
  seedUsers();
  seedFlights();
  seedSeats();
  renderNavbar();
}

document.addEventListener('DOMContentLoaded', initApp);
