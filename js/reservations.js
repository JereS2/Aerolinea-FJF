/* reservations.js — creación, consulta y cancelación de reservas */

const PRECIO_EQUIPAJE_BODEGA = 25000;

// Devuelve la lista de reservas.
function getReservations() {
  return getData(STORAGE_KEYS.RESERVATIONS) || [];
}

// Guarda la lista completa de reservas.
function saveReservations(list) {
  setData(STORAGE_KEYS.RESERVATIONS, list);
}

// Genera un código único de reserva con formato "AERO-XXXXXX".
function generateReservationCode() {
  const existing = getReservations().map(r => r.id);
  let code;
  do {
    const rand = Math.floor(100000 + Math.random() * 900000);
    code = `AERO-${rand}`;
  } while (existing.includes(code));
  return code;
}

// Busca una reserva por su código.
function getReservationById(id) {
  return getReservations().find(r => r.id === id);
}

// Devuelve las reservas hechas por un usuario según su email.
function getReservationsByUser(email) {
  return getReservations().filter(r => r.usuarioEmail === email);
}

// Devuelve las reservas asociadas a un vuelo.
function getReservationsByFlight(vueloId) {
  return getReservations().filter(r => r.vueloId === Number(vueloId));
}

// Crea una reserva confirmada y marca los asientos elegidos como ocupados.
function createReservation({ usuarioEmail, vueloId, asientos, equipajeMano, equipajeBodega, totalPagado }) {
  const reservations = getReservations();
  const reserva = {
    id: generateReservationCode(),
    usuarioEmail,
    vueloId: Number(vueloId),
    asientos,
    equipajeMano: !!equipajeMano,
    equipajeBodega: Number(equipajeBodega) || 0,
    totalPagado: Number(totalPagado),
    fechaReserva: todayISO(),
    estado: 'confirmada'
  };
  reservations.push(reserva);
  saveReservations(reservations);
  occupySeats(vueloId, asientos);
  return reserva;
}

// Cancela una reserva confirmada y libera sus asientos.
function cancelReservation(id) {
  const reservations = getReservations();
  const reserva = reservations.find(r => r.id === id);
  if (!reserva) throw new Error('Reserva no encontrada.');
  if (reserva.estado === 'cancelada') throw new Error('Esta reserva ya fue cancelada.');
  reserva.estado = 'cancelada';
  saveReservations(reservations);
  freeSeats(reserva.vueloId, reserva.asientos);
  return reserva;
}
