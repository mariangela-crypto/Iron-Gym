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

## Casos de Prueba
- TC-001: Validar que no se pueda reservar los días Lunes - Pass
- <img width="1462" height="346" alt="TC-001-sin-reservas-lunes" src="https://github.com/user-attachments/assets/b4460b7a-81f0-4fbc-b9b6-6ac32ac84b88" />

- TC-002: Validar que no se pueda reservar antes de horario - Pass
- <img width="982" height="617" alt="TC-002-antes-de-hora" src="https://github.com/user-attachments/assets/a2baf3dd-f843-4ab2-9a40-8304b444f8fa" />

- TC-003: Validar que no se haga reserva a la misma hora con el mismo entrenador- Failed
- <img width="1022" height="777" alt="TC-003-reservas-misma-hora" src="https://github.com/user-attachments/assets/1b38b01f-5e91-4705-b57a-46996e9de3e9" />

- TC-004: Validar mensaje de reserva "CANCELADA" - Pass
- <img width="997" height="432" alt="TC-004-msj-cancelada" src="https://github.com/user-attachments/assets/844a11e2-1807-4909-af0f-88ce8e5f20db" />



> Nota: Esta es una app demo creada con AntiGravity para fines de QA
