# Especificación de Requerimientos de Software (ERS)
## AERO FJF — Plataforma de Reserva de Vuelos
### Evaluación 1 — DSY1104 — Versión 1 (parcial)

## 1. Introducción

### 1.1 Propósito
Este documento describe los requerimientos funcionales y no funcionales de AERO FJF,
una plataforma web de reserva de vuelos para una aerolínea, desarrollada con HTML, CSS y
JavaScript vanilla (sin frameworks ni backend), utilizando `localStorage` como mecanismo de
persistencia de datos.

### 1.2 Alcance
El sistema permite a pasajeros buscar vuelos, seleccionar asientos, agregar equipaje, pagar de
forma simulada, generar un pase de abordar digital y administrar su historial de reservas.
Adicionalmente, ofrece un panel administrativo protegido para la gestión completa de vuelos y
la visualización de todas las reservas del sistema.

### 1.3 Actores
- **Pasajero**: usuario registrado que busca vuelos, reserva, gestiona equipaje, paga y
  administra sus propias reservas.
- **Administrador**: usuario con acceso al panel administrativo, responsable de crear, editar,
  eliminar y visualizar vuelos, así como de consultar todas las reservas.

## 2. Requerimientos funcionales

| Código | Nombre | Descripción resumida |
|---|---|---|
| RF.1 | Registro de usuario | Alta de pasajeros con nombre, correo y contraseña, persistidos en `localStorage`. |
| RF.2 | Inicio de sesión | Autenticación por correo/contraseña, diferenciando rol pasajero/administrador. |
| RF.3 | Búsqueda de vuelos | Filtro por origen, destino y fecha; resultados en tabla con acceso a selección de asientos. |
| RF.4 | Selección de asientos | Mapa interactivo con estados disponible/ocupado/seleccionado y cálculo de total. |
| RF.5 | Pago y reserva | Resumen de compra, formulario de tarjeta simulada y generación de código único `AERO-XXXXXX`. |
| RF.6 | Pase de abordar | Ticket digital con datos del vuelo, pasajero, asientos y código QR simulado, con opción de impresión. |
| RF.7 | Historial de reservas | Listado de reservas propias del pasajero autenticado, con acceso a detalle y cancelación. |
| RF.8 | Gestión de vuelos (admin) | CRUD completo de vuelos, listado paginado y vista de detalle con mapa de asientos y reservas asociadas. |
| RF.9 | Cancelación de reserva | Confirmación de cancelación, liberación automática de asientos y actualización del estado de la reserva. |
| RF.15 | Selección de equipaje | Equipaje de mano incluido y equipaje de bodega opcional con costo adicional por unidad. |

## 3. Modelo de datos (localStorage)

- **Usuarios** (`af_users`): `email`, `nombre`, `contraseña`, `rol` (`pasajero` \| `admin`), `fechaRegistro`.
- **Vuelos** (`af_flights`): `id`, `codigo`, `origen`, `destino`, `fechaSalida`, `horaSalida`, `capacidad`, `asientosDisponibles`, `precio`, `descripcion`.
- **Asientos** (`af_seats`): por vuelo, arreglo de `{ fila, columna, estado }` con estado `disponible` \| `ocupado`.
- **Reservas** (`af_reservations`): `id` (`AERO-XXXXXX`), `usuarioEmail`, `vueloId`, `asientos`, `equipajeMano`, `equipajeBodega`, `totalPagado`, `fechaReserva`, `estado` (`confirmada` \| `cancelada`).
- **Sesión** (`af_session`): correo del usuario autenticado.
- **Carrito** (`af_cart`): selección en curso (vuelo, asientos, equipaje) durante el flujo de reserva.

## 4. Requerimientos no funcionales

- **Diseño responsivo**: adaptado a escritorio, tablet y móvil mediante CSS Grid/Flexbox y media queries.
- **Usabilidad**: validación en tiempo real con mensajes de error específicos bajo cada campo, y notificaciones tipo toast para acciones exitosas o fallidas.
- **Sin backend**: toda la persistencia se resuelve en el navegador mediante `localStorage`; no existen llamadas a servidores externos.
- **Compatibilidad**: JavaScript vanilla, sin dependencias ni frameworks externos.

## 5. Reglas de validación clave

- Correo: máximo 100 caracteres, formato válido, dominios permitidos `@gmail.com`, `@duoc.cl`, `@profesor.duoc.cl`, sin duplicados en el registro.
- Contraseña: 4 a 10 caracteres.
- Tarjeta simulada: número de 16 dígitos, vencimiento `MM/AA` no vencido, CVV de 3 o 4 dígitos.
- Vuelos (admin): código mínimo 3 caracteres, fecha de salida igual o posterior a hoy, capacidad entera mínima 10, precio no negativo, descripción máximo 500 caracteres, origen y destino distintos entre sí.

## 6. Control de acceso

- Las vistas de reserva (selección de asientos, equipaje, pago, historial, cancelación, pase de abordar) requieren sesión activa de pasajero o administrador.
- El panel `admin/` requiere sesión activa con rol `admin`; cualquier otro caso redirige al login.

## 7. Estado del documento

Versión 1 — parcial, correspondiente al alcance de la Evaluación 1. Pendiente para futuras
versiones: diagramas de casos de uso, historias de usuario detalladas y especificación de
Evaluación 2 (si aplica).
