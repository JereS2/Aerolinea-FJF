/* flights.js — catálogo de ciudades y CRUD de vuelos */

const CIUDADES = [
  'Santiago', 'Antofagasta', 'Concepción', 'Puerto Montt', 'La Serena',
  'Iquique', 'Miami', 'Buenos Aires', 'Lima', 'Madrid', 'Cancún', 'Ciudad de México'
];

// Devuelve la fecha actual más "days" días, en formato ISO (YYYY-MM-DD).
function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Crea vuelos de ejemplo si aún no existen en localStorage.
function seedFlights() {
  if (getData(STORAGE_KEYS.FLIGHTS)) return;
  const flights = [
    { id: 1, codigo: 'AA101', origen: 'Santiago', destino: 'Miami', fechaSalida: addDaysISO(5), horaSalida: '14:30', capacidad: 180, asientosDisponibles: 180, precio: 450000, descripcion: 'Vuelo directo Santiago - Miami, servicio de comidas incluido.' },
    { id: 2, codigo: 'LA202', origen: 'Santiago', destino: 'Buenos Aires', fechaSalida: addDaysISO(2), horaSalida: '08:15', capacidad: 150, asientosDisponibles: 150, precio: 120000, descripcion: 'Vuelo corto de cabotaje internacional.' },
    { id: 3, codigo: 'SK330', origen: 'Santiago', destino: 'Lima', fechaSalida: addDaysISO(7), horaSalida: '19:45', capacidad: 160, asientosDisponibles: 160, precio: 180000, descripcion: 'Vuelo nocturno con conexión rápida.' },
    { id: 4, codigo: 'IB450', origen: 'Santiago', destino: 'Madrid', fechaSalida: addDaysISO(10), horaSalida: '23:10', capacidad: 220, asientosDisponibles: 220, precio: 780000, descripcion: 'Vuelo de larga distancia, clase turista y ejecutiva.' },
    { id: 5, codigo: 'AM515', origen: 'Antofagasta', destino: 'Santiago', fechaSalida: addDaysISO(3), horaSalida: '07:00', capacidad: 140, asientosDisponibles: 140, precio: 65000, descripcion: 'Vuelo doméstico matutino.' },
    { id: 6, codigo: 'CM610', origen: 'Santiago', destino: 'Cancún', fechaSalida: addDaysISO(14), horaSalida: '11:20', capacidad: 190, asientosDisponibles: 190, precio: 520000, descripcion: 'Vuelo con escala en Ciudad de México.' },
    { id: 7, codigo: 'DL720', origen: 'Concepción', destino: 'Santiago', fechaSalida: addDaysISO(1), horaSalida: '18:00', capacidad: 120, asientosDisponibles: 120, precio: 55000, descripcion: 'Vuelo doméstico de baja duración.' },
    { id: 8, codigo: 'AV810', origen: 'Puerto Montt', destino: 'Santiago', fechaSalida: addDaysISO(4), horaSalida: '09:30', capacidad: 130, asientosDisponibles: 130, precio: 60000, descripcion: 'Vuelo regional con vistas a la cordillera.' }
  ];
  setData(STORAGE_KEYS.FLIGHTS, flights);
}

// Devuelve la lista de vuelos.
function getFlights() {
  return getData(STORAGE_KEYS.FLIGHTS) || [];
}

// Guarda la lista completa de vuelos.
function saveFlights(flights) {
  setData(STORAGE_KEYS.FLIGHTS, flights);
}

// Busca un vuelo por su id numérico.
function getFlightById(id) {
  return getFlights().find(f => f.id === Number(id));
}

// Crea un nuevo vuelo con id autoincremental y genera su mapa de asientos.
function addFlight(flight) {
  const flights = getFlights();
  const newId = flights.length ? Math.max(...flights.map(f => f.id)) + 1 : 1;
  const newFlight = {
    id: newId,
    codigo: flight.codigo,
    origen: flight.origen,
    destino: flight.destino,
    fechaSalida: flight.fechaSalida,
    horaSalida: flight.horaSalida,
    capacidad: Number(flight.capacidad),
    asientosDisponibles: Number(flight.capacidad),
    precio: Number(flight.precio),
    descripcion: flight.descripcion || ''
  };
  flights.push(newFlight);
  saveFlights(flights);
  generateSeatsForFlight(newFlight);
  return newFlight;
}

// Actualiza los campos de un vuelo existente (merge superficial).
function updateFlight(id, data) {
  const flights = getFlights();
  const idx = flights.findIndex(f => f.id === Number(id));
  if (idx === -1) throw new Error('Vuelo no encontrado.');
  flights[idx] = { ...flights[idx], ...data };
  saveFlights(flights);
  return flights[idx];
}

// Elimina un vuelo y su mapa de asientos asociado.
function deleteFlight(id) {
  const flights = getFlights().filter(f => f.id !== Number(id));
  saveFlights(flights);
  removeSeatsForFlight(id);
}

// Filtra vuelos por origen, destino y/o fecha (todos opcionales).
function searchFlights({ origen, destino, fecha }) {
  return getFlights().filter(f =>
    (!origen || f.origen === origen) &&
    (!destino || f.destino === destino) &&
    (!fecha || f.fechaSalida === fecha)
  );
}

// Recalcula y guarda en el vuelo la cantidad de asientos disponibles.
function syncFlightAvailableSeats(vueloId) {
  const info = getSeatsForFlight(vueloId);
  if (!info) return;
  const disponibles = info.asientos.filter(a => a.estado === 'disponible').length;
  updateFlight(vueloId, { asientosDisponibles: disponibles });
}
