<div align="center">

# ⛽ Sistema de Control y Gestión para Surtidor de Gasolina

### "El Surtidor Cochabambino"

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge&logo=shadcnui)
![Zod](https://img.shields.io/badge/Zod-3E69B2?style=for-the-badge&logo=zod)

**Aplicación web moderna para la gestión integral de estaciones de servicio.**

</div>

---

## 🚀 Enlaces Rápidos

<div align="center">

[![Prototipo](https://img.shields.io/badge/🎨_Prototipo_v0-7C3AED?style=for-the-badge&logo=vercel&logoColor=white&labelColor=6D28D9)](https://surtidor-tawny.vercel.app/)
&nbsp;&nbsp;
[![App en Producción](https://img.shields.io/badge/🌐_App_en_Producción-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=1a1a1a)](https://joaquin-felipez.vercel.app/login)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Objetivo](#-objetivo)
- [Tecnologías](#-tecnologías)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Arquitectura](#-arquitectura)
- [Base de Datos](#-base-de-datos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Despliegue](#-despliegue)
- [Licencia](#-licencia)

---

## 📖 Descripción del Proyecto

**"El Surtidor Cochabambino"** es un sistema digital de control y gestión desarrollado para estaciones de servicio en Cochabamba, Bolivia. La aplicación permite administrar surtidores de gasolina, registrar ventas, monitorear alertas de nivel de combustible y generar reportes operativos.

El proyecto está construido con **tecnologías web modernas**, siguiendo **patrones de diseño actuales** y **estándares de calidad de software**.

---

## 🎯 Objetivo

Desarrollar una aplicación web que gestione las operaciones de una estación de servicio, aplicando patrones de diseño modernos para garantizar:

- ✅ Control preciso de inventario de combustible
- ✅ Registro y facturación de ventas
- ✅ Monitoreo en tiempo real de niveles críticos
- ✅ Generación de reportes operativos y financieros
- ✅ Escalabilidad y mantenibilidad del software

---

## 🛠️ Tecnologías

### Stack Principal

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Next.js](https://nextjs.org/docs) | 16.2.10 | Framework React con App Router, SSR y RSC |
| [React](https://react.dev) | 19.2.4 | Librería de interfaz de usuario |
| [TypeScript](https://www.typescriptlang.org/docs/) | 5 | Tipado estático y seguridad en desarrollo |
| [Tailwind CSS](https://tailwindcss.com/docs) | 4 | Framework de estilos utilitario |
| [Supabase](https://supabase.com/docs) | — | Backend-as-a-Service (PostgreSQL, Auth, Storage, Realtime) |
| [ShadCN UI](https://ui.shadcn.com/docs) | — | Componentes de UI accesibles y personalizables |
| [Zod](https://zod.dev) | — | Validación de esquemas con inferencia de tipos |
| [React Hook Form](https://react-hook-form.com/get-started) | — | Formularios performantes con validación |
| [TanStack Table](https://tanstack.com/table/latest/docs/introduction) | — | Tablas de datos con ordenamiento, filtrado y paginación |

> 📚 **Documentación detallada de cada tecnología** → [`docs/technologies.md`](docs/technologies.md)

---

## 🧩 Módulos del Sistema

El sistema se compone de **seis módulos principales**, diseñados para cubrir todas las operaciones de una estación de servicio.

### ⛽ 1. Surtidores

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Registrar | Agregar nuevos surtidores con tipo de combustible, capacidad y nivel | Admin |
| Listar | Visualizar todos los surtidores en tabla interactiva con nivel en litros | Todos |
| Editar | Modificar datos del surtidor | Admin |
| Eliminar | Dar de baja surtidores del sistema | Admin |

Los niveles de combustible se controlan con precisión en **litros exactos** y se clasifican en: `vacio`, `bajo`, `medio` y `lleno`.

### 💰 2. Ventas

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Registrar | Crear ventas con litros, precio, impuesto y método de pago | Operador, Admin |
| Listar | Visualizar historial de ventas con filtros y ordenamiento | Todos |
| Anular | Cancelar ventas (con control de inventario) | Supervisor, Admin |

> Las ventas soportan **múltiples métodos de pago** (efectivo, tarjeta, transferencia, crédito) y pueden dividirse en varios pagos por transacción.

### 🚨 3. Alertas

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Nivel Bajo | Notificación cuando el nivel baja del 25% | Todos (lectura) |
| Nivel Crítico | Notificación cuando el nivel baja del 10% o está vacío | Todos (lectura) |
| Resolver | Marcar alerta como resuelta tras reabastecer | Supervisor, Admin |
| Dashboard | Monitoreo en tiempo real del estado de todos los surtidores | Todos |

### 👥 4. Usuarios y Roles

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Listar usuarios | Ver todos los usuarios del sistema | Admin |
| Asignar roles | Asignar roles (admin, supervisor, operador, auditor) | Admin |
| Activar/Desactivar | Gestionar acceso de usuarios | Admin |

### 🏭 5. Proveedores y Abastecimientos

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Proveedores | CRUD de proveedores con NIT, contacto y datos fiscales | Admin |
| Abastecimientos | Registrar reabastecimiento de surtidores con factura | Admin |
| Historial | Consultar historial de abastecimientos por surtidor/proveedor | Admin |

### 📊 6. Reportes

| Funcionalidad | Descripción | Rol |
|---------------|-------------|-----|
| Ventas Diarias | Reporte detallado de ventas del día agrupado por combustible | Supervisor, Admin, Auditor |
| Inventario | Estado actual del inventario por surtidor con porcentaje | Supervisor, Admin, Auditor |
| Ingresos | Ingresos agrupados por tipo de combustible (mensual) | Supervisor, Admin, Auditor |
| Alertas Activas | Dashboard de alertas activas con tiempo transcurrido | Supervisor, Admin, Auditor |

---

## 📸 Capturas de Pantalla

> *Próximamente — Agrega aquí una captura de pantalla del sistema funcionando.*

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

## 🏗️ Arquitectura

> 📚 **Documentación completa de arquitectura** → [`docs/architecture.md`](docs/architecture.md)

### Gestión de Roles y Accesos

| Rol | Acceso |
|-----|--------|
| **Admin** | Acceso completo: gestiona surtidores, usuarios, roles, precios, proveedores y configuración |
| **Supervisor** | Supervisa operaciones: reportes, alertas, turnos, anulación de ventas |
| **Operador** | Operación diaria: registrar ventas, consultar surtidores y alertas |
| **Auditor** | Solo lectura: reportes, historial de ventas y alertas |

### Estructura del Proyecto

```
surtidor/
├── app/                          # App Router (Next.js)
│   ├── (auth)/                   # Auth: login, register
│   ├── (dashboard)/              # Dashboard protegido
│   │   ├── surtidores/           # CRUD surtidores
│   │   ├── ventas/               # Ventas y pagos
│   │   ├── alertas/              # Alertas en tiempo real
│   │   ├── reportes/             # Reportes y estadísticas
│   │   ├── proveedores/          # Gestión de proveedores
│   │   ├── abastecimientos/      # Reabastecimiento
│   │   ├── turnos/               # Turnos de operadores
│   │   ├── precios/              # Historial de precios
│   │   └── usuarios/             # Admin de usuarios y roles
│   └── api/                      # API Routes
├── components/                   # Componentes React
│   ├── ui/                       # ShadCN UI
│   ├── forms/                    # Formularios (RHF + Zod)
│   ├── tables/                   # TanStack Table
│   └── layout/                   # Sidebar, header, providers
├── lib/                          # Utilidades
│   ├── supabase/                 # Clientes Supabase
│   └── schemas/                  # Schemas Zod
├── hooks/                        # Custom hooks
├── types/                        # Tipos TypeScript
├── docs/                         # Documentación
└── public/                       # Archivos estáticos
```

---

## 🗄️ Base de Datos

> 📚 **Documentación completa de la base de datos** → [`docs/database.md`](docs/database.md)

### Tablas del Sistema

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuario vinculados a `auth.users` de Supabase |
| `roles` | Definición de roles con permisos JSONB |
| `user_roles` | Asignación de roles a usuarios |
| `tipos_combustible` | Catálogo de combustibles (admin dinámico) |
| `surtidores` | Surtidores con nivel en litros exactos |
| `precios_combustible` | Historial de precios con vigencia por fecha |
| `ventas` | Ventas con subtotal, impuesto, total y trazabilidad de usuario |
| `pagos` | Pagos de venta con múltiples métodos (efectivo, tarjeta, etc.) |
| `metodos_pago` | Catálogo de métodos de pago |
| `alertas` | Alertas por nivel bajo/crítico con resolución |
| `proveedores` | Proveedores de combustible |
| `abastecimientos` | Reabastecimiento de surtidores |
| `turnos` | Turnos de operadores con totales automáticos |

> 🔐 **Seguridad:** Todas las tablas tienen Row Level Security (RLS) con políticas basadas en roles.

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (gestor de paquetes)
- **Cuenta en Supabase** (gratuita)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/surtidor.git
cd surtidor

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

```bash
# 4. Inicializar la base de datos
# Ejecuta el script SQL en docs/database.sql desde el panel de Supabase

# 5. Iniciar el servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

---

## 🌐 Despliegue

La aplicación está preparada para desplegarse en:

- **Frontend:** [Vercel](https://vercel.com) (plataforma recomendada para Next.js)
- **Backend/Database:** [Supabase](https://supabase.com) (hosteado)

> 🔗 **Prototipo (v0.dev):** [https://surtidor-tawny.vercel.app/](https://surtidor-tawny.vercel.app/)
>
> 🔗 **App en Producción:** [https://joaquin-felipez.vercel.app/login](https://joaquin-felipez.vercel.app/login)

### 🔗 Enlaces Rápidos

| Recurso | Link |
|---------|------|
| 🎨 Prototipo (v0) | [surtidor-tawny.vercel.app](https://surtidor-tawny.vercel.app/) |
| 🌐 App en Producción | [joaquin-felipez.vercel.app](https://joaquin-felipez.vercel.app/login) |

---

## 📄 Licencia

Este proyecto se desarrolla con fines educativos.

---

<div align="center">
  <p>Desarrollado con ❤️ para "El Surtidor Cochabambino" — Cochabamba, Bolivia</p>
  <p>
    <a href="docs/technologies.md">Tecnologías</a> •
    <a href="docs/database.md">Base de Datos</a> •
    <a href="docs/architecture.md">Arquitectura</a>
  </p>
</div>
