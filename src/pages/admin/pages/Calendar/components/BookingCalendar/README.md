<!--
Documentación técnica para el componente `BookingCalendar`.
Generada por un ingeniero senior frontend (React).
-->

# BookingCalendar

## 1. Descripción general

- **Propósito:** `BookingCalendar` es el componente de alto nivel que renderiza la cabecera de control del calendario y la tabla de disponibilidad/horarios para crear, ver y editar reservas (bookings).
- **Problema que resuelve:** Proporciona una UI compacta y escalable para navegar por días/semanas, filtrar por pistas y gestionar reservas en un calendario tipo grid con slots de 30 minutos.
- **Caso de uso principal:** Interfaz administrativa para ver la agenda de pistas de un club, crear reservas en huecos libres y editar o cancelar reservas existentes.

## 2. Arquitectura

Estructura relevante de la carpeta:

- `BookingCalendar.tsx` — componente raíz (renderiza `HeaderCalendar` y `TableSchedule`).
- `components/`
  - `HeaderCalendar.tsx` — controles de navegación de fecha, selector de pistas y modo (día/semana).
  - `TableSchedule/` — contenedor de la tabla de horarios:
    - `TableSchedule.tsx` — coordinación de `HeadersSchedule` y `MainSchedule`.
    - `components/HeadersSchedule/` — encabezados del grid (`MainHeader`, `HeaderCourts`).
    - `components/MainSchedule/` — cuerpo del grid (hora por hora):
      - `components/GridSchedule.tsx` — genera columnas por día y celdas por slot.
      - `components/CellsSchedule.tsx` — lógica por celda: muestra botones para crear slot o `EventCard` para reservas.
      - `components/EventCard.tsx` — representación visual de una reserva (duración, estado de pago).
      - `components/BookingDialog/BookingDialog.tsx` — diálogo que usa `BookingForm` para crear/editar reservas.
        - `components/BookingForm.tsx` — formulario completo de reserva con validación.
        - `hooks/useBookingForm.ts` — lógica del formulario (create/update/cancel).
        - `schemas/bookingForm.ts` — esquema y tipos del formulario de reserva.

- `hooks/` (local):
  - `useCalendarQueryState.ts` — sincroniza `viewMode` y `currentDate` con query params.
  - `useSelectedSlot.ts` — construye los grupos de horas y maneja selección local de slot.

- `store/`:
  - `courtsSelectedStore.ts` — `zustand` para pistas seleccionadas globalmente en este subárbol.

Responsabilidades:
- `HeaderCalendar` — control de estado de navegación (fecha, modo), popover de calendario y selección de pistas.
- `TableSchedule` — recibe `weekDates` según `viewMode` y `currentDate` y monta headers + cuerpo.
- `CellsSchedule` — es el punto donde se cargan bookings y courts y decide si mostrar slot vacío, botón de creación o `EventCard`.

Relación entre piezas:
- `HeaderCalendar` actualiza estado (query state + `courtsSelectedStore`). `TableSchedule` lee `useCurrentDayQueryState` y `useViewModeQueryState` para construir `weekDates`.
- `CellsSchedule` consulta `useBookings` y `useCourts` (server-side/query hooks) y usa el `courtsSelectedStore` para filtrar columnas.
- El `BookingDialog` usa `useBookingForm` para las mutaciones (create/update) y para preparar valores por defecto.

## 3. API / Props

El wrapper `BookingCalendar` no recibe props.

Componentes internos y sus props principales:

| Componente | Props | Tipo | Descripción | Por defecto |
|---|---:|---|---|---:|
| `HeaderCalendar` | — | — | Componente sin props (usa query state y stores) | — |
| `TableSchedule` | `weekDates` | `Date[]` | Días a renderizar (1 para `day`, 7 para `week`) | — |
| `HeadersSchedule` | `weekDates` | `Date[]` | Cabeceras por día | — |
| `MainHeader` | `weekDates` | `Date[]` | Encabezado principal con nombres de día | — |
| `HeaderCourts` | `weekDates` | `Date[]` | Renderiza nombres de pistas por día | — |
| `MainSchedule` | `weekDates` | `Date[]` | Renderiza filas de horas y delega a `GridSchedule` | — |
| `GridSchedule` | `times: number[]`, `weekDates: Date[]` | `number[]`, `Date[]` | Crea la cuadrícula por día y tiempos | — |
| `CellsSchedule` | `dayIndex: number`, `time: number`, `weekDates: Date[]` | `number`, `number`, `Date[]` | Lógica por celda; abre `BookingDialog` | — |
| `BookingDialog` | `isOpen`, `onOpenChange`, `slot`, `clubId`, `booking` | `boolean`, `(b:boolean)=>void`, `BookingSlot|null`, `string`, `Booking|null` | Modal que contiene `BookingForm` | — |
| `BookingForm` | `slot`, `clubId`, `onClose`, `booking` | `BookingSlot|null`, `string`, `()=>void`, `Booking|null` | Formulario y gestión de mutaciones | — |

