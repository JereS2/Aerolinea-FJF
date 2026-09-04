/* seats.js — mapa de asientos por vuelo */

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Descompone un código de asiento (ej: "12A") en fila y columna.
function parseSeatCode(codigo) {
  const match = String(codigo).match(/^(\d+)([A-Z])$/);
  return match ? { fila: Number(match[1]), columna: match[2] } : null;
}

// Arma el código de asiento (ej: "12A") a partir de fila y columna.
function seatCode(seat) {
  return `${seat.fila}${seat.columna}`;
}

// Genera y guarda el mapa de asientos de un vuelo según su capacidad;
// si ocuparAlAzar es true, ocupa aleatoriamente ~18% de los asientos.
function generateSeatsForFlight(flight, ocuparAlAzar = false) {
  const asientos = [];
  let count = 0;
  let fila = 1;
  while (count < flight.capacidad) {
    for (let c = 0; c < SEAT_COLUMNS.length && count < flight.capacidad; c++) {
      const ocupado = ocuparAlAzar && Math.random() < 0.18;
      asientos.push({ fila, columna: SEAT_COLUMNS[c], estado: ocupado ? 'ocupado' : 'disponible' });
      count++;
    }
    fila++;
  }
  const allSeats = getData(STORAGE_KEYS.SEATS) || [];
  allSeats.push({ vueloId: flight.id, asientos });
  setData(STORAGE_KEYS.SEATS, allSeats);
}

// Genera el mapa de asientos para cada vuelo que aún no lo tenga.
function seedSeats() {
  if (!getData(STORAGE_KEYS.SEATS)) {
    setData(STORAGE_KEYS.SEATS, []);
  }
  const flights = getFlights();
  flights.forEach(f => {
    const allSeats = getData(STORAGE_KEYS.SEATS) || [];
    if (!allSeats.find(s => s.vueloId === f.id)) {
      generateSeatsForFlight(f, true);
      syncFlightAvailableSeats(f.id);
    }
  });
}

// Devuelve el registro de asientos { vueloId, asientos } de un vuelo.
function getSeatsForFlight(vueloId) {
  const allSeats = getData(STORAGE_KEYS.SEATS) || [];
  return allSeats.find(s => s.vueloId === Number(vueloId));
}

// Guarda (o crea) el arreglo de asientos de un vuelo.
function setSeatsForFlight(vueloId, asientos) {
  const allSeats = getData(STORAGE_KEYS.SEATS) || [];
  const idx = allSeats.findIndex(s => s.vueloId === Number(vueloId));
  if (idx === -1) allSeats.push({ vueloId: Number(vueloId), asientos });
  else allSeats[idx].asientos = asientos;
  setData(STORAGE_KEYS.SEATS, allSeats);
}

// Marca como "ocupado" los asientos indicados (por código) de un vuelo.
function occupySeats(vueloId, codigos) {
  const info = getSeatsForFlight(vueloId);
  if (!info) return;
  codigos.forEach(codigo => {
    const parsed = parseSeatCode(codigo);
    const seat = info.asientos.find(a => a.fila === parsed.fila && a.columna === parsed.columna);
    if (seat) seat.estado = 'ocupado';
  });
  setSeatsForFlight(vueloId, info.asientos);
  syncFlightAvailableSeats(vueloId);
}

// Marca como "disponible" los asientos indicados (por código) de un vuelo.
function freeSeats(vueloId, codigos) {
  const info = getSeatsForFlight(vueloId);
  if (!info) return;
  codigos.forEach(codigo => {
    const parsed = parseSeatCode(codigo);
    const seat = info.asientos.find(a => a.fila === parsed.fila && a.columna === parsed.columna);
    if (seat) seat.estado = 'disponible';
  });
  setSeatsForFlight(vueloId, info.asientos);
  syncFlightAvailableSeats(vueloId);
}

// Elimina el registro de asientos de un vuelo (al borrarlo).
function removeSeatsForFlight(vueloId) {
  const allSeats = (getData(STORAGE_KEYS.SEATS) || []).filter(s => s.vueloId !== Number(vueloId));
  setData(STORAGE_KEYS.SEATS, allSeats);
}
