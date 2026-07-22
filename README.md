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

**Aplicación multiplataforma para la gestión integral de estaciones de servicio, aplicando conceptos de Sistemas Digitales.**

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

El proyecto integra **conceptos de Sistemas Digitales** (códigos binarios, álgebra de Boole, mapas de Karnaugh, compuertas lógicas, codificadores/decodificadores) aplicados a la lógica de negocio, combinados con **patrones de diseño modernos** y **estándares de calidad de software**.

---

## 🎯 Objetivo

Desarrollar una aplicación multiplataforma que gestione las operaciones de una estación de servicio, aplicando conceptos de Sistemas Digitales y patrones de diseño para garantizar:

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

El sistema se compone de cuatro módulos principales, cada uno con una relación directa con conceptos de **Sistemas Digitales**:

### ⛽ 1. Surtidores

| Funcionalidad | Descripción |
|---------------|-------------|
| Registrar | Agregar nuevos surtidores con número, tipo de combustible, capacidad y nivel actual |
| Listar | Visualizar todos los surtidores en una tabla interactiva |
| Editar | Modificar datos del surtidor |
| Eliminar | Dar de baja surtidores del sistema |

**🔗 Relación con Sistemas Digitales:** Los niveles de combustible se representan en **código binario**:
| Binario | Nivel |
|---------|-------|
| `00` | Vacío (0%) |
| `01` | Bajo (25%) |
| `10` | Medio (50%) |
| `11` | Lleno (100%) |

### 💰 2. Ventas

| Funcionalidad | Descripción |
|---------------|-------------|
| Registrar | Crear ventas (fecha, combustible, litros, precio, total, surtidor) |
| Listar | Visualizar historial de ventas con ordenamiento y filtros |
| Editar | Modificar registros de ventas |
| Anular | Cancelar ventas registradas |

**🔗 Relación con Sistemas Digitales:** Los cálculos de totales se realizan utilizando **aritmética binaria** para demostrar principios de operaciones lógicas.

### 🚨 3. Alertas

| Funcionalidad | Descripción |
|---------------|-------------|
| Nivel Bajo | LED **amarillo** cuando el nivel de combustible está por debajo del 25% |
| Nivel Crítico | LED **rojo** cuando el nivel de combustible está por debajo del 10% |
| Monitoreo | Dashboard en tiempo real del estado de todos los surtidores |

**🔗 Relación con Sistemas Digitales:** Sistema de alertas diseñado con **compuertas lógicas** y optimizado mediante **mapas de Karnaugh**:

```
Alerta_Amarilla = (N1 · ¬N0) + (¬N1 · N0)   → Nivel 01 (25%)
Alerta_Roja     = ¬N1 · ¬N0                   → Nivel 00 (Vacío/Crítico)

Donde N1, N0 son los bits del nivel (MSB, LSB)
```

### 📊 4. Reportes

| Funcionalidad | Descripción |
|---------------|-------------|
| Ventas Diarias | Reporte detallado de ventas del día |
| Inventario | Estado actual del inventario por combustible |
| Ingresos | Ingresos agrupados por tipo de combustible |

**🔗 Relación con Sistemas Digitales:** Uso de **decodificadores** para clasificar y agrupar por tipo de combustible.

---

## 📸 Capturas de Pantalla

> *Próximamente — Agrega aquí una captura de pantalla del sistema funcionando.*

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

## 🏗️ Arquitectura

> 📚 **Documentación completa de arquitectura** → [`docs/architecture.md`](docs/architecture.md)

### Estructura del Proyecto

```
surtidor/
├── app/                    # App Router (Next.js)
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/             # Componentes reutilizables (ShadCN UI)
│   ├── ui/                 # Componentes base (botones, inputs, tablas)
│   └── forms/              # Formularios con React Hook Form + Zod
├── lib/                    # Utilidades y configuraciones
│   ├── supabase/           # Cliente Supabase
│   └── schemas/            # Esquemas de validación Zod
├── hooks/                  # Custom hooks de React
├── types/                  # Tipos e interfaces TypeScript
├── docs/                   # Documentación del proyecto
│   ├── technologies.md     # Guía de tecnologías
│   ├── database.md         # Esquema y diseño de base de datos
│   └── architecture.md     # Arquitectura del sistema
└── public/                 # Archivos estáticos
```

---

## 🗄️ Base de Datos

> 📚 **Documentación completa de la base de datos** → [`docs/database.md`](docs/database.md)

### Diagrama Entidad-Relación

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  SURTIDORES │───┐   │   VENTAS    │       │   ALERTAS   │
├─────────────┤   └──>├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ numero      │       │ surtidor_id │───┐   │ surtidor_id │───┐
│ combustible │       │ fecha       │   │   │ tipo        │   │
│ capacidad   │       │ combustible │   │   │ nivel       │   │
│ nivel       │       │ litros      │   │   │ activa      │   │
│ creado_en   │       │ precio_unit │   │   │ creado_en   │   │
│ actualizado  │       │ total       │   │   │ resuelta_en │   │
└─────────────┘       │ surtidor    │   │   └─────────────┘   │
                       │ creado_en   │   │                     │
                       └─────────────┘   │                     │
                                         └─────────────────────┘
```

### Resumen de Tablas

| Tabla | Descripción |
|-------|-------------|
| `surtidores` | Registro de surtidores con nivel de combustible en binario |
| `ventas` | Historial de transacciones de venta |
| `alertas` | Registro de alertas generadas por nivel bajo/crítico |

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

> 🔗 **Link del proyecto deployeado:** *Próximamente*

---

## 📄 Licencia

Este proyecto se desarrolla con fines educativos como parte de la actividad académica de **Sistemas Digitales**.

---

<div align="center">
  <p>Desarrollado con ❤️ para "El Surtidor Cochabambino" — Cochabamba, Bolivia</p>
  <p>
    <a href="docs/technologies.md">Tecnologías</a> •
    <a href="docs/database.md">Base de Datos</a> •
    <a href="docs/architecture.md">Arquitectura</a>
  </p>
</div>
