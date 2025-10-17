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
**ID:** `HU-SA-03`  
**Título:** _[Desactivar/Activar a un usuario]_  
**Rol:** _[Superadmin]_

### 📝 Descripción

Como Superadmin, quiero cambiar el estado de un usuario a inactivo o visceversa, para revocar o restaurar su acceso, sin eliminar su historial.

### 🔧 Detalles Técnicos

- **Método:** `PATCH`
- **Ruta:** `/api/v1/users/superadmin/toggle-active/{id}`
- **Roles Permitidos:** `[Superadmin, Veterinario]`

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
