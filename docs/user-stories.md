# 🐾 SaluVet MVP
---

### ***Version:*** **1.0**

---

## Historias de usuario

---
### 👑 Superadmin

* **HU-01:** Como Superadmin, quiero que se cree automáticamente mi usuario con las credenciales del `.env` al iniciar la app, para tener acceso inicial sin intervención manual.
* **HU-02:** Como Superadmin, quiero poder iniciar sesión en el sistema, para acceder a mis funciones autorizadas.
* **HU-03:** Como Superadmin, quiero crear, editar, listar y desactivar usuarios recepcionistas y veterinario, para gestionar al personal de recepción y de veterinaria.
* **HU-04:** Como Superadmin, quiero poder resetear la contraseña de un usuario, para asistir en casos de bloqueo o pérdida.
* **HU-23**: Como Superadmin, quiero crear, editar, listar y eliminar los servicios que ofrece la clínica (como consultas, vacunación, etc.), para mantener actualizado el catálogo.

---

### 📅 Recepcionista

* **HU-05:** Como Recepcionista, quiero registrar nuevos dueños de mascotas, para tener sus datos disponibles en el sistema.
* **HU-06:** Como Recepcionista, quiero editar la información de los dueños, para corregir o actualizar datos.
* **HU-07:** Como Recepcionista, quiero registrar nuevas mascotas asociadas a un dueño, para tener el control de los pacientes.
* **HU-08:** Como Recepcionista, quiero editar los datos de las mascotas, para corregir información cuando sea necesario.
* **HU-09:** Como Recepcionista, quiero crear turnos para mascotas con veterinarios específicos, para organizar la agenda médica.
<!-- ahora integrada en la 09 * **HU-10:** Como Recepcionista, quiero validar que no haya solapamientos al crear un turno, para evitar errores en la planificación. -->
* **HU-11:** Como Recepcionista, quiero poder cancelar o reprogramar turnos, para gestionar cambios de agenda.
* **HU-12:** Como Recepcionista, quiero ver la lista de turnos del día, ordenados por horario, para organizar mi trabajo.
* **HU-13:** Como Recepcionista, quiero buscar dueños por nombre o teléfono y ver sus mascotas asociadas, para acceder rápidamente a la información necesaria.
* **HU-19** (opcional): Como Recepcionista, quiero ver el historial de turnos de una mascota, para responder consultas de los dueños.
* **HU-20** : Como Superadmin, quiero inicializar automáticamente la agenda semanal de un veterinario al crearlo, para que esté listo para asignar turnos.
<!-- Ahora integrada en la 09 * **HU-24**: Como Recepcionista, quiero seleccionar un servicio al crear un turno, para que el veterinario sepa qué procedimiento debe realizar. -->
---

### 👨‍⚕️ Veterinario

* **HU-14:** Como Veterinario, quiero ver la lista de mis turnos asignados, para organizar mi jornada.
* **HU-15:** Como Veterinario, quiero registrar consultas médicas (diagnóstico, tratamiento, notas) para las mascotas que atendí, para mantener el historial clínico actualizado.
* **HU-16:** Como Veterinario, quiero editar o actualizar consultas ya registradas, para corregir errores o agregar información adicional.
* **HU-17:** Como Veterinario, quiero registrar vacunas aplicadas a una mascota, para llevar un control de vacunación.
* **HU-18:** Como Veterinario, quiero consultar el historial completo de consultas y vacunas de una mascota, para tener contexto clínico completo antes de atender.
* **HU-21**: Como Veterinario, quiero poder ver mi agenda semanal (días y horarios), para conocer mi disponibilidad.
* **HU-22**: Como Veterinario, quiero modificar los horarios disponibles por día de la semana, para adaptar la agenda a mis horarios reales.
* **HU-25**: Como Veterinario, quiero ver el servicio asociado a cada turno, para saber con qué prepararme antes de atender al paciente.