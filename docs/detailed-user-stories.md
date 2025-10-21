# 🐾 SaluVet MVP

## Historias de usuario detalladas

### Índice

#### 📋 Navegación Rápida

**👦🏻 General**
- [HU-G-01: Iniciar sesión en el sistema](#hu-g-01-iniciar-sesión-en-el-sistema)
- [HU-G-02: Consulta del Catálogo de Servicios Clínicos](#hu-g-02-consulta-del-catálogo-de-servicios-clínicos)

**👑 Superadmin**
- [HU-SA-01: Crear usuarios del sistema](#hu-sa-01-crear-usuarios-del-sistema)
- [HU-SA-02: Actualizar un usuario](#hu-sa-02-actualizar-un-usuario)
- [HU-SA-03: Listado y Búsqueda de Personal](#hu-sa-03-listado-y-búsqueda-de-personal)
- [HU-SA-04: Desactivar/Activar a un usuario](#hu-sa-04-desactivaractivar-a-un-usuario)
- [HU-SA-05: Restaurar contraseña de usuario](#hu-sa-05-restaurar-contraseña-de-usuario)
- [HU-SA-06: Creación de Servicios Clínicos](#hu-sa-06-creación-de-servicios-clínicos)
- [HU-SA-07: Edición de Servicios Clínicos](#hu-sa-07-edición-de-servicios-clínicos)
- [HU-SA-08: Activar/desactivar servicio asociado a veterinario](#hu-sa-08-activardesactivar-servicio-asociado-a-veterinario)

**📅 Recepcionista**
- [HU-R-01: Registrar nuevo dueño](#hu-r-01-registrar-nuevo-dueño)
- [HU-R-02: Actualizar dueño existente](#hu-r-02-actualizar-dueño-existente)
- [HU-R-03: Registrar nueva mascota](#hu-r-03-registrar-nueva-mascota)
- [HU-R-04: Actualizar datos de la mascota](#hu-r-04-actualizar-datos-de-la-mascota)
- [HU-R-05: Buscar dueños y sus mascotas](#hu-r-05-buscar-dueños-y-sus-mascotas)
- [HU-R-06: Crear turno para mascota](#hu-r-06-crear-turno-para-mascota)
- [HU-R-07: Reprogramar un turno](#hu-r-07-reprogramar-un-turno)
- [HU-R-08: Actualizar estado de un turno](#hu-r-08-actualizar-estado-de-un-turno)
- [HU-R-09: Listar turnos del día por fecha](#hu-r-09-listar-turnos-del-día-por-fecha)
- [HU-R-10: Ver historial de turnos de una mascota](#hu-r-10-ver-historial-de-turnos-de-una-mascota)

**👨‍⚕️ Veterinario**
- [HU-V-01: Listar turnos del día del veterinario](#hu-v-01-listar-turnos-del-día-del-veterinario)
- [HU-V-02: Registrar historial médico de una mascota](#hu-v-02-registrar-historial-médico-de-una-mascota)
- [HU-V-03: Editar historial médico de una mascota](#hu-v-03-editar-historial-médico-de-una-mascota)
- [HU-V-04: Registrar vacuna aplicada a una mascota](#hu-v-04-registrar-vacuna-aplicada-a-una-mascota)
- [HU-V-05: Actualizar vacuna registrada](#hu-v-05-actualizar-vacuna-registrada)
- [HU-V-06: Eliminar una vacuna](#hu-v-06-eliminar-una-vacuna)
- [HU-V-07: Ver agenda semanal del veterinario](#hu-v-07-ver-agenda-semanal-del-veterinario)
- [HU-V-08: Modificar horarios de agenda del veterinario](#hu-v-08-modificar-horarios-de-agenda-del-veterinario)

---

## 👦🏻 General

#### HU-G-01: Iniciar sesión en el sistema

**ID:** `HU-G-01`  
**Título:** _[Iniciar sesión en el sistema]_  
**Rol:** _[No requiere]_

### 📝 Descripción

Como usuario registrado, quiero poder iniciar sesión en el sistema, para acceder a mis funciones autorizadas.

### 🔧 Detalles Técnicos

- **Método:** `POST`
- **Ruta:** `/api/v1/auth/login`
- **Roles Permitidos:** `[No requiere]`

### ✅ Criterios de Aceptación

- **CA-01:** El usuario registrado puede autenticarse usando su email y contraseña.
- **CA-02:** Si las credenciales son válidas, el sistema devuelve un JWT válido.
- **CA-03:** El JWT contiene el role, email y el userId como payload.
- **CA-04:** Si las credenciales son inválidas, devuelve error 401 Unauthorized.
- **CA-05:** Solo los usuarios activos pueden loguearse.
- **CA-06:** La contraseña debe ser verificada con hashing (bcrypt.compare).

### 📦 DTO de Entrada (`LoginDto`)

| Campo      | Tipo     | Requerido | Descripción                   |
| :--------- | :------- | :-------- | :---------------------------- |
| `email`    | `string` | Sí        | Email del usuario registrado. |
| `password` | `string` | Sí        | Contraseña sin hashear.       |

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "accessToken": "acá iría el token"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T20:00:50.399Z"
}
```
---
#### HU-G-02: Consulta del Catálogo de Servicios Clínicos

**ID:** `HU-G-02`  
**Título:** _[Consulta del Catálogo de Servicios Clínicos]_  
**Rol:** _[No requiere]_

### 📝 Descripción

Como cualquier usuario, quiero consultar la lista de servicios activos para usarlos en la gestión de turnos o registros médicos.

### 🔧 Detalles Técnicos

- **Método:** `GET`
- **Ruta:** `/api/v1/clinical-services`
- **Roles Permitidos:** `[No requiere]`

### ✅ Criterios de Aceptación

- **CA-01:** Por defecto, solo se listan los servicios que están activos (isActive: true).
- **CA-02:** La respuesta debe incluir el id, name, price, duration y description.
- **CA-03:** La lista debe ser accesible para todos.
- **CA-04:** Implementar paginación (futuro)

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": [
    {
      "id": "03bda783-82d1-4f73-be2a-514cff13d036",
      "name": "Castración macho",
      "description": "Procedimiento quirúrgico de esterilización para machos.",
      "price": 4500,
      "duration": 60,
      "isActive": true
    }
  ],
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T22:18:10.753Z"
}
```

---
## 👑 Superadmin

#### HU-SA-01: Crear usuarios del sistema

**ID:** `HU-SA-01`  
**Título:** _[Crear usuarios del sistema]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero registrar nuevos usuarios con roles Recepcionista o Veterinario, para incorporar nuevo personal al sistema.

### 🔧 Detalles Técnicos

- **Método:** `POST`
- **Ruta:** `/api/v1/users/superadmin/register`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** El sistema requiere name, email, password y role (Recepcionista o Veterinario).
- **CA-02:** La password se almacena hasheada.
- **CA-03:** Si el role es Superadmin se debe lanzar un ConflictException.
- **CA-04:** Se debe validar que el email sea único en el sistema (error 400 Bad Request si ya existe).
- **CA-05:** El usuario se crea por defecto con isActive: true.
- **CA-06:** Si el rol creado es Veterinario, se debe activar la Inicialización Automática de Agenda y Servicios veterinarios.
- **CA-07:** La contraseña debe ser verificada con hashing (bcrypt.compare).

### 📦 DTO de Entrada (`RegisterDto`)

| Campo      | Tipo     | Requerido | Descripción                   |
| :--------- | :------- | :-------- | :---------------------------- |
| `email`    | `string` | Sí        | Email del usuario registrado. |
| `password` | `string` | Sí        | Contraseña sin hashear.       |
| `name` | `string` | Sí        | Nombre y apellido de la persona       |
| `role` | `EUserRole` | Sí        | Veterinario o Recepcionista.       |

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "e46f1b20-1025-45cb-b680-2a470b8e9aa8",
    "name": "Juan Perez",
    "email": "juanperez@gmail.com",
    "role": "RECEPCIONISTA",
    "isActive": true
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T20:20:14.165Z"
}
```

---
#### HU-SA-02: Actualizar un usuario

**ID:** `HU-SA-02`  
**Título:** _[Actualizar un usuario]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero modificar los datos personales (name, email, role) de un usuario existente, para mantener la información del personal actualizada.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/users/superadmin/update-user/{id}`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** El sistema requiere name, email (Recepcionista o Veterinario) por body, e id del usuario por parámetro.
- **CA-02:** Si el usuario no existe se lanza NotFoundException 404.
- **CA-04:** Se debe validar que el email sea único en el sistema (error 400 Bad Request si ya existe).
- **CA-05:** El usuario se crea por defecto con isActive: true.

### 📦 DTO de Entrada (`UserForUpdateDto`)

| Campo      | Tipo     | Requerido | Descripción                   |
| :--------- | :------- | :-------- | :---------------------------- |
| `email`    | `string` | No        | Email del usuario registrado. |
| `name` | `string` | No       | Nombre y apellido de la persona       |

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "e46f1b20-1025-45cb-b680-2a470b8e9aa8",
    "name": "John Doe",
    "email": "example@example.com",
    "role": "RECEPCIONISTA",
    "isActive": true
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T20:31:33.065Z"
}
```
---
#### HU-SA-03: Listado y Búsqueda de Personal

**ID:** `HU-SA-03`  
**Título:** _[Listado y Búsqueda de Personal]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero consultar la lista de todo el personal (R y V), con capacidad de filtrar y paginar, para tener una visión general del equipo.

### 🔧 Detalles Técnicos

- **Método:** `GET`
- **Ruta:** `/api/v1/users`
- **Roles Permitidos:** `[Superadmin, Veterinario]`

### ✅ Criterios de Aceptación

- **CA-01:** El sistema debe permitir filtrar usuarios exactamente por el campo role.
- **CA-02:** El sistema debe permitir la búsqueda parcial (usando contains) por los campos email y name
- **CA-03:** La respuesta (UserResponse) no debe incluir campos sensibles, como el password hasheado.
- **CA-04:** Devuelve un código 200 OK y una lista (que puede estar vacía) de usuarios si los filtros son válidos.
- **CA-05:** Debe implementar validación (futuro).

### 📦 DTO de Entrada (`GetUsersQueryDto`)

| Campo      | Tipo     | Requerido | Descripción                     |
| :--------- | :------- | :-------- | :----------------------------   |
| `role`    | `string`  | No        | Filtro exacto por rol (Recepcionista o Veterinario).  |
| `email`   | `string`  | No        | Búsqueda parcial por email. |
| `name`    | `string`  | No        | Búsqueda parcial por nombre. |

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": [
    {
      "id": "11f59da8-d838-4c30-b59d-528f0409ece6",
      "name": "superadmin",
      "email": "superadmin@saluvet.com",
      "role": "SUPERADMIN",
      "isActive": true
    },
    {
      "id": "e46f1b20-1025-45cb-b680-2a470b8e9aa8",
      "name": "John Doe",
      "email": "example@example.com",
      "role": "RECEPCIONISTA",
      "isActive": true
    }
  ],
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T20:41:10.538Z"
}
```
---
#### HU-SA-04: Desactivar/Activar a un usuario

**ID:** `HU-SA-04`  
**Título:** _[Desactivar/Activar a un usuario]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero cambiar el estado de un usuario a inactivo o visceversa, para revocar o restaurar su acceso, sin eliminar su historial.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/users/superadmin/toggle-active/{id}`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** El endpoint requiere el id del usuario. Si no existe, devuelve 404 Not Found.
- **CA-02:** Al llamar a la ruta, el campo isActive del usuario debe cambiar a false y visceversa.
- **CA-03:** Un usuario inactivo no puede iniciar sesión (Validado por HU-G-01 y CA-05).
- **CA-04:** No se debe permitir desactivar al Superadmin actual.
- **CA-05:** Debe implementar validación (futuro).


### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "e46f1b20-1025-45cb-b680-2a470b8e9aa8",
    "name": "John Doe",
    "email": "example@example.com",
    "role": "RECEPCIONISTA",
    "isActive": false
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T20:49:14.653Z"
}
```
---
#### HU-SA-05: Restaurar contraseña de usuario

**ID:** `HU-SA-05`  
**Título:** _[Restaurar contraseña de usuario]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero poder resetear la contraseña de un usuario, para asistir en casos de bloqueo o pérdida.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/users/superadmin/reset-password-by-default/{id}`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** El endpoint requiere el id del usuario. Si no existe, devuelve 404 Not Found.
- **CA-02:** Se debe obtener la contraseña generica definida en .env. En caso de no existir se retorna InternalServerError
- **CA-03:** La contraseña debe ser hasheada.


### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "e46f1b20-1025-45cb-b680-2a470b8e9aa8",
    "name": "John Doe",
    "email": "example@example.com",
    "role": "RECEPCIONISTA",
    "isActive": false
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T21:08:10.807Z"
}
```
---
#### HU-SA-06: Creación de Servicios Clínicos

**ID:** `HU-SA-06`  
**Título:** _[Creación de Servicios Clínicos]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero registrar nuevos servicios que ofrece la clínica, para ampliar el catálogo.

### 🔧 Detalles Técnicos

- **Método:** `POST`
- **Ruta:** `/api/v1/clinical-services`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** Se requiere un name, descripción, price, duration e isActive.
- **CA-02:** El nombre debe ser único, si existe se debe lanzar BadRequestException
- **CA-03:** Además, se debe relacionar con todos los usuarios activos existentes.

### 📦 DTO de Entrada (`ClinicalServiceForCreationDto`)

| Campo        | Tipo     | Requerido | Descripción                      |
| :---------   | :------- | :-------- | :--------------------------------|
| `name`       | `string` | Si        | Nombre del servicio (único)      |
| `descripcion`| `string` | Si        | descripción del servicio.        |
| `price`      | `number` | Si        | Valor del serivicio              |
| `duration`   | `number` | Si        | Duración del serivicio en minutos|
| `isActive`   | `boolean`| Si        | Estado del servicio.             |


### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "5603e0c2-2e7d-4ea4-9ebc-fe3e1363eed1",
    "name": "Consulta de rutina",
    "description": "Consulta de rutina",
    "price": 1000,
    "duration": 30,
    "isActive": true
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T21:29:59.596Z"
}
```
---
#### HU-SA-07: Edición de Servicios Clínicos

**ID:** `HU-SA-07`  
**Título:** _[Edición de Servicios Clínicos]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero modificar el nombre o la descripción de un servicio existente, para actualizar la información del catálogo.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/clinical-services/{id}`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo ser accesible para usuarios con el rol Superadmin (Verificado: @UseGuards(..., RolesGuard) @Roles(EUserRole.SUPERADMIN)).
- **CA-02:** Si el servicio con el :id proporcionado no existe, se devuelve una excepción 400 Bad Request con el mensaje "El servicio no existe".
- **CA-03:** Se permite enviar uno, varios o todos los campos del DTO para su actualización.
- **CA-03:** Si se incluye el campo name, el sistema valida que el nuevo nombre sea único entre todos los servicios excepto el que se está editando (existsByName.id !== id). Si el nombre está en uso, se devuelve 400 Bad Request con el mensaje "El nombre del servicio no está disponible".
- **CA-03:** En caso de éxito, se devuelve el objeto actualizado (ClinicalServiceResponse) con un código 200 OK.

### 📦 DTO de Entrada (`ClinicalServiceForUpdateDto`)

| Campo        | Tipo     | Requerido | Descripción                      |
| :---------   | :------- | :-------- | :--------------------------------|
| `name`       | `string` | No        | Nombre del servicio (único)      |
| `descripcion`| `string` | No        | descripción del servicio.        |
| `price`      | `number` | No        | Valor del serivicio              |
| `duration`   | `number` | No        | Duración del serivicio en minutos|
| `isActive`   | `boolean`| No        | Estado del servicio.             |


### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "7b1adab0-5553-4d21-9060-074547cfb230",
    "name": "Consulta de rutina II",
    "description": "Consulta de rutina II",
    "price": 1000,
    "duration": 30,
    "isActive": true
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T21:40:39.203Z"
}
```
---
#### HU-SA-08: Activar/desactivar servicio asociado a veterinario

**ID:** `HU-SA-08`  
**Título:** _[Activar/desactivar servicio asociado a veterinario]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero habilitar (activar) o deshabilitar (desactivar) un servicio clínico que ya está asociado a un veterinario, para controlar qué servicios puede ofrecer dicho profesional sin eliminar la asociación histórica.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/clinical-services/toggle-user-clinical-service`
- **Roles Permitidos:** `[Superadmin]`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo ser accesible para usuarios con el rol Superadmin.
- **CA-02:** El sistema debe buscar la relación (UserClinicalService) entre el userId y el clinicalServiceId en la base de datos.
- **CA-03:** Si la relación no existe (el veterinario nunca ha tenido asignado ese servicio), se devuelve una excepción 400 Bad Request con el mensaje "El veterinario no tiene habilitado este servicio".
- **CA-04:** Si la relación existe, el campo isActive se invierte: si era true pasa a ser false, y viceversa.
- **CA-05:** En caso de éxito, se devuelve el objeto actualizado (ClinicalServiceResponse) con un código 200 OK. (futuro)

### 📦 DTO de Entrada (`Query Parameters`)

| Campo              | Tipo           | Requerido | Descripción    |
| :---------         | :-------       | :-------- | :------------- |
| `userId`           | `string`       | Si        | id del usuario |
| `clinicalServiceId`| `string`       | Si        | id del servicio|

### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "be1ad5b0-94b8-430d-ac8e-c7602b75b98b",
    "userId": "d6cc56ee-8de4-4a06-8c07-cf6ee7213ea5",
    "clinicalServiceId": "03bda783-82d1-4f73-be2a-514cff13d036",
    "isActive": true,
    "createdAt": "2025-10-17T21:55:33.788Z",
    "updatedAt": "2025-10-17T22:06:32.898Z"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T22:06:32.900Z"
}
```
---
## 📅 Recepcionista

#### HU-R-01: Registrar nuevo dueño

**ID:** `HU-R-01`  
**Título:** _[Registrar nuevo dueño]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción

Como Recepcionista, quiero registrar un nuevo dueño de mascota ingresando sus datos personales (nombre, apellido, DNI, teléfono, etc.), para que pueda ser posteriormente asociado a mascotas y gestionar turnos.

### 🔧 Detalles Técnicos

- **Método:** `POST`
- **Ruta:** `/api/v1/owners`
- **Roles Permitidos:** `[Recepcionista, Superadmin]`
- **Autenticación:** Requiere JWT válido.
- **DTO de Entrada:** `OwnerForCreationDto`
- **DTO de Respuesta:** `OwnerResponse`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo ser accesible para usuarios autenticados mediante JWT.
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` podrán acceder al endpoint.
- **CA-03:** El sistema debe validar que los campos requeridos cumplan con las restricciones del DTO (`OwnerForCreationDto`).
- **CA-04:** Si el DNI ingresado ya está registrado, se debe retornar un `400 Bad Request` con el mensaje: `"El dni ingresado ya está registrado."`.
- **CA-05:** Si el teléfono ingresado ya está registrado, se debe retornar un `400 Bad Request` con el mensaje: `"El teléfono ingresado ya está registrado."`.
- **CA-06:** Si el email ingresado ya está registrado (y es proporcionado), se debe retornar un `400 Bad Request` con el mensaje: `"El email ingresado ya está registrado."`.
- **CA-07:** En caso de éxito, el sistema debe crear el nuevo dueño en la base de datos y devolver un objeto `OwnerResponse` con un estado `200 OK`.


### 📦 DTO de Entrada (`OwnerForCreationDto`)

| Campo      | Tipo      | Requerido | Descripción                                       |
|----------- |---------- |-----------|---------------------------------------------------|
| `name`     | `string`  | Sí        | Nombre del dueño.                                 |
| `lastname` | `string`  | Sí        | Apellido del dueño.                               |
| `dni`      | `string`  | Sí        | Documento Nacional de Identidad del dueño (único).|
| `email`    | `string`  | No        | Correo electrónico del dueño (opcional).          |
| `phone`    | `string`  | Sí        | Número de teléfono de contacto del dueño (único). |
| `address`  | `string`  | Sí        | Dirección de residencia del dueño.                |


### 📦 Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "be1ad5b0-94b8-430d-ac8e-c7602b75b98b",
    "userId": "d6cc56ee-8de4-4a06-8c07-cf6ee7213ea5",
    "clinicalServiceId": "03bda783-82d1-4f73-be2a-514cff13d036",
    "isActive": true,
    "createdAt": "2025-10-17T21:55:33.788Z",
    "updatedAt": "2025-10-17T22:06:32.898Z"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-17T22:06:32.900Z"
}
```
---
#### HU-R-02: Actualizar dueño existente

**ID:** `HU-R-02`  
**Título:** _[Actualizar dueño existente]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción

Como Recepcionista, quiero actualizar los datos de un dueño de mascota existente (nombre, apellido, DNI, teléfono, email, dirección), para mantener la información correcta y poder asociarlo adecuadamente a mascotas y turnos.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/owners/update`
- **Roles Permitidos:** `[Recepcionista, Superadmin]`
- **Autenticación:** Requiere JWT válido.
- **DTO de Entrada:** `OwnerForUpdateDto` (PartialType de `OwnerForCreationDto` + campo obligatorio `id`)
- **DTO de Respuesta:** `OwnerResponse`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.
- **CA-03:** El campo `id` es obligatorio; si no se envía, el request debe ser rechazado.
- **CA-04:** Si el ID no corresponde a un dueño existente, el sistema debe responder con `400 Bad Request` y el mensaje `"El dueño no existe."`.
- **CA-05:** Los demás campos (`name`, `lastname`, `dni`, `phone`, `email`, `address`) son opcionales; si se envían, deben cumplir con las validaciones del DTO original.
- **CA-06:** Si se envía un `dni` ya registrado en otro dueño distinto al que se está actualizando, el sistema debe retornar `400 Bad Request` con el mensaje `"El dni ingresado ya está registrado."`.
- **CA-07:** Si se envía un `phone` ya registrado en otro dueño distinto al que se está actualizando, el sistema debe retornar `400 Bad Request` con el mensaje `"El teléfono ingresado ya está registrado."`.
- **CA-08:** Si se envía un `email` ya registrado en otro dueño distinto al que se está actualizando, el sistema debe retornar `400 Bad Request` con el mensaje `"El email ingresado ya está registrado."`.
- **CA-09:** En caso de éxito, el sistema debe actualizar solo los campos proporcionados y devolver un `OwnerResponse` con estado `200 OK`.

### 📦 DTO de Entrada (`OwnerForUpdateDto`)

| Campo      | Tipo      | Requerido | Descripción                            |
|-----------|----------|-----------|------------------------------------------------------------------------------|
| `id`       | `string`  | Sí        | Identificador único del dueño a actualizar.                                  |
| `name`     | `string`  | No        | Nuevo nombre del dueño (opcional).                                           |
| `lastname` | `string`  | No        | Nuevo apellido del dueño (opcional).                                         |
| `dni`      | `string`  | No        | Nuevo DNI del dueño (opcional, único).                                       |
| `email`    | `string`  | No        | Nuevo email del dueño (opcional, único).                                     |
| `phone`    | `string`  | No        | Nuevo teléfono del dueño (opcional, único).                                   |
| `address`  | `string`  | No        | Nueva dirección del dueño (opcional).                                        |

### 📦 Ejemplo de Request Body (Input) - Actualización parcial

```json
{
  "success": true,
  "data": {
    "id": "5774c773-1348-4b4e-b647-dce2315635fc",
    "name": "Juan",
    "lastname": "Perez",
    "dni": "12345678",
    "email": "nuevo.email@gmail.com",
    "phone": "9876543210",
    "address": "Calle Falsa 123"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T19:05:46.988Z"
}
```
---
#### HU-R-03: Registrar nueva mascota

**ID:** `HU-R-03`  
**Título:** _[Registrar nueva mascota]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción

Como Recepcionista, quiero registrar una nueva mascota asociándola a un dueño existente, para poder llevar el control de los pacientes y asignar turnos médicos correctamente.

### 🔧 Detalles Técnicos

- **Método:** `POST`
- **Ruta:** `/api/v1/pets`
- **Roles Permitidos:** `[Recepcionista, Superadmin]`
- **Autenticación:** Requiere JWT válido.
- **DTO de Entrada:** `PetForCreationDto`
- **DTO de Respuesta:** `PetResponse`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.
- **CA-03:** El campo `ownerId` es obligatorio y debe corresponder a un dueño existente; si no existe, se devuelve `400 Bad Request` con el mensaje `"El dueño no existe."`.
- **CA-04:** El campo `name` es obligatorio y no puede repetirse para el mismo dueño; si ya existe → `400 Bad Request` con el mensaje `"El dueño ya tiene una mascota con ese nombre"`.
- **CA-05:** El campo `species` es obligatorio y debe ser uno de los valores válidos del enum `EPetSpecies`.
- **CA-06:** El campo `breed` es obligatorio.
- **CA-07:** El campo `birthdate` es obligatorio y no puede ser una fecha futura; si lo es → `400 Bad Request` con el mensaje `"La fecha de nacimiento no puede ser en el futuro"`.
- **CA-08:** El campo `gender` es obligatorio y debe ser uno de los valores válidos del enum `EPetGender`.
- **CA-09:** En caso de éxito, la mascota se crea y se devuelve un objeto `PetResponse` con código `201 Created`.

### 📦 DTO de Entrada (`PetForCreationDto`)

| Campo       | Tipo         | Requerido | Descripción |
|------------|-------------|-----------|------------|
| `ownerId`  | `string`     | Sí        | ID del dueño al que se asocia la mascota |
| `name`     | `string`     | Sí        | Nombre de la mascota |
| `species`  | `EPetSpecies`| Sí        | Especie de la mascota (enum) |
| `breed`    | `string`     | Sí        | Raza de la mascota |
| `birthdate`| `Date`       | Sí        | Fecha de nacimiento de la mascota |
| `gender`   | `EPetGender` | Sí        | Género de la mascota (enum) |

### 📦 Ejemplo de Request Body (Input)

```json
{
  "success": true,
  "data": {
    "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
    "name": "Firulais",
    "species": "PERRO",
    "breed": "Labrador",
    "birthdate": "2020-01-01T00:00:00.000Z",
    "gender": "MACHO"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T19:10:35.650Z"
}
```
---
#### HU-R-04: Actualizar datos de la mascota

**ID:** `HU-R-04`  
**Título:** _[Actualizar datos de la mascota]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción

Como Recepcionista, quiero actualizar los datos de una mascota existente (nombre, especie, raza, fecha de nacimiento y género), para mantener la información correcta y poder gestionarla adecuadamente en el sistema.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/pets`
- **Roles Permitidos:** `[Recepcionista, Superadmin]`
- **Autenticación:** Requiere JWT válido.
- **DTO de Entrada:** `PetForUpdateDto`
- **DTO de Respuesta:** `PetResponse`

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.
- **CA-03:** El campo `id` es obligatorio; si no se envía o no existe la mascota → `400 Bad Request` con el mensaje `"La mascota no existe"`.
- **CA-04:** Los demás campos (`name`, `species`, `breed`, `birthdate`, `gender`) son opcionales; si se envían, deben cumplir con las validaciones del DTO.
- **CA-05:** Si se envía `birthdate` mayor que la fecha actual → `400 Bad Request` con el mensaje `"La fecha de nacimiento no puede ser en el futuro"`.
- **CA-06:** En caso de éxito, la mascota se actualiza solo con los campos proporcionados y se devuelve un `PetResponse` con código `200 OK`.

### 📦 DTO de Entrada (`PetForUpdateDto`)

| Campo       | Tipo         | Requerido | Descripción |
|------------|-------------|-----------|------------|
| `id`       | `string`     | Sí        | Identificador único de la mascota a actualizar |
| `name`     | `string`     | No        | Nuevo nombre de la mascota (opcional) |
| `species`  | `EPetSpecies`| No        | Nueva especie de la mascota (opcional, enum) |
| `breed`    | `string`     | No        | Nueva raza de la mascota (opcional) |
| `birthdate`| `Date`       | No        | Nueva fecha de nacimiento (opcional, no puede ser futura) |
| `gender`   | `EPetGender` | No        | Nuevo género de la mascota (opcional, enum) |

### 📦 Ejemplo de Request Body (Input) - Actualización parcial

```json
{
  "success": true,
  "data": {
    "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
    "name": "Firulais",
    "species": "PERRO",
    "breed": "Labrador",
    "birthdate": "2020-01-01T00:00:00.000Z",
    "gender": "MACHO"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T19:15:54.601Z"
}
```
---
#### HU-R-05: Buscar dueños y sus mascotas

**ID:** `HU-R-05`  
**Título:** _[Buscar dueños y sus mascotas]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción

Como Recepcionista, quiero buscar dueños por nombre, apellido, DNI, teléfono o email, y ver sus mascotas asociadas, para acceder rápidamente a la información necesaria y gestionar turnos o consultas.

### 🔧 Detalles Técnicos

- **Método:** `GET`
- **Ruta:** `/api/v1/owners/search`
- **Roles Permitidos:** `[Recepcionista, Superadmin]`
- **Autenticación:** Requiere JWT válido.
- **DTO de Entrada:** `MetaQueryDto`
- **DTO de Respuesta:** `PaginatedResponse<OwnerResponse>` (cada dueño incluye sus mascotas)

---

### 📦 DTO de Entrada (`MetaQueryDto`)

| Campo       | Tipo       | Requerido | Descripción |
|------------|-----------|-----------|------------|
| `searchTerm`| `string`  | No        | Término de búsqueda que puede coincidir con nombre, apellido, DNI, email o teléfono del dueño |
| `page`      | `number`  | No        | Número de página para paginación (por defecto 1) |
| `size`      | `number`  | No        | Tamaño de la página (por defecto 10) |
| `sort`      | `SortOrder`| No       | Orden de los resultados (`ASC` o `DESC`, por defecto `ASC`) |

---

### ✅ Criterios de Aceptación

- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.
- **CA-03:** Si no se envía `searchTerm`, se deben retornar todos los dueños paginados.
- **CA-04:** Si se envía `searchTerm`, se deben filtrar los dueños que coincidan parcialmente con el nombre, apellido, email, teléfono o DNI.
- **CA-05:** La respuesta debe incluir la lista de dueños junto con sus mascotas asociadas.
- **CA-06:** La respuesta debe soportar paginación con `page`, `size` y ordenamiento con `sort`.
- **CA-07:** La respuesta debe retornar un objeto con la estructura `PaginatedResponse` incluyendo `data` y `meta` con `page`, `size`, `total` y `sort`.

---

### 📦 Ejemplo de Request Query
```
GET /api/v1/owners/search?searchTerm=Juan&page=1&size=5&sort=ASC
```
### 📦 Ejemplo de Respuesta Exitosa (`200 OK`)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "5774c773-1348-4b4e-b647-dce2315635fc",
        "name": "Juan",
        "lastname": "Perez",
        "dni": "12345678",
        "email": "nuevo.email@gmail.com",
        "phone": "9876543210",
        "address": "Calle Falsa 123",
        "pets": [
          {
            "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
            "name": "Firulais",
            "species": "PERRO",
            "breed": "Labrador",
            "birthdate": "2020-01-01T00:00:00.000Z",
            "gender": "MACHO"
          }
        ]
      }
    ],
    "meta": {
      "page": 1,
      "size": 10,
      "total": 1,
      "sort": "asc"
    }
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T19:24:07.039Z"
}
```
---
#### HU-R-06: Crear turno para mascota

**ID:** `HU-R-06`  
**Título:** _[Crear turno para mascota]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción
Como Recepcionista, quiero crear un turno para una mascota con un veterinario específico, asignando uno o varios servicios y opcionalmente agregando tiempo o precio extra, para organizar la agenda médica, respetando la disponibilidad del veterinario y evitando solapamientos.

### 🔧 Detalles Técnicos
- **Método:** `POST`  
- **Ruta:** `/api/v1/appointments`  
- **Roles Permitidos:** `[Recepcionista, Superadmin]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `AppointmentForCreationDto`  
- **DTO de Respuesta:** `AppointmentResponse`  

### ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.  
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.  
- **CA-03:** Campos obligatorios: `petId`, `vetId`, `services`, `date`, `startTime`.  
- **CA-04:** Validar que la mascota (`petId`) exista → `404 Not Found` si no existe.  
- **CA-05:** Validar que el veterinario (`vetId`) exista y tenga rol `VETERINARIO` → `404 Not Found` o `400 Bad Request` según corresponda.  
- **CA-06:** Validar que los servicios existan, estén activos y que el veterinario pueda realizarlos → `404 Not Found` o `400 Bad Request`.  
- **CA-07:** No se permiten servicios duplicados → `400 Bad Request`.  
- **CA-08:** Validar disponibilidad del veterinario según su configuración de agenda → `400 Bad Request` si está fuera de horario o inactivo.  
- **CA-09:** Validar que la fecha no sea pasada → `400 Bad Request`.  
- **CA-10:** Validar que no haya solapamientos con otros turnos del veterinario → `400 Bad Request`.  
- **CA-11:** En caso de éxito, la cita se crea y se devuelve un `AppointmentResponse` con código `201 Created`.  

### 📦 DTO de Entrada (`AppointmentForCreationDto`)

| Campo             | Tipo                               | Requerido | Descripción |
|------------------|-----------------------------------|-----------|------------|
| `petId`           | `string`                          | Sí        | ID de la mascota |
| `vetId`           | `string`                          | Sí        | ID del veterinario asignado |
| `description`     | `string`                          | No        | Descripción opcional de la cita |
| `services`        | `AppointmentServicesForCreationDto[]` | Sí     | Lista de servicios asociados a la cita |
| `extraTime`       | `number`                          | No        | Tiempo adicional opcional en minutos |
| `extraTimeReason` | `string`                          | No        | Motivo del tiempo extra |
| `extraPrice`      | `number`                          | No        | Precio extra opcional |
| `extraPriceReason`| `string`                          | No        | Motivo del precio extra |
| `date`            | `Date`                            | Sí        | Fecha de la cita |
| `startTime`       | `number`                          | Sí        | Hora de inicio en minutos desde medianoche |

### 📦 DTO de Servicio (`AppointmentServicesForCreationDto`)

| Campo               | Tipo    | Requerido | Descripción |
|--------------------|---------|-----------|------------|
| `clinicalServiceId` | `string`| Sí        | ID del servicio clínico |


### 📦 Ejemplo de Request Body

```json
{
  "petId": "6d92a372-db64-4369-92f7-55d9fa600a12",
  "vetId": "a7b23c11-89d1-4f5a-92b1-11d22a4e6f11",
  "description": "Revisión anual",
  "services": [
    { "clinicalServiceId": "123e4567-e89b-12d3-a456-426614174000" }
  ],
  "extraTime": 10,
  "extraTimeReason": "Chequeo adicional",
  "extraPrice": 15,
  "extraPriceReason": "Vacuna extra",
  "date": "2025-10-25",
  "startTime": 600
}
```

### 📦 Ejemplo de Respuesta exitosa
```json
{
  "success": true,
  "data": {
    "id": "a1013f43-1b69-495c-9606-462b6bc4507d",
    "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
    "vetName": "RAI NAU",
    "owner": {
      "id": "5774c773-1348-4b4e-b647-dce2315635fc",
      "name": "Juan",
      "lastname": "Perez",
      "dni": "12345678",
      "email": "nuevo.email@gmail.com",
      "phone": "9876543210",
      "address": "Calle Falsa 123"
    },
    "pet": {
      "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
      "name": "Firulais",
      "species": "PERRO",
      "breed": "Labrador",
      "birthdate": "2020-01-01T00:00:00.000Z",
      "gender": "MACHO"
    },
    "description": "cita de prueba",
    "date": "2026-01-01T00:00:00.000Z",
    "status": "PENDIENTE",
    "services": [
      {
        "id": "267de698-3a3e-4035-9272-aeba544518dd",
        "name": "Cirugía mayor",
        "description": "Procedimientos quirúrgicos complejos que requieren mayor tiempo y recuperación.",
        "price": 8000,
        "duration": 120,
        "isActive": true
      }
    ],
    "startTime": 600,
    "endTime": 730,
    "duration": 130,
    "extraTime": 10,
    "extraTimeReason": "cita de prueba",
    "extraPrice": 10,
    "extraPriceReason": "cita de prueba",
    "totalPrice": 8010
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T19:51:11.738Z"
}
```
---
#### HU-R-07: Reprogramar un turno

**ID:** `HU-R-07`  
**Título:** _[Reprogramar un turno]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción
Como Recepcionista, quiero reprogramar un turno existente cambiando la fecha y/o la hora de inicio, para gestionar cambios en la agenda médica, respetando la disponibilidad del veterinario y evitando solapamientos con otros turnos. También se incluye la posibilidad de cancelar turnos mediante un endpoint similar.

### 🔧 Detalles Técnicos
- **Método:** `PATCH`  
- **Ruta:** `/api/v1/appointments/:id`  
- **Roles Permitidos:** `[Recepcionista, Superadmin]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `RescheduleAppointmentDto`  
- **DTO de Respuesta:** `AppointmentResponse`  

### ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.  
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.  
- **CA-03:** Se debe enviar al menos `newDate` o `newStartTime` → `400 Bad Request` si no se envía ninguno.  
- **CA-04:** Validar que el turno exista → `404 Not Found` si no se encuentra.  
- **CA-05:** No se puede reprogramar un turno cancelado → `400 Bad Request`.  
- **CA-06:** Validar que la nueva fecha no sea pasada → `400 Bad Request`.  
- **CA-07:** Validar disponibilidad del veterinario según su configuración de agenda → `400 Bad Request` si está fuera de horario o inactivo.  
- **CA-08:** Validar que no haya solapamientos con otros turnos del veterinario → `400 Bad Request`.  
- **CA-09:** En caso de éxito, se devuelve un `AppointmentResponse` con el turno actualizado y código `200 OK`.  

### 📦 DTO de Entrada (`RescheduleAppointmentDto`)

| Campo          | Tipo    | Requerido | Descripción |
|----------------|---------|-----------|------------|
| `newDate`       | `Date`  | No        | Nueva fecha del turno |
| `newStartTime`  | `number`| No        | Nueva hora de inicio en minutos desde medianoche |

### 📦 Ejemplo de Request Body

```json
{
  "newDate": "2025-11-01",
  "newStartTime": 660
}
```
---
#### HU-R-08: Actualizar estado de un turno

**ID:** `HU-R-08`  
**Título:** _[Actualizar estado de un turno]_  
**Rol:** _[Recepcionista / Veterinario / Superadmin]_

## 📝 Descripción
Como usuario autorizado (Recepcionista, Veterinario o Superadmin), quiero actualizar el estado de un turno, para poder marcarlo como **cancelado**, **pendiente**, o cualquier otro estado definido, y así mantener la agenda actualizada y reflejar cambios en tiempo real.

## 🔧 Detalles Técnicos
- **Método:** `PATCH`  
- **Ruta:** `/api/v1/appointments/update-status/:id`  
- **Roles Permitidos:** `[Recepcionista, Veterinario, Superadmin]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetros:**  
  - `id` → ID del turno a modificar  
  - `status` → nuevo estado (`EAppointmentStatus`) pasado como query  
- **DTO de Respuesta:** `AppointmentResponse`  

## ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible para usuarios autenticados mediante JWT.  
- **CA-02:** Solo los roles `[Recepcionista, Veterinario, Superadmin]` pueden acceder al endpoint.  
- **CA-03:** Validar que el ID del turno exista → `404 Not Found` si no existe.  
- **CA-04:** Validar que el `status` enviado sea válido → `400 Bad Request` si no pertenece a `EAppointmentStatus`.  
- **CA-05:** Actualizar el estado del turno en la base de datos.  
- **CA-06:** Retornar el turno actualizado como `AppointmentResponse`.  
- **CA-07:** Permitir cambiar un turno cancelado a otro estado si es necesario.  

## 📦 Parámetros de Entrada

| Campo   | Tipo                  | Requerido | Descripción |
|---------|---------------------|-----------|------------|
| `id`    | `string`            | Sí        | ID del turno a actualizar |
| `status`| `EAppointmentStatus`| Sí        | Nuevo estado del turno (`PENDIENTE`, `CANCELADO`, `FINALIZADO`, etc.) |

## 📦 Ejemplo de Request
```
PATCH /api/v1/appointments/update-status/a1013f43-1b69-495c-9606-462b6bc4507d?status=CANCELADO
```
### 📦 Ejemplo de Request Body
```json
{
  "success": true,
  "data": {
    "id": "5570973c-0a88-4a0f-9949-84a9dd2c73b7",
    "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
    "vetName": "RAI NAU",
    "owner": {
      "id": "5774c773-1348-4b4e-b647-dce2315635fc",
      "name": "Juan",
      "lastname": "Perez",
      "dni": "12345678",
      "email": "nuevo.email@gmail.com",
      "phone": "9876543210",
      "address": "Calle Falsa 123"
    },
    "pet": {
      "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
      "name": "Firulais",
      "species": "PERRO",
      "breed": "Labrador",
      "birthdate": "2020-01-01T00:00:00.000Z",
      "gender": "MACHO"
    },
    "description": "cita de prueba",
    "date": "2025-12-17T00:00:00.000Z",
    "status": "CANCELADO",
    "services": [
      {
        "id": "03bda783-82d1-4f73-be2a-514cff13d036",
        "name": "Castración macho",
        "description": "Procedimiento quirúrgico de esterilización para machos.",
        "price": 4500,
        "duration": 60,
        "isActive": true
      },
      {
        "id": "267de698-3a3e-4035-9272-aeba544518dd",
        "name": "Cirugía mayor",
        "description": "Procedimientos quirúrgicos complejos que requieren mayor tiempo y recuperación.",
        "price": 8000,
        "duration": 120,
        "isActive": true
      }
    ],
    "startTime": 600,
    "endTime": 790,
    "duration": 190,
    "extraTime": 10,
    "extraTimeReason": "cita de prueba",
    "extraPrice": 10,
    "extraPriceReason": "cita de prueba",
    "totalPrice": 12510
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-20T20:19:18.310Z"
}
```
---
#### HU-R-09: Listar turnos del día por fecha

**ID:** `HU-R-09`  
**Título:** _[Listar turnos del día por fecha]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción  
Como Recepcionista, quiero ver la lista de turnos correspondientes a una fecha específica (por ejemplo, el día actual), para poder organizar mi trabajo de manera eficiente y visualizar los turnos agendados.

### 🔧 Detalles Técnicos  
- **Método:** `GET`  
- **Ruta:** `/api/v1/appointments/by-date?date={YYYY-MM-DD}`  
- **Roles Permitidos:** `[Recepcionista, Superadmin]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetro Query:**  
  - `date` → Fecha a consultar (tipo `Date`)  
- **DTO de Respuesta:** `AppointmentResponse[]`  

### ✅ Criterios de Aceptación (según comportamiento actual)
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.  
- **CA-03:** El parámetro `date` debe enviarse en el query; si no se puede convertir a una fecha válida, se devuelve un `400 Bad Request` con el mensaje `Fecha inválida`.  
- **CA-04:** Se deben retornar todas las citas cuya fecha se encuentre dentro del rango horario completo del día indicado (`00:00:00` a `23:59:59`).  
- **CA-05:** Los resultados deben estar ordenados de forma ascendente según el campo `startTime`.  
- **CA-06:** Cada cita debe incluir la información relacionada (`vet`, `pet`, `owner`, `services`, etc.) conforme a `AppointmentResponse`.  
- **CA-07:** La respuesta debe devolverse con un arreglo de `AppointmentResponse[]` y código `200 OK`.  
- **CA-08:** Si no existen citas para la fecha consultada, se debe retornar una lista vacía (`[]`) dentro del campo `data` con código `200 OK`.  

### 📦 Parámetro Query de Entrada

| Campo   | Tipo   | Requerido | Descripción |
|---------|--------|-----------|-------------|
| `date`  | `Date` | Sí        | Fecha a consultar en formato `YYYY-MM-DD` o ISO |

### 📦 Ejemplo de Request  
```http
GET /api/v1/appointments/by-date?date=2025-10-22
```

### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "data": [
    {
      "id": "1ba463db-22a0-4864-9fd5-361d1db54907",
      "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
      "vetName": "RAI NAU",
      "owner": {
        "id": "5774c773-1348-4b4e-b647-dce2315635fc",
        "name": "Juan",
        "lastname": "Perez",
        "dni": "12345678",
        "email": "nuevo.email@gmail.com",
        "phone": "9876543210",
        "address": "Calle Falsa 123"
      },
      "pet": {
        "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
        "name": "Firulais",
        "species": "PERRO",
        "breed": "Labrador",
        "birthdate": "2020-01-01T00:00:00.000Z",
        "gender": "MACHO"
      },
      "description": "cita de prueba",
      "date": "2025-10-22T00:00:00.000Z",
      "status": "PENDIENTE",
      "services": [
        {
          "id": "03bda783-82d1-4f73-be2a-514cff13d036",
          "name": "Castración macho",
          "description": "Procedimiento quirúrgico de esterilización para machos.",
          "price": 4500,
          "duration": 60,
          "isActive": true
        },
        {
          "id": "267de698-3a3e-4035-9272-aeba544518dd",
          "name": "Cirugía mayor",
          "description": "Procedimientos quirúrgicos complejos que requieren mayor tiempo y recuperación.",
          "price": 8000,
          "duration": 120,
          "isActive": true
        }
      ],
      "startTime": 800,
      "endTime": 990,
      "duration": 190,
      "extraTime": 10,
      "extraTimeReason": "cita de prueba",
      "extraPrice": 10,
      "extraPriceReason": "cita de prueba",
      "totalPrice": 12510
    }
  ],
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T18:32:12.539Z"
}
```
---
#### HU-R-10: Ver historial de turnos de una mascota

**ID:** `HU-R-10`  
**Título:** _[Ver historial de turnos de una mascota]_  
**Rol:** _[Recepcionista]_  

### 📝 Descripción  
Como Recepcionista, quiero poder consultar el historial de turnos de una mascota específica, para responder consultas de los dueños y tener un registro completo de los turnos anteriores y actuales.

### 🔧 Detalles Técnicos  
- **Método:** `GET`  
- **Ruta:** `/api/v1/appointments/by-pet/:petId`  
- **Roles Permitidos:** `[Recepcionista, Superadmin]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetro Path:**  
  - `petId` → ID de la mascota a consultar  
- **DTO de Respuesta:** `AppointmentResponse[]`  

### ✅ Criterios de Aceptación (según comportamiento actual)
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo los roles `Recepcionista` y `Superadmin` pueden acceder al endpoint.  
- **CA-03:** Validar que el `petId` corresponda a una mascota existente → `404 Not Found` si no existe.  
- **CA-04:** Se deben retornar todas las citas de la mascota, ordenadas por `date` descendente y `startTime` descendente.  
- **CA-05:** La información de cada turno debe incluir los datos completos: `vet`, `pet`, `owner`, `services`, etc., según lo definido en `AppointmentResponse`.  
- **CA-06:** Retornar la lista de citas como `AppointmentResponse[]` con código `200 OK`.  
- **CA-07:** Si la mascota no tiene turnos, devolver un `404 Not Found` con mensaje adecuado.  

### 📦 Parámetro Path de Entrada

| Campo    | Tipo    | Requerido | Descripción |
|----------|--------|-----------|-------------|
| `petId`  | `string` | Sí      | ID de la mascota para la cual se desea consultar el historial de turnos |

### 📦 Ejemplo de Request  
```http
GET /api/v1/appointments/by-pet/6d92a372-db64-4369-92f7-55d9fa600a12
```

### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "data": [
    {
      "id": "1ba463db-22a0-4864-9fd5-361d1db54907",
      "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
      "vetName": "RAI NAU",
      "owner": {
        "id": "5774c773-1348-4b4e-b647-dce2315635fc",
        "name": "Juan",
        "lastname": "Perez",
        "dni": "12345678",
        "email": "nuevo.email@gmail.com",
        "phone": "9876543210",
        "address": "Calle Falsa 123"
      },
      "pet": {
        "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
        "name": "Firulais",
        "species": "PERRO",
        "breed": "Labrador",
        "birthdate": "2020-01-01T00:00:00.000Z",
        "gender": "MACHO"
      },
      "description": "cita de prueba",
      "date": "2025-10-22T00:00:00.000Z",
      "status": "PENDIENTE",
      "services": [
        {
          "id": "03bda783-82d1-4f73-be2a-514cff13d036",
          "name": "Castración macho",
          "description": "Procedimiento quirúrgico de esterilización para machos.",
          "price": 4500,
          "duration": 60,
          "isActive": true
        },
        {
          "id": "267de698-3a3e-4035-9272-aeba544518dd",
          "name": "Cirugía mayor",
          "description": "Procedimientos quirúrgicos complejos que requieren mayor tiempo y recuperación.",
          "price": 8000,
          "duration": 120,
          "isActive": true
        }
      ],
      "startTime": 800,
      "endTime": 990,
      "duration": 190,
      "extraTime": 10,
      "extraTimeReason": "cita de prueba",
      "extraPrice": 10,
      "extraPriceReason": "cita de prueba",
      "totalPrice": 12510
    }
  ],
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T18:32:12.539Z"
}
```
---

## 👨‍⚕️ Veterinario

#### HU-V-01: Listar turnos del día del veterinario

**ID:** `HU-V-01`  
**Título:** _[Listar turnos del día del veterinario]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero ver la lista de mis turnos asignados para una fecha específica (por ejemplo, el día actual), para organizar mi jornada laboral y visualizar los turnos que debo atender.

### 🔧 Detalles Técnicos  
- **Método:** `GET`  
- **Ruta:** `/api/v1/appointments/by-vet/my?date={YYYY-MM-DD}`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetro Query:**  
  - `date` → Fecha a consultar (tipo `Date`)  
- **DTO de Respuesta:** `AppointmentResponse[]`  

### ✅ Criterios de Aceptación (según comportamiento actual)  
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el rol `Veterinario` puede acceder al endpoint.  
- **CA-03:** El parámetro `date` debe enviarse en el query; si no se envía o es inválido, se devuelve `400 Bad Request`.  
- **CA-04:** Validar que el ID del veterinario exista y corresponda a un usuario con rol `Veterinario`; si no, se devuelve `404 Not Found` o `400 Bad Request`.  
- **CA-05:** Se deben retornar todas las citas (appointments) del veterinario cuya fecha coincida con la solicitada.  
- **CA-06:** La información de cada cita debe incluir los datos relacionados (`vet`, `pet`, `owner`, `services`, etc.) según lo definido en `AppointmentResponse`.  
- **CA-07:** Los resultados se devuelven ordenados por `startTime` ascendente con código `200 OK`.  
- **CA-08:** Si no se encuentran citas para la fecha indicada, se devuelve un `404 Not Found` con un mensaje adecuado.  

### 📦 Parámetro Query de Entrada

| Campo   | Tipo   | Requerido | Descripción |
|---------|--------|-----------|-------------|
| `date`  | `Date` | Sí        | Fecha a consultar en formato `YYYY-MM-DD` o ISO |  

### 📦 Ejemplo de Request  
```http
GET /api/v1/appointments/by-vet/my?date=2025-10-22
```

### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "data": [
    {
      "id": "1ba463db-22a0-4864-9fd5-361d1db54907",
      "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
      "vetName": "RAI NAU",
      "owner": {
        "id": "5774c773-1348-4b4e-b647-dce2315635fc",
        "name": "Juan",
        "lastname": "Perez",
        "dni": "12345678",
        "email": "nuevo.email@gmail.com",
        "phone": "9876543210",
        "address": "Calle Falsa 123"
      },
      "pet": {
        "id": "6d92a372-db64-4369-92f7-55d9fa600a12",
        "name": "Firulais",
        "species": "PERRO",
        "breed": "Labrador",
        "birthdate": "2020-01-01T00:00:00.000Z",
        "gender": "MACHO"
      },
      "description": "cita de prueba",
      "date": "2025-10-22T00:00:00.000Z",
      "status": "PENDIENTE",
      "services": [
        {
          "id": "03bda783-82d1-4f73-be2a-514cff13d036",
          "name": "Castración macho",
          "description": "Procedimiento quirúrgico de esterilización para machos.",
          "price": 4500,
          "duration": 60,
          "isActive": true
        },
        {
          "id": "267de698-3a3e-4035-9272-aeba544518dd",
          "name": "Cirugía mayor",
          "description": "Procedimientos quirúrgicos complejos que requieren mayor tiempo y recuperación.",
          "price": 8000,
          "duration": 120,
          "isActive": true
        }
      ],
      "startTime": 800,
      "endTime": 990,
      "duration": 190,
      "extraTime": 10,
      "extraTimeReason": "cita de prueba",
      "extraPrice": 10,
      "extraPriceReason": "cita de prueba",
      "totalPrice": 12510
    }
  ],
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:16:37.887Z"
}
```
---
#### HU-V-02: Registrar historial médico de una mascota

**ID:** `HU-V-02`  
**Título:** _[Registrar historial médico de una mascota]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero registrar consultas médicas (diagnóstico, tratamiento, notas y vacunas) para las mascotas que atendí, con el fin de mantener actualizado el historial clínico y disponer de información completa sobre el seguimiento de cada paciente.

### 🔧 Detalles Técnicos  
- **Método:** `POST`  
- **Ruta:** `/api/v1/medical-records`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `MedicalRecordForCreationDto`  
- **DTO de Respuesta:** `MedicalRecord` (incluye vacunas registradas)  

### ✅ Criterios de Aceptación (según comportamiento actual)  
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el rol `Veterinario` puede acceder al endpoint.  
- **CA-03:** Validar que el ID de la cita (`appointmentId`) exista → `404 Not Found` si no se encuentra.  
- **CA-04:** Validar que la mascota asociada a la cita exista → `404 Not Found` si no se encuentra.  
- **CA-05:** Validar que el veterinario que realiza la operación exista → `404 Not Found` si no se encuentra.  
- **CA-06:** Validar que el veterinario esté autorizado para registrar el historial (es decir, que coincida con el `vetId` de la cita) → `401 Unauthorized` si no coincide.  
- **CA-07:** No se puede crear un historial médico duplicado para la misma cita → `400 Bad Request`.  
- **CA-08:** Se deben registrar opcionalmente los campos `diagnosis`, `treatment`, `notes` y `vaccines`.  
- **CA-09:** En caso de éxito, se devuelve el historial médico creado con sus vacunas asociadas dentro de la transacción de base de datos y código `201 Created`.  

### 📦 DTO de Entrada (`MedicalRecordForCreationDto`)

| Campo       | Tipo                  | Requerido | Descripción |
|------------|---------------------|-----------|------------|
| `appointmentId` | `string`          | Sí        | ID de la cita asociada |
| `diagnosis`     | `string`          | No        | Diagnóstico de la consulta |
| `treatment`     | `string`          | No        | Tratamiento administrado |
| `notes`         | `string`          | No        | Notas adicionales del veterinario |
| `vaccines`      | `VaccineForCreationDto[]` | No | Lista de vacunas aplicadas durante la cita |

### 📦 DTO Interno (`VaccineForCreationDto`)

| Campo       | Tipo    | Requerido | Descripción |
|------------|---------|-----------|------------|
| `name`     | `string` | Sí        | Nombre de la vacuna |
| `description` | `string` | No     | Descripción de la vacuna |

### 📦 Ejemplo de Request Body
```json
{
  "appointmentId": "123e4567-e89b-12d3-a456-426614174000",
  "diagnosis": "El paciente tiene fiebre",
  "treatment": "Se le administró antibiótico",
  "notes": "Revisar temperatura en 3 días",
  "vaccines": [
    { "name": "Vacuna antirrábica", "description": "Aplicada según protocolo" }
  ]
}
```
### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:25:25.237Z"
}
```
---
#### HU-V-03: Editar historial médico de una mascota

**ID:** `HU-V-03`  
**Título:** _[Editar historial médico de una mascota]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero editar o actualizar consultas médicas ya registradas, para corregir errores o agregar información adicional, asegurando que el historial clínico se mantenga completo y actualizado.

### 🔧 Detalles Técnicos  
- **Método:** `PATCH`  
- **Ruta:** `/api/v1/medical-records`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `MedicalRecordForUpdateDto`  
- **DTO de Respuesta:** `void` (operación de actualización)  

### ✅ Criterios de Aceptación (según comportamiento actual)  
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el rol `Veterinario` puede acceder al endpoint.  
- **CA-03:** Validar que el ID del historial médico (`id`) exista → `404 Not Found` si no se encuentra.  
- **CA-04:** Validar que el veterinario que realiza la actualización sea el mismo que registró el historial → `401 Unauthorized` si no coincide.  
- **CA-05:** Los campos `diagnosis`, `treatment` y `notes` son opcionales, pero al menos se debe actualizar alguno.  
- **CA-06:** Si un campo no se envía, se mantiene el valor existente en la base de datos.  
- **CA-07:** Se realiza la actualización de los campos proporcionados en la base de datos mediante el método `update`.  
- **CA-08:** En caso de éxito, se devuelve un código `200 OK` (sin contenido adicional).  

### 📦 DTO de Entrada (`MedicalRecordForUpdateDto`)

| Campo       | Tipo    | Requerido | Descripción |
|------------|---------|-----------|------------|
| `id`       | `string` | Sí       | ID del historial médico a actualizar |
| `diagnosis`| `string` | No       | Nuevo diagnóstico de la consulta |
| `treatment`| `string` | No       | Nuevo tratamiento administrado |
| `notes`    | `string` | No       | Nuevas notas adicionales del veterinario |

### 📦 Ejemplo de Request Body
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "diagnosis": "El paciente muestra mejoría",
  "treatment": "Se ajustó la dosis del medicamento",
  "notes": "Revisar evolución en 5 días"
}
```
### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:35:25.343Z"
}
```
---
#### HU-V-04: Registrar vacuna aplicada a una mascota

**ID:** `HU-V-04`  
**Título:** _[Registrar vacuna aplicada a una mascota]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero registrar vacunas aplicadas a una mascota, para llevar un control actualizado del historial de vacunación de cada paciente.

### 🔧 Detalles Técnicos  
- **Método:** `POST`  
- **Ruta:** `/api/v1/medical-records/vaccines?medicalRecordId={id}`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetro Query:**  
  - `medicalRecordId` → ID del historial médico al cual se asociará la vacuna  
- **DTO de Entrada:** `VaccineForCreationDto`  
- **DTO de Respuesta:** `Vaccine`  

### ✅ Criterios de Aceptación (según comportamiento actual)  
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el rol `Veterinario` puede acceder al endpoint.  
- **CA-03:** Validar que el historial médico exista (`medicalRecordId`) → `404 Not Found` si no existe.  
- **CA-04:** Validar que el veterinario que realiza la operación sea el mismo que registró el historial médico → `401 Unauthorized` si no coincide.  
- **CA-05:** Validar que el campo `name` de la vacuna esté presente y no sea vacío.  
- **CA-06:** La vacuna se registra con la fecha actual (`date`) y se asocia al historial médico indicado.  
- **CA-07:** En caso de éxito, se devuelve el objeto `Vaccine` recién creado con su ID, nombre, descripción y fecha de registro.  

### 📦 Parámetro Query de Entrada

| Campo              | Tipo    | Requerido | Descripción |
|-------------------|---------|-----------|------------|
| `medicalRecordId` | `string` | Sí       | ID del historial médico asociado |

### 📦 DTO de Entrada (`VaccineForCreationDto`)

| Campo        | Tipo    | Requerido | Descripción |
|-------------|---------|-----------|------------|
| `name`      | `string` | Sí       | Nombre de la vacuna |
| `description`| `string` | No       | Descripción de la vacuna |

### 📦 Ejemplo de Request
```http
POST /api/v1/medical-records/vaccines?medicalRecordId=123e4567-e89b-12d3-a456-426614174000
```

### 📦 Ejemplo de Request Body
```json
{
  "name": "Vacuna antirrábica",
  "description": "Vacuna aplicada para prevenir rabia"
}
```
### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "data": {
    "id": "b16abb4b-7804-4b86-88ab-15d32e10c754",
    "medicalRecordsId": "53ab4fd3-2a32-47fe-8ab3-936e4b34d12c",
    "name": "Vacuna contra la gripe",
    "description": "Vacuna contra la gripe",
    "date": "2025-10-21T19:40:10.601Z",
    "createdAt": "2025-10-21T19:40:10.603Z",
    "updatedAt": "2025-10-21T19:40:10.603Z"
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:40:10.605Z"
}
```
---
#### HU-V-05: Actualizar vacuna registrada

**ID:** `HU-V-05`  
**Título:** _[Actualizar vacuna registrada]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero actualizar los datos de una vacuna previamente registrada (nombre o descripción), para corregir errores o complementar la información en el historial de vacunación de la mascota.

### 🔧 Detalles Técnicos  
- **Método:** `PATCH`  
- **Ruta:** `/api/v1/medical-records/vaccines`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `VaccineForUpdateDto` (extiende `VaccineForCreationDto`)  
- **DTO de Respuesta:** `Vaccine`  

### ✅ Criterios de Aceptación (según comportamiento actual)  
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el rol `Veterinario` puede acceder al endpoint.  
- **CA-03:** Validar que la vacuna exista (`id`) → `404 Not Found` si no existe.  
- **CA-04:** Validar que el veterinario que realiza la actualización sea el mismo que registró la vacuna → `401 Unauthorized` si no coincide.  
- **CA-05:** El campo `id` es obligatorio.  
- **CA-06:** Los campos `name` y `description` son opcionales, pero si se envían, se actualizan; de lo contrario, se mantienen los valores existentes.  
- **CA-07:** La vacuna actualizada se guarda en la base de datos y se devuelve el objeto `Vaccine` actualizado.  

### 📦 DTO de Entrada (`VaccineForUpdateDto`)

| Campo        | Tipo    | Requerido | Descripción |
|-------------|---------|-----------|------------|
| `id`        | `string` | Sí       | ID de la vacuna a actualizar |
| `name`      | `string` | No       | Nuevo nombre de la vacuna |
| `description`| `string` | No       | Nueva descripción de la vacuna |

### 📦 Ejemplo de Request
```http
PATCH /api/v1/medical-records/vaccines
```

### 📦 Ejemplo de Request Body
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Vacuna antirrábica actualizada",
  "description": "Descripción corregida de la vacuna"
}
```
### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:43:02.748Z"
}
```
---
#### HU-V-06: Eliminar una vacuna

**ID:** `HU-V-06`  
**Título:** _[Eliminar una vacuna]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero poder eliminar vacunas registradas de un historial médico, para corregir errores o registros duplicados y mantener actualizado el historial clínico de la mascota.

### 🔧 Detalles Técnicos  
- **Método:** `DELETE`  
- **Ruta:** `/api/v1/medical-records/vaccines?vaccineId={vaccineId}`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **Parámetro Query:**  
  - `vaccineId` → ID de la vacuna a eliminar  
- **DTO de Respuesta:** `{ success: boolean, message: string }`  

### ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo el veterinario que registró la vacuna puede eliminarla.  
- **CA-03:** Validar que la vacuna exista → `404 Not Found` si no se encuentra.  
- **CA-04:** Eliminar la vacuna de la base de datos usando `prisma.vaccines.delete()`.  
- **CA-05:** Retornar un mensaje de confirmación (`success: true`) si la operación fue exitosa.  
- **CA-06:** No se debe permitir eliminar vacunas de historiales médicos de otros veterinarios → `401 Unauthorized`.  

### 📦 Parámetro Query de Entrada

| Campo      | Tipo   | Requerido | Descripción |
|------------|--------|-----------|-------------|
| `vaccineId`| `string` | Sí      | ID de la vacuna a eliminar |

### 📦 Ejemplo de Request  
```http
DELETE /api/v1/medical-records/vaccines?vaccineId=123e4567-e89b-12d3-a456-426614174000
```

### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:47:08.676Z"
}
```
---
#### HU-V-07: Ver agenda semanal del veterinario

**ID:** `HU-V-07`  
**Título:** _[Ver agenda semanal del veterinario]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero poder ver mi agenda semanal (días y horarios), para conocer mi disponibilidad y organizar mi jornada de manera eficiente.

### 🔧 Detalles Técnicos  
- **Método:** `GET`  
- **Ruta:** `/api/v1/schedule-config/my-schedule-config`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Respuesta:** `ScheduleConfigResponse`  
- **Datos Incluidos:** Días de la semana con horarios de inicio y fin, estado activo/inactivo de cada día.  

### ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo los usuarios con rol `Veterinario` pueden acceder al endpoint.  
- **CA-03:** Validar que el usuario exista → `404 Not Found` si no existe.  
- **CA-04:** Validar que el usuario sea veterinario → `403 Forbidden` si no lo es.  
- **CA-05:** Validar que la configuración de agenda exista → `404 Not Found` si no existe.  
- **CA-06:** Retornar la configuración completa de la agenda (`ScheduleConfigResponse`) incluyendo los días de la semana, horarios de inicio y fin, y si están activos o no.  

### 📦 Ejemplo de Request  
```http
GET /api/v1/schedule-config/my-schedule-config
```

### 📦 Ejemplo de Respuesta (Exitosa)
```json
{
  "success": true,
  "data": {
    "id": "a0a98f18-55a7-4220-9440-fd023dd568bb",
    "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
    "days": [
      {
        "id": "6d445975-0789-4c4b-9234-ed9756770e85",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": true,
        "weekday": "LUNES",
        "startTime": 480,
        "endTime": 1080
      },
      {
        "id": "1564fc18-fa77-46bd-ac6b-f6f5e6c792d0",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": true,
        "weekday": "MARTES",
        "startTime": 480,
        "endTime": 1080
      },
      {
        "id": "fcada645-9bca-434b-bec3-f6dfeb26f138",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": true,
        "weekday": "MIERCOLES",
        "startTime": 480,
        "endTime": 1080
      },
      {
        "id": "7d5384ba-5a00-4d04-a84e-119aa2ae769f",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": false,
        "weekday": "JUEVES",
        "startTime": 540,
        "endTime": 1080
      },
      {
        "id": "9cbc0909-8a36-41d2-ade7-c19c16e1432b",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": false,
        "weekday": "VIERNES",
        "startTime": 540,
        "endTime": 1080
      },
      {
        "id": "66ee1751-545d-4828-bb65-fa2e5a4ac782",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": false,
        "weekday": "SABADO",
        "startTime": 540,
        "endTime": 1080
      },
      {
        "id": "4bb7767a-ba51-4a68-a50d-a44854a9b87d",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": false,
        "weekday": "DOMINGO",
        "startTime": 540,
        "endTime": 1080
      }
    ]
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T19:48:52.684Z"
}
```
---
#### HU-V-08: Modificar horarios de agenda del veterinario

**ID:** `HU-V-08`  
**Título:** _[Modificar horarios de agenda del veterinario]_  
**Rol:** _[Veterinario]_  

### 📝 Descripción  
Como Veterinario, quiero modificar los horarios disponibles por día de la semana, para adaptar la agenda a mis horarios reales y mantener la disponibilidad actualizada.

### 🔧 Detalles Técnicos  
- **Método:** `PATCH`  
- **Ruta:** `/api/v1/schedule-config`  
- **Roles Permitidos:** `[Veterinario]`  
- **Autenticación:** Requiere JWT válido  
- **DTO de Entrada:** `ScheduleConfigForUpdateDto`  
- **DTO de Respuesta:** `ScheduleConfigResponse`  
- **Datos Incluidos:** Días de la semana con horarios de inicio y fin, estado activo/inactivo de cada día.  

### ✅ Criterios de Aceptación
- **CA-01:** La ruta debe estar protegida y solo accesible mediante autenticación JWT.  
- **CA-02:** Solo los usuarios con rol `Veterinario` pueden acceder al endpoint.  
- **CA-03:** Validar que el usuario exista → `404 Not Found` si no existe.  
- **CA-04:** Validar que el usuario sea veterinario → `403 Forbidden` si no lo es.  
- **CA-05:** Validar que la configuración de agenda exista → `404 Not Found` si no existe.  
- **CA-06:** Validar que los días enviados en la solicitud existan en la agenda → `404 Not Found` si algún día no existe.  
- **CA-07:** Actualizar los campos enviados (`isActive`, `startTime`, `endTime`) para cada día.  
- **CA-08:** Retornar la configuración de agenda actualizada (`ScheduleConfigResponse`) con los días modificados.  

### 📦 Ejemplo de Request Body
```json
{
  "days": [
    {
      "weekday": "LUNES",
      "isActive": true,
      "startTime": 480,
      "endTime": 1080
    },
    {
      "weekday": "MARTES",
      "isActive": false
    }
  ]
}
```
### 📦 Ejemplo de Respuesta (Exitosa)

```json
{
  "success": true,
  "data": {
    "id": "a0a98f18-55a7-4220-9440-fd023dd568bb",
    "vetId": "57516e06-8655-47df-8caf-46dea940c32f",
    "days": [
      {
        "id": "6d445975-0789-4c4b-9234-ed9756770e85",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": true,
        "weekday": "LUNES",
        "startTime": 480,
        "endTime": 1080
      },
      {
        "id": "1564fc18-fa77-46bd-ac6b-f6f5e6c792d0",
        "scheduleId": "a0a98f18-55a7-4220-9440-fd023dd568bb",
        "isActive": false,
        "weekday": "MARTES",
        "startTime": 480,
        "endTime": 1080
      }
    ]
  },
  "message": "Solicitud exitosa",
  "timestamp": "2025-10-21T20:15:00.000Z"
}

```