> Nota: muchos componentes obtienen datos y estado vía hooks (query state, zustand, queries), por lo que su API pública es mínima.

## 4. Estado y lógica interna

- `useState`: 
  - `HeaderCalendar` → `isPopoverOpen: boolean` para el popover del calendario.
  - `CellsSchedule` → `isBookingDialogOpen`, `selectedSlot`, `selectedBooking` (control modal y selección local).
  - `useBookingForm` → `showPayments` para gestionar la sección de pagos.

- `useReducer`: No se usa en este subárbol.

- `useContext`: No se usa directamente; la comunicación global se hace con `zustand` y query params.

- Hooks personalizados importantes:
  - `useViewModeQueryState` (nuqs/useQueryState): sincroniza `viewMode` ("week" | "day") con query string y detecta mobile por `useIsMobile`.
  - `useCurrentDayQueryState` (nuqs/useQueryState): sincroniza `date` (ISO) con query string.
  - `useSelectedSlot`: genera `hourGroups` (mapa hora → slots de 30 min entre 8 y 24), y control de selección local de slot.
  - `useBookingForm`: encapsula lógica del formulario: resolver (zod), default values, crear/actualizar/cancelar booking usando `useBookingsMutation`, parseo de `note` para pagos y participantes.
  - `useCourtsStore` (zustand): store global local para pistas seleccionadas `courtsSelected` y setter.

## 5. Flujo de datos

- Entrada de datos:
  - Usuario interactúa con `HeaderCalendar` (cambia `viewMode`, `currentDate` o pistas seleccionadas).
  - `HeaderCalendar` actualiza query params (`useQueryState`) y `courtsSelectedStore`.
  - `CellsSchedule` consulta `useBookings(user.clubId)` y `useCourts(user.clubId)` (queries remotas).

- Transformaciones:
  - `TableSchedule` calcula `weekDates` según `viewMode` y `currentDate`.
  - `useSelectedSlot` construye `hourGroups` con slots (30 min) agrupados por hora.
  - `CellsSchedule` filtra bookings no-cancelados, convierte timestamps a `Date` y determina si hay evento que empieza en la celda (`isEventStart`) o si la celda está dentro de un evento (`betweenDates`).
  - `useBookingForm` prepara valores por defecto, serializa `note` con pagos y ejecuta las mutaciones (create/update) con `BookingsInsert`/`BookingsUpdate`.

- Renderizado:
  - `HeadersSchedule` pinta columnas según `weekDates` y pistas seleccionadas.
  - `MainSchedule` mapea cada `hour` y renderiza `GridSchedule` por día.
  - `CellsSchedule` decide: mostrar botón para crear (slot libre con `Button`), mostrar `EventCard` si evento empieza en ese slot, o espacio vacío si la celda está dentro de un evento más largo.

## 6. Subcomponentes (responsabilidad resumida)

- `HeaderCalendar` — Interfaz de navegación:
  - Cambia fecha (`currentDate`) y `viewMode` (día/semana).
  - Abre `CalendarPicker` en un popover para seleccionar fecha.
  - Controla selección de pistas vía `MultiSelect` y sincroniza `useCourtsStore`.

- `TableSchedule` — Layout principal: coloca encabezados y cuerpo con scroll.

- `MainHeader` — Renderiza días con nombre y fecha (resalta hoy).

- `HeaderCourts` — Renderiza nombres de pistas por columna; usa `useCourts` y filtra por `courtsSelected`.

- `MainSchedule` — Crea filas por hora y delega creación de celdas a `GridSchedule`.

