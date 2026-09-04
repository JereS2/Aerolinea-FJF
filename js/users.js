/* users.js — registro, login, sesión y control de acceso */

// Crea usuarios de ejemplo (admin y pasajero) si aún no existen en localStorage.
function seedUsers() {
  if (getData(STORAGE_KEYS.USERS)) return;
  const users = [
    {
      email: 'admin@duoc.cl',
      nombre: 'Administrador Sistema',
      contraseña: 'admin123',
      rol: 'admin',
      fechaRegistro: todayISO()
    },
    {
      email: 'pasajero@gmail.com',
      nombre: 'Juan Pérez',
      contraseña: '1234',
      rol: 'pasajero',
      fechaRegistro: todayISO()
    }
  ];
  setData(STORAGE_KEYS.USERS, users);
}

// Devuelve la lista de usuarios registrados.
function getUsers() {
  return getData(STORAGE_KEYS.USERS) || [];
}

// Guarda la lista completa de usuarios.
function saveUsers(users) {
  setData(STORAGE_KEYS.USERS, users);
}

// Busca un usuario por email, sin distinguir mayúsculas/minúsculas.
function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === String(email).toLowerCase());
}

// Registra un nuevo usuario con rol "pasajero"; falla si el correo ya existe.
function registerUser({ nombre, email, contraseña }) {
  if (findUserByEmail(email)) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }
  const users = getUsers();
  const newUser = {
    email: email.trim(),
    nombre: nombre.trim(),
    contraseña,
    rol: 'pasajero',
    fechaRegistro: todayISO()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Valida credenciales e inicia sesión guardando el email en STORAGE_KEYS.SESSION.
function loginUser(email, contraseña) {
  const user = findUserByEmail(email);
  if (!user || user.contraseña !== contraseña) {
    throw new Error('Correo o contraseña incorrectos.');
  }
  setData(STORAGE_KEYS.SESSION, { email: user.email });
  return user;
}

// Devuelve el usuario de la sesión activa, o null si no hay sesión.
function getCurrentUser() {
  const session = getData(STORAGE_KEYS.SESSION);
  if (!session) return null;
  return findUserByEmail(session.email) || null;
}

// Cierra la sesión actual y redirige al inicio.
function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  location.href = getBasePath() + 'index.html';
}

// Exige sesión iniciada; si no la hay, redirige a login. Usar al cargar páginas protegidas.
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    location.href = getBasePath() + 'html/login.html';
    return null;
  }
  return user;
}

// Exige sesión de rol admin; si no corresponde, redirige a login.
function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.rol !== 'admin') {
    location.href = getBasePath() + 'html/login.html';
    return null;
  }
  return user;
}
