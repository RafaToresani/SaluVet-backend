# 🐾 SaluVet MVP

## Historias de usuario

### 👤 General

* **HU-G-01:** Como usuario registrado, quiero poder iniciar sesión en el sistema, para acceder a mis funciones autorizadas.
* **HU-G-01:** Como usuario, quiero consultar la lista de servicios activos para usarlos en la gestión de turnos o registros médicos.

### 👑 Superadmin
* **HU-SA-01:** Como Superadmin, quiero registrar nuevos usuarios con roles Recepcionista o Veterinario, para incorporar nuevo personal al sistema.
* **HU-SA-02:** Como Superadmin, quiero modificar los datos personales (name, email) de un usuario existente, para mantener la información del personal actualizada.
* **HU-SA-03:** Como Superadmin, quiero consultar la lista de todo el personal (R y V), con capacidad de filtrar y paginar, para tener una visión general del equipo.
* **HU-SA-04:** Como Superadmin, quiero cambiar el estado de un usuario a inactivo, para revocar su acceso sin eliminar su historial.
* **HU-SA-05:** Como Superadmin, quiero poder resetear la contraseña de un usuario, para asistir en casos de bloqueo o pérdida.
* **HU-SA-06:** Como Superadmin, quiero registrar nuevos servicios que ofrece la clínica, para ampliar el catálogo.
* **HU-SA-07:** Como Superadmin, quiero modificar el nombre, descripción, precio, duración de un servicio existente, para actualizar la información del catálogo.
* **HU-SA-08:** Como Superadmin, quiero desactivar o desactivar un servicio clínico asociado a un veterinario.

### 📅 Recepcionista
* **HU-R-01:** Como Recepcionista, quiero registrar nuevos dueños de mascotas, para tener sus datos disponibles en el sistema.
* **HU-R-02:** Como Recepcionista, quiero editar la información de los dueños, para corregir o actualizar datos.
* **HU-R-03:** Como Recepcionista, quiero registrar nuevas mascotas asociadas a un dueño, para tener el control de los pacientes.
* **HU-R-04:** Como Recepcionista, quiero editar los datos de las mascotas, para corregir información cuando sea necesario.
* **HU-R-05:** Como Recepcionista, quiero buscar dueños por nombre, apellido, DNI, teléfono o email, y ver sus mascotas asociadas, para acceder rápidamente a la información necesaria.
* **HU-R-06:** Como Recepcionista, quiero crear turnos para mascotas con veterinarios específicos, para organizar la agenda médica.
* **HU-R-07:** Como Recepcionista, quiero reprogramar un turno existente cambiando la fecha y/o la hora de inicio, para gestionar cambios en la agenda médica, respetando la disponibilidad del veterinario y evitando solapamientos con otros turnos.
* **HU-R-08:** Como usuario autorizado (Recepcionista, Veterinario o Superadmin), quiero actualizar el estado de un turno, para poder marcarlo como **cancelado**, **pendiente**, o cualquier otro estado definido, y así mantener la agenda actualizada y reflejar cambios en tiempo real.
* **HU-R-09:** Como Recepcionista, quiero ver la lista de turnos del día, ordenados por horario, para organizar mi trabajo.

<!-- ### 👑 Superadmin

* **HU-01:** Como Superadmin, quiero que se cree automáticamente mi usuario con las credenciales del `.env` al iniciar la app, para tener acceso inicial sin intervención manual.
* **HU-03:** Como Superadmin, quiero crear, editar, listar y desactivar usuarios recepcionistas y veterinario, para gestionar al personal de recepción y de veterinaria.
* **HU-04:** Como Superadmin, quiero poder resetear la contraseña de un usuario, para asistir en casos de bloqueo o pérdida.
* **HU-23**: Como Superadmin, quiero crear, editar, listar y eliminar los servicios que ofrece la clínica (como consultas, vacunación, etc.), para mantener actualizado el catálogo. -->
* **HU-29**: Como Recepcionista, quiero que al crear un turno, solo pueda seleccionar veterinarios que tengan habilitado el servicio seleccionado, para asegurar que la mascota será atendida por un profesional apto.

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
* **HU-26**: Como Superadmin, quiero activar o desactivar manualmente los servicios que puede realizar un veterinario, para controlar qué procedimientos puede atender cada profesional.
---

### 👨‍⚕️ Veterinario

* **HU-14:** Como Veterinario, quiero ver la lista de mis turnos asignados, para organizar mi jornada.
* **HU-15:** Como Veterinario, quiero registrar consultas médicas (diagnóstico, tratamiento, notas) para las mascotas que atendí, para mantener el historial clínico actualizado.
* **HU-16:** Como Veterinario, quiero editar o actualizar consultas ya registradas, para corregir errores o agregar información adicional.
* **HU-17:** Como Veterinario, quiero registrar vacunas aplicadas a una mascota, para llevar un control de vacunación.
* **HU-18:** Como Veterinario, quiero consultar el historial clínico y vacunas de una mascota, para tener contexto clínico completo antes de atender.
* **HU-21**: Como Veterinario, quiero poder ver mi agenda semanal (días y horarios), para conocer mi disponibilidad.
* **HU-22**: Como Veterinario, quiero modificar los horarios disponibles por día de la semana, para adaptar la agenda a mis horarios reales.
* **HU-25**: Como Veterinario, quiero ver el servicio asociado a cada turno, para saber con qué prepararme antes de atender al paciente.

