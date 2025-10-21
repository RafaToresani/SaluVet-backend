# 🐾 SaluVet MVP

## Historias de usuario

### 👤 General

* **HU-G-01:** Como usuario registrado, quiero poder iniciar sesión en el sistema, para acceder a mis funciones autorizadas.
* **HU-G-02:** Como usuario, quiero consultar la lista de servicios activos para usarlos en la gestión de turnos o registros médicos.

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
* **HU-R-10:** Como Recepcionista, quiero ver el historial de turnos de una mascota, para responder consultas de los dueños.

### 👨‍⚕️ Veterinario
* **HU-V-01:** Como Veterinario, quiero ver la lista de mis turnos asignados, para organizar mi jornada.
* **HU-V-02:** Como Veterinario, quiero registrar consultas médicas (diagnóstico, tratamiento, notas) para las mascotas que atendí, para mantener el historial clínico actualizado.
* **HU-V-03:** Como Veterinario, quiero editar o actualizar consultas ya registradas, para corregir errores o agregar información adicional.
* **HU-V-04:** Como Veterinario, quiero registrar vacunas aplicadas a una mascota, para llevar un control de vacunación.
* **HU-V-05:** Como Veterinario, quiero actualizar los datos de una vacuna previamente registrada (nombre o descripción), para corregir errores o complementar la información en el historial de vacunación de la mascota.
* **HU-V-06:** Como Veterinario, quiero poder eliminar vacunas registradas de un historial médico, para corregir errores o registros duplicados y mantener actualizado el historial clínico de la mascota.
* **HU-V-07:** Como Veterinario, quiero poder ver mi agenda semanal (días y horarios), para conocer mi disponibilidad.
* **HU-V-08:** Como Veterinario, quiero modificar los horarios disponibles por día de la semana, para adaptar la agenda a mis horarios reales.