- `GridSchedule` — Para cada día genera las celdas correspondientes a `times` (array de minutos desde 00:00).

- `CellsSchedule` — Lógica central de interacción (leer bookings, mostrar botones o `EventCard`, abrir `BookingDialog`).

- `EventCard` — Tarjeta visual que representa una reserva; calcula altura según duración y muestra estado de pago.

- `BookingDialog` — Modal wrapper; formatea fecha y monta `BookingForm`.

- `BookingForm` — Formulario con `react-hook-form` y validación `zod`; gestiona pagos opcionales, participantes y llamadas a `createBooking/updateBooking`.

## 7. Dependencias externas

- React y sus hooks (`useState`, `useEffect`, `useMemo`, etc.).
- date-fns: formateo y cálculo de fechas (`format`, `startOfWeek`, `addMinutes`, `isWithinInterval`, etc.).
- lucide-react: iconos (`CalendarDays`, `ChevronLeft`, `ChevronRight`, `Clock`).
- react-hook-form y @hookform/resolvers/zod: formularios y validación.
- zod: esquemas de validación (usado indirectamente en `bookingFormSchema`).
- zustand: store (`useCourtsStore`).
- nuqs (`useQueryState`): sincronización de estado con query string.
- Queries/mutations hooks propios: `useBookings`, `useBookingsMutation`, `useCourts`, `useCourtsQuery`, basados en react-query o similar.
- Componentes UI locales: `Button`, `Card`, `Dialog`, `Select`, `MultiSelect`, `Popover`, `Form`, `Field` — provistos por `src/components/ui`.

## 8. Ejemplos de uso

### Ejemplo básico

```tsx
import { BookingCalendar } from "./components/BookingCalendar/BookingCalendar"

export default function AdminCalendarPage() {
  return (
    <div className="p-4">
      <BookingCalendar />
    </div>
  )
}
```

### Ejemplo avanzado

Si se desea controlar el estado externomente (por ejemplo forzar una fecha concreta en la URL):

1. Cambiar la query string `date` y `viewMode` (se sincroniza automáticamente via `useQueryState`).
2. Controlar `courtsSelected` escribiendo en el `useCourtsStore` desde otro componente (por ejemplo, un panel lateral de filtros).

```ts
import { useCourtsStore } from "./store/courtsSelectedStore"

// Forzar selección de pistas
const setSelected = useCourtsStore(state => state.setCourtsSelected)
setSelected(["court-1-id", "court-2-id"]) // actualizará el Header y Grid
```

## 9. Diagrama de arquitectura (texto)

```bash
BookingCalendar
├─ HeaderCalendar (fecha, viewMode, filtros)
└─ TableSchedule
   ├─ HeadersSchedule
   │  ├─ MainHeader (día, fecha)
   │  └─ HeaderCourts (nombres pistas)
   └─ MainSchedule
      └─ GridSchedule (por día)
         └─ CellsSchedule (por slot)
            ├─ EventCard (si hay booking en inicio)
            └─ BookingDialog/BookingDialog -> BookingForm (crear/editar)
````

## 10. Buenas prácticas y notas para mantenimiento

- Centralizar queries: `CellsSchedule` pide todas las bookings y luego filtra; si la base de datos crece, considerar endpoints por semana/día para evitar procesar grandes arrays en cliente.
- Memoización: `CellsSchedule` ya usa `useMemo` para transformar bookings; considerar paginar o limitar la carga en `useBookings`.
- Altura y accesibilidad: `EventCard` calcula altura con minutos; asegúrate de pruebas visuales en pantallas pequeñas y ARIA en botones.
- Coordinación de IDs: `HeaderCourts` y `CellsSchedule` dependen de que `courtsSelected` y la API de `useCourts` usen los mismos `id` strings.
- Validación/serialización: `useBookingForm` serializa información del cliente en `note` como JSON; documentar este contrato para evitar incompatibilidades con otras partes del sistema.
- Tests: añadir pruebas unitarias para:
  - generación de `hourGroups` en `useSelectedSlot`.
  - transformaciones de `useBookingForm` (valores por defecto, parseo de `note`).
  - renderizado condicional de `CellsSchedule` (botón vs EventCard).
- Rendimiento: si la cuadrícula crece, virtualizar filas/columnas o limitar el `minWidth`/`grid` dinámico para evitar reflows costosos.
