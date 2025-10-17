# 🐾 SaluVet MVP

## Historias de usuario detalladas

### Índice

---

### 👦🏻 General

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

## 🧩 Plantilla Base (para nuevas HU)

**ID:** `HU-XX-YY`  
**Título:** _[Breve título descriptivo]_  
**Rol:** _[Rol principal: Admin, Superadmin, Usuario, etc.]_

### 📝 Descripción

Como **[rol]**, quiero **[acción o funcionalidad]**, para **[beneficio o propósito]**.

### 🔧 Detalles Técnicos

- **Método:** `GET | POST | PATCH | DELETE | PUT`
- **Ruta:** `/api/...`
- **Roles Permitidos:** `[lista de roles con acceso]`

### ✅ Criterios de Aceptación

- **CA-1:** ...
- **CA-2:** ...
- **CA-3:** ...

### 📦 Request Body (Input)

```json
{
  // ejemplo de entrada o indicar: "Empty Body"
}
```
