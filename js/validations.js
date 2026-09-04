/* validations.js — validadores reutilizables y feedback en tiempo real */

const EMAIL_DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

// Verifica que un valor no sea vacío, null ni undefined.
function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

// Valida formato de correo y que el dominio esté en la lista permitida.
function isValidEmail(email) {
  if (!isRequired(email)) return false;
  if (email.length > 100) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return false;
  const dominio = email.split('@')[1]?.toLowerCase();
  return EMAIL_DOMINIOS_PERMITIDOS.includes(dominio);
}

// Valida que la contraseña tenga entre 4 y 10 caracteres.
function isValidPassword(pw) {
  return isRequired(pw) && pw.length >= 4 && pw.length <= 10;
}

// Valida que el número de tarjeta tenga exactamente 16 dígitos.
function isValidCardNumber(num) {
  return /^\d{16}$/.test(String(num).replace(/\s/g, ''));
}

// Valida formato MM/YY y que la fecha de expiración no esté vencida.
function isValidExpiry(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const [mm, yy] = mmYY.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const currentYY = now.getFullYear() % 100;
  const currentMM = now.getMonth() + 1;
  if (yy < currentYY) return false;
  if (yy === currentYY && mm < currentMM) return false;
  return true;
}

// Valida que el CVV tenga 3 o 4 dígitos.
function isValidCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Verifica que una fecha (ISO) sea hoy o una fecha futura.
function isFutureOrTodayDate(dateStr) {
  if (!isRequired(dateStr)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return d >= today;
}

// Verifica que el valor sea un entero mayor o igual al mínimo indicado.
function isPositiveInteger(value, min = 0) {
  const n = Number(value);
  return Number.isInteger(n) && n >= min;
}

// Verifica que el valor sea un número mayor o igual al mínimo indicado.
function isNonNegativeNumber(value, min = 0) {
  const n = Number(value);
  return !isNaN(n) && n >= min;
}

// Muestra un mensaje de error bajo un campo del formulario y lo marca como inválido.
function setFieldError(inputEl, message) {
  const group = inputEl.closest('.form-group') || inputEl.parentElement;
  let errorEl = group.querySelector('.error-message');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    group.appendChild(errorEl);
  }
  errorEl.textContent = message || '';
  inputEl.classList.toggle('input-invalid', !!message);
}

// Limpia el mensaje de error y el estado inválido de un campo.
function clearFieldError(inputEl) {
  setFieldError(inputEl, '');
}
