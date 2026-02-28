# Reglas de arquitectura del proyecto

## 1) Organización por componente (con subcomponentes)
- Si un componente tiene subcomponentes, debe existir una carpeta en **CamelCase** con el nombre del componente.
- Dentro de esa carpeta debe existir `components/` para alojar sus subcomponentes.
- Esta regla aplica de forma recursiva.

Ejemplo:

```txt
src/
  features/
    Reservations/
      components/
        ReservationCard/
          ReservationCard.tsx
          components/
            ReservationStatus/
              ReservationStatus.tsx
```

## 2) Carpetas por tipo en el nivel de uso
- Si en un nivel se usan hooks, crear `hooks/` en ese mismo nivel.
- Aplicar la misma regla para otros tipos de archivos (`services/`, `types/`, `utils/`, etc.) en el nivel donde se consumen.
- Convención de nombres para carpetas de tipo: **minúscula y plural** (`hooks`, `services`, `types`, `utils`).

Ejemplo:

```txt
ReservationCard/
  ReservationCard.tsx
  hooks/
    useReservationCard.ts
  types/
    reservation-card.types.ts
  utils/
    formatReservation.ts
  components/
    ReservationStatus/
      ReservationStatus.tsx
```

## 3) Profundidad de anidación (guía de mantenibilidad)
- Usar como guía un máximo recomendado de **3 niveles** de `components/`.
- No es una restricción rígida; si se requiere más profundidad, tomarlo como señal de refactor.

### Señales para refactor
- Coste alto para encontrar archivos.
- Subcomponentes demasiado específicos o difíciles de reutilizar.
- Dependencias excesivas entre padre e hijos.

### Estrategias de refactor
1. Subir subcomponentes a un nivel superior dentro del feature.
2. Extraer una sección a un componente de dominio propio.
3. Mover piezas reutilizables a `shared/` o `ui/`.
4. Dividir un componente contenedor grande en contenedores más pequeños.

## 4) Regla práctica
- Si una decisión aumenta claridad, navegación y encapsulación, es correcta.
- Si obliga a anidación profunda y acoplamiento, refactorizar la estructura.
