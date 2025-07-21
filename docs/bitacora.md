# Bitácora del proyecto.
---
***HU Realizadas:*** 01 - 02 - 03 - 04 - 05 - 06 - 07 - 08 - 13 - 20 - 21 - 22 - 23
---
## 16/07/2025

### Objetivo: 
  * Establecer la base del sistema con autenticación segura, control de acceso por roles y gestión inicial de usuarios. Incluir la creación automática del Superadmin, login con JWT, protección de rutas por roles, y ABM de usuarios (recepcionistas y veterinarios), junto con herramientas de infraestructura como manejo de variables de entorno, validaciones de DTOs, y estructura de respuestas y errores.

#### Historias de usuario resueltas:
  * HU-01: Creación automática del Superadmin
  * HU-02: Iniciar sesión como Superadmin
  * HU-03: ABM de Recepcionistas y Veterinarios
  * HU-04: Superadmin puede reestablecer contraseñas.

#### Historial de tareas:
* Definí la narrativa inicial del proyecto.
* Definí las historias de usuarios para el MVP.
* Inicié el repositorio del proyecto.
* Configuré la estructura inicial del proyecto.
* Implementé ConfigModule de @nest/Config para el manejo de variables de entorno.
* Implementé Prisma como ORM, y mysql como motor de base de datos.
* Implementé class-validator y class-transformer para el correcto uso de los dtos.
* Creación del módulo User.
* Creación del Superadmin por defecto.
* Implementé JWT y Hasheo de passwords.
* Implementé RoleGuard para proteger rutas por roles.
* Implementé login y registro de usuarios. El superadmin sólo puede crear usuarios.
---

## 17/07/2025

#### Historial de tareas:
* Moví el registro de usuarios a el módulo users.
* Modifiqué la búsqueda de users, ahora se puede buscar por email, nombre y rol.
* Creé un mapper para mapear User a UserResponse
* Implementé un decorator que extrae el id del usuario autenticado.
* Implementé un endpoint para que el usuario autenticado modifique su nombre, e email.
* Implementé un endpoint para que el usuario autenticado modifique su contraseña.
* Implementé un endpoint para que el superadmin pueda modificar la información del resto de los usuarios.
* Agregué un campo de password por defecto al .env y la configuración global para solicitar el reset de password automático, sólo accesible al superadmin.
* Implementé un sistema de loggin para las peticiones con un interceptor.
* Implementé un sistema para envolver las respuestas exitosas. Utiliza un interceptor.
* Implementé un filtro para capturar las excepciones, y devolver un objeto con mejor información.

**Finalicé las 4 tareas**
---

## 18/07/2025

### 🎯Objetivo:
  * Dejar implementadas las funcionalidades básicas para el manejo de dueños y mascotas, incluyendo ABM y búsquedas, de modo que luego pueda asociarlos fácilmente a turnos y consultas.

#### Historias de usuario resueltas:
  * HU-05: Registrar nuevos dueños.
  * HU-06: Editar info de dueños.
  * HU-07: Registrar mascotas asociadas a un dueño.
  * HU-08: Editar mascotas.
  * HU-13: Buscar dueños y mascotas por nombre o teléfono.

#### Historial de tareas
* Eliminé historias de usuario reduntantes (HU-05 y HU-14)
* Agregué HU-18 como opcional.
* Dividí HU-9 en HU-9 y HU-10
* Creé el modelo de Owner en bd.
* Creé modulo, servicio y controller de owner.
* Creé el dto para la creación de owner.
* Implementé la creación de Owner, validando de que no se repita el teléfono ni el dni.
* Implementé owner.response.ts y su respectivo mapper.
* Arreglé el guard de roles que estaba mal implementado 🤣
* Agregué el modelo de Pet a prisma.
* Creé el módulo completo de Pet: servicio, controller, dto.
* Creé un pet.mapper.ts
* Implementé el partial update de Pet.
* Implementé paginación
* Implementé la búsqueda dinámica por parámetros.

**Finalicé las 3 tareas**
---

## 19/07/2025

#### Historias de usuario resueltas:
* HU-20: Inicializar schedule.
* HU-21: Obtener schedule con su config.
* HU-22: Actualizar Schedule.
* HU-23: Gestión de servicios veterinarios.

#### Historial de tareas.
* Implementé los modelos scheduleConfig, y scheduleConfigDay en prisma.
* Creé modulo de schedule.
* Actualicé Historias de usuario.
* Implementé getScheduleConfig
* Implementé UpdateScheduleConfig, con sus validaciones.
* Completé el crud de pet
* Agregué la eliminación de owner.
* Implementé Clinical Service en prisma.
* Creé módulo de servicios clínicos.
* Implementé createClinicalService, getClinicalService, updateClinicalService.
* Implementé una seed de servicios veterinarios.
---

## 21/07/2025

#### Historias de usuario:
* HU-09: Crear turnos para mascotas con veterinarios específicos
* HU-11: Reprogramar turno
* HU-12: Ver lista de turnos del día


#### Historias de tareas.
* Implementé deleteClinicalService.
* Modifiqué las Historias de usuario 🥴
* Implementé model de appointment en prisma.
* Implementé modulo de appointments
* Implementé la creación de turnos con sus validaciones.
* Creé appointment response y su mapper.
* Implementé endpoint getAppointmentsByDate
* Implementé endpoint de reprogramar turno.

