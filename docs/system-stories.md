# 🏗️ SaluVet - Historias de Sistema

## Definición
Las historias de sistema describen las funcionalidades técnicas y arquitectónicas que el sistema debe implementar para soportar las historias de usuario.

---

## 🔐 **Autenticación y Autorización**

### **HS-AUTH-01:** Sistema de Autenticación JWT
**Como sistema**, debo implementar autenticación basada en JWT para validar la identidad de los usuarios y generar tokens de acceso seguros.

**Criterios de aceptación:**
- Generar tokens JWT con información del usuario (id, email, role)
- Configurar tiempo de expiración del token (1 hora por defecto)
- Validar tokens en cada request autenticado
- Manejar renovación de tokens

### **HS-AUTH-02:** Sistema de Autorización por Roles
**Como sistema**, debo implementar un sistema de autorización que controle el acceso a endpoints basado en roles de usuario.

**Criterios de aceptación:**
- Definir roles: SUPERADMIN, RECEPCIONISTA, VETERINARIO
- Implementar guards para validar roles en endpoints
- Permitir múltiples roles por endpoint
- Retornar error 403 cuando el rol no tenga acceso

### **HS-AUTH-03:** Middleware de Seguridad
**Como sistema**, debo implementar middleware de seguridad para proteger rutas y validar tokens.

**Criterios de aceptación:**
- Validar token JWT en headers Authorization
- Extraer información del usuario del token
- Aplicar guards de autenticación y autorización
- Manejar errores de autenticación/autorización

---

## 🗄️ **Gestión de Base de Datos**

### **HS-DB-01:** Configuración de Base de Datos MySQL
**Como sistema**, debo configurar y mantener conexión con base de datos MySQL usando Prisma ORM.

**Criterios de aceptación:**
- Configurar conexión a MySQL con variables de entorno
- Implementar Prisma Client para operaciones de BD
- Manejar conexiones y desconexiones automáticas
- Configurar pool de conexiones

### **HS-DB-02:** Sistema de Migraciones
**Como sistema**, debo implementar sistema de migraciones para versionar cambios en el esquema de base de datos.

**Criterios de aceptación:**
- Generar migraciones automáticas desde Prisma Schema
- Ejecutar migraciones en orden cronológico
- Mantener historial de migraciones aplicadas
- Rollback de migraciones en caso de error

### **HS-DB-03:** Modelado de Entidades
**Como sistema**, debo definir y mantener el modelo de datos con todas las entidades del dominio.

**Criterios de aceptación:**
- Definir modelos: User, Owner, Pet, Appointment, MedicalRecords, ClinicalService, ScheduleConfig
- Establecer relaciones entre entidades
- Implementar constraints y validaciones
- Definir índices para optimización

---

## 🔄 **API y Comunicación**

### **HS-API-01:** Arquitectura RESTful
**Como sistema**, debo implementar una API RESTful siguiendo estándares HTTP y convenciones REST.

**Criterios de aceptación:**
- Usar verbos HTTP apropiados (GET, POST, PUT, PATCH, DELETE)
- Implementar códigos de estado HTTP correctos
- Estructurar URLs de manera consistente
- Manejar versionado de API

### **HS-API-02:** Documentación de API con Swagger
**Como sistema**, debo generar documentación automática de la API usando Swagger/OpenAPI.

**Criterios de aceptación:**
- Documentar todos los endpoints con descripciones
- Definir esquemas de request/response
- Incluir ejemplos de uso
- Generar interfaz interactiva de pruebas

### **HS-API-03:** Interceptor de Respuestas
**Como sistema**, debo estandarizar el formato de respuestas de la API.

**Criterios de aceptación:**
- Envolver todas las respuestas en formato estándar
- Incluir campos: success, data, message, timestamp
- Manejar respuestas de error de manera consistente
- Aplicar interceptor globalmente

### **HS-API-04:** Manejo de Errores Global
**Como sistema**, debo implementar manejo centralizado de errores y excepciones.

**Criterios de aceptación:**
- Capturar todas las excepciones no manejadas
- Formatear respuestas de error consistentemente
- Loggear errores para debugging
- Retornar códigos de estado apropiados

---

## 📊 **Validación y DTOs**

### **HS-VAL-01:** Sistema de Validación de Datos
**Como sistema**, debo implementar validación robusta de datos de entrada usando class-validator.

**Criterios de aceptación:**
- Validar DTOs de entrada en todos los endpoints
- Aplicar reglas de validación específicas por campo
- Retornar mensajes de error descriptivos
- Validar tipos de datos y formatos

### **HS-VAL-02:** Transformación de Datos
**Como sistema**, debo implementar mappers para transformar datos entre capas de la aplicación.

