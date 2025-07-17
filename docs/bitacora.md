# Bitácora del proyecto.
---

* Primer Sprint:
  * HU-01: Creación automática del Superadmin
  * HU-02: Iniciar sesión como Superadmin
  * HU-03: ABM de Recepcionistas y Veterinarios

## 16/07/2025

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

* Moví el registro de usuarios a el módulo users.
* Modifiqué la búsqueda de users, ahora se puede buscar por email, nombre y rol.
* Creé un mapper para mapear User a UserResponse
* Implementé un decorator que extrae el id del usuario autenticado.
* Implementé un endpoint para que el usuario autenticado modifique su nombre, e email.
* Implementé un endpoint para que el usuario autenticado modifique su contraseña.
* Implementé un endpoint para que el superadmin pueda modificar la información del resto de los usuarios.
* Agregué un campo de password por defecto al .env y la configuración global para solicitar el reset de password automático, sólo accesible al superadmin.


