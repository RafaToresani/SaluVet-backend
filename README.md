![SaluVet](./assets/pic.jpg)

# 🐾 SaluVet - Narrativa del proyecto

---

SaluVet es un sistema de gestión diseñado para clínicas veterinarias, con el objetivo de organizar eficientemente la atención de pacientes (mascotas), el historial médico, la vacunación y los turnos. El sistema contempla múltiples roles con permisos diferenciados para reflejar el flujo de trabajo real de una clínica veterinaria.

---

## 🎯 Problema que resuelve.
Actualmente, muchas veterinarias gestionan sus operaciones de forma manual o con herramientas genéricas como planillas, agendas en papel o software sin adaptación al rubro. Esto genera:

* Pérdida o duplicación de información médica.

* Turnos superpuestos o mal asignados.

* Dificultad para hacer seguimiento de vacunaciones.

* Acceso desorganizado a la información de mascotas y dueños.

SaluVet busca resolver estos problemas con una API centralizada, accesible por múltiples roles, permitiendo registrar, visualizar y gestionar la información clave de manera ordenada y segura.

---

## 👥 Roles del sistema
* Superadmin: Responsable de configurar la clínica. Puede crear usuarios (recepcionistas y veterinarios), ver reportes generales y administrar la base completa.

* Recepcionista: Administra los turnos, registra nuevos dueños y mascotas, y gestiona la atención inicial.

* Veterinario: Registra consultas médicas, aplica vacunas y accede al historial clínico de sus pacientes.

* Dueño de mascota (futuro módulo): Podrá visualizar turnos, historial y vacunas de su mascota.

---

## 🖥️ Tecnologías

NestJS - TypeScript - MySQL - Prisma - Swagger - JWT

---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
