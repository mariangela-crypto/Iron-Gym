# Iron Gym

## Descripción
Sistema de reservas para gimnasio desarrollado con React + Tailwind. 
Permite agendar citas con entrenadores seleccionando Día, Especialidad y Horario.

## Funcionalidades Principales
- **Reserva en 4 pasos**: Día > Especialidad > Entrenador > Horario
- **Reglas de negocio**: Atención Mar-Dom 7AM-10PM. 
- **Panel Mis Citas**: Ver y cancelar reservas activas
- **Diseño**: Dark Mode 
## Tecnologías
- React 18
- Vite
- Tailwind CSS
- SQLite

## Capturas
![Pantalla principal](./assets/gym-app.png)

## Casos de Prueba
- TC-001: Validar que no se pueda reservar los días Lunes - Pass
- TC-002: Validar que no se pueda reservar fuera de horario - Pass
- TC-003: Validar que no se haga reserva a la misma hora con el mismo entrenador- Failed
- TC-004: Validar mensaje de reserva "CANCELADA" - Pass
** Acceso a la Aplicación**
**URL:** -----
**Usuario Demo:** ----
**Contraseña:** ----

> Nota: Esta es una app demo creada con AntiGravity para fines de QA