**Criterios de aceptación:**
- Convertir entidades de BD a DTOs de respuesta
- Mapear datos de entrada a entidades de BD
- Ocultar campos sensibles en respuestas
- Mantener consistencia en formato de datos

---

## 🔍 **Búsqueda y Filtrado**

### **HS-SEARCH-01:** Sistema de Búsqueda Avanzada
**Como sistema**, debo implementar funcionalidades de búsqueda con filtros y paginación.

**Criterios de aceptación:**
- Buscar por múltiples campos simultáneamente
- Implementar paginación con límites configurables
- Aplicar filtros por criterios específicos
- Retornar metadatos de paginación

### **HS-SEARCH-02:** Búsqueda de Dueños y Mascotas
**Como sistema**, debo permitir búsqueda flexible de dueños y sus mascotas asociadas.

**Criterios de aceptación:**
- Buscar por nombre, apellido, DNI, teléfono, email
- Incluir mascotas asociadas en resultados
- Aplicar filtros de paginación
- Optimizar consultas con índices

---

## 📅 **Gestión de Turnos**

### **HS-APPOINTMENT-01:** Validación de Conflictos de Horarios
**Como sistema**, debo validar que no existan conflictos de horarios al crear o reprogramar turnos.

**Criterios de aceptación:**
- Verificar disponibilidad del veterinario
- Validar que no se solapen turnos
- Considerar duración de servicios
- Permitir tiempo extra configurable

### **HS-APPOINTMENT-02:** Cálculo Automático de Precios
**Como sistema**, debo calcular automáticamente el precio total de los turnos basado en servicios seleccionados.

**Criterios de aceptación:**
- Sumar precios de servicios clínicos
- Aplicar precios extra si corresponde
- Calcular duración total del turno
- Validar precios contra servicios activos

### **HS-APPOINTMENT-03:** Gestión de Estados de Turnos
**Como sistema**, debo manejar diferentes estados de turnos y sus transiciones válidas.

**Criterios de aceptación:**
- Definir estados: PENDIENTE, CONFIRMADO, CANCELADO, NO_ASISTIDO, COMPLETO
- Validar transiciones de estado permitidas
- Registrar razones de cancelación
- Actualizar estado automáticamente cuando corresponda

---

## 🏥 **Gestión Médica**

### **HS-MEDICAL-01:** Historial Médico Completo
**Como sistema**, debo mantener un historial médico completo para cada mascota.

**Criterios de aceptación:**
- Registrar diagnósticos, tratamientos y notas
- Asociar registros médicos a turnos específicos
- Mantener trazabilidad de veterinario responsable
- Permitir actualización de registros existentes

### **HS-MEDICAL-02:** Sistema de Vacunación
**Como sistema**, debo gestionar el registro y seguimiento de vacunas aplicadas.

**Criterios de aceptación:**
- Registrar vacunas con nombre, descripción y fecha
- Asociar vacunas a registros médicos específicos
- Permitir actualización y eliminación de vacunas
- Mantener historial cronológico de vacunación

---

## ⚙️ **Configuración del Sistema**

### **HS-CONFIG-01:** Inicialización Automática
**Como sistema**, debo inicializar automáticamente datos esenciales al arrancar la aplicación.

**Criterios de aceptación:**
- Crear superadmin automáticamente desde variables de entorno
- Cargar servicios clínicos iniciales desde archivo JSON
- Verificar existencia antes de crear datos
- Manejar errores de inicialización

### **HS-CONFIG-02:** Configuración de Horarios
**Como sistema**, debo permitir configuración flexible de horarios de trabajo por veterinario.

**Criterios de aceptación:**
- Configurar horarios por día de la semana
- Activar/desactivar días específicos
- Validar horarios de inicio y fin
- Aplicar configuración a validación de turnos

### **HS-CONFIG-03:** Gestión de Servicios Clínicos
**Como sistema**, debo permitir gestión completa del catálogo de servicios clínicos.

**Criterios de aceptación:**
- CRUD completo de servicios clínicos
- Asociar servicios a veterinarios específicos
- Activar/desactivar servicios
- Validar servicios en creación de turnos

---

## 🔒 **Seguridad y Validaciones**

### **HS-SEC-01:** Validación de Permisos
**Como sistema**, debo validar que los usuarios solo puedan acceder a recursos autorizados.

**Criterios de aceptación:**
- Validar propiedad de recursos (ej: veterinario solo ve sus turnos)
- Implementar decoradores de autorización
- Verificar permisos en operaciones sensibles
- Prevenir acceso no autorizado a datos

