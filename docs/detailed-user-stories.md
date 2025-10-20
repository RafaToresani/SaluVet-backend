# 🐾 SaluVet MVP

## Historias de usuario detalladas

### Índice

---

## 👦🏻 General

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
## 📅 Recepcionista
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
## 📅 Recepcionista
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
## 📅 Recepcionista
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