### **HS-SEC-02:** Sanitización de Datos
**Como sistema**, debo sanitizar y validar todos los datos de entrada para prevenir inyecciones.

**Criterios de aceptación:**
- Sanitizar strings de entrada
- Validar formatos de email, teléfono, DNI
- Escapar caracteres especiales
- Prevenir inyección SQL a través de Prisma

---

## 📈 **Monitoreo y Logging**

### **HS-LOG-01:** Sistema de Logging
**Como sistema**, debo implementar logging estructurado para monitoreo y debugging.

**Criterios de aceptación:**
- Loggear todas las operaciones importantes
- Incluir información de contexto (usuario, timestamp)
- Diferentes niveles de log (error, warn, info, debug)
- Rotación de archivos de log

### **HS-LOG-02:** Interceptor de Logging de Requests
**Como sistema**, debo registrar todas las peticiones HTTP para auditoría.

**Criterios de aceptación:**
- Loggear método, URL, headers, body
- Registrar tiempo de respuesta
- Incluir información del usuario autenticado
- Filtrar datos sensibles en logs

---

## 🚀 **Performance y Optimización**

### **HS-PERF-01:** Optimización de Consultas
**Como sistema**, debo optimizar consultas de base de datos para mejor performance.

**Criterios de aceptación:**
- Implementar índices apropiados
- Usar select específicos en lugar de SELECT *
- Implementar paginación eficiente
- Cachear consultas frecuentes cuando sea apropiado

### **HS-PERF-02:** Validación de Carga
**Como sistema**, debo manejar múltiples requests concurrentes sin degradación.

**Criterios de aceptación:**
- Procesar requests en paralelo
- Manejar timeouts apropiadamente
- Implementar rate limiting si es necesario
- Monitorear métricas de performance

---

## 🔄 **Integración y Comunicación**

### **HS-INT-01:** Comunicación entre Módulos
**Como sistema**, debo facilitar comunicación eficiente entre diferentes módulos.

**Criterios de aceptación:**
- Implementar inyección de dependencias
- Exportar servicios necesarios entre módulos
- Mantener bajo acoplamiento entre módulos
- Manejar dependencias circulares

### **HS-INT-02:** Manejo de Transacciones
**Como sistema**, debo manejar transacciones de base de datos para operaciones complejas.

**Criterios de aceptación:**
- Implementar transacciones para operaciones atómicas
- Manejar rollback en caso de error
- Asegurar consistencia de datos
- Optimizar uso de transacciones

---

## 📱 **Formato de Respuestas**

### **HS-RESP-01:** Estandarización de Respuestas
**Como sistema**, debo mantener formato consistente en todas las respuestas de la API.

**Criterios de aceptación:**
- Aplicar interceptor global de respuestas
- Incluir metadatos estándar (success, message, timestamp)
- Manejar respuestas de error de manera consistente
- Mantener compatibilidad con frontend

---

## 🧪 **Testing y Calidad**

### **HS-TEST-01:** Estructura de Testing
**Como sistema**, debo implementar estructura de testing para garantizar calidad.

**Criterios de aceptación:**
- Configurar Jest para testing unitario e integración
- Implementar mocks para dependencias externas
- Crear tests para casos de éxito y error
- Mantener cobertura de código apropiada

### **HS-TEST-02:** Testing de Endpoints
**Como sistema**, debo implementar tests end-to-end para todos los endpoints.

**Criterios de aceptación:**
- Testear todos los endpoints con diferentes roles
- Validar respuestas y códigos de estado
- Probar casos de error y edge cases
- Automatizar ejecución de tests

---

## 📋 **Resumen de Módulos Implementados**

### **Módulos Principales:**
1. **Auth Module** - Autenticación y autorización
2. **Users Module** - Gestión de usuarios del sistema
3. **Owners Module** - Gestión de dueños de mascotas
4. **Pets Module** - Gestión de mascotas
5. **Appointments Module** - Gestión de turnos médicos
6. **Medical Records Module** - Historial médico y vacunas
7. **Clinical Services Module** - Catálogo de servicios
8. **Schedule Module** - Configuración de horarios

### **Componentes de Soporte:**
- **Guards** - Autenticación y autorización
- **Interceptors** - Logging y formateo de respuestas
- **Filters** - Manejo de errores
- **DTOs** - Validación y transformación de datos
- **Mappers** - Conversión entre entidades y DTOs
- **Utils** - Utilidades comunes (paginación, etc.)

### **Tecnologías Utilizadas:**
- **NestJS** - Framework principal
- **Prisma** - ORM para base de datos
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **Class-validator** - Validación de datos
- **Jest** - Testing
