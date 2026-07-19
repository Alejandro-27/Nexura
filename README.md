# Nexura 🪙

Nexura es una aplicación móvil multiplataforma nativa diseñada con **Ionic Framework** y **Angular** para el control, registro y análisis de finanzas personales en tiempo real. Utiliza **Supabase** como infraestructura backend as a servicio (BaaS), proporcionando autenticación segura, base de datos relacional y sincronización persistente de datos.

---

## 🚀 Características Principales

*   **Autenticación Multiusuario:** Registro, inicio de sesión y persistencia de sesión cifrada de forma nativa a través de Supabase Auth.
*   **Aislamiento de Perfiles (Multi-tenant):** Filtro estricto a nivel de base de datos y consultas para que cada usuario gestione única y exclusivamente sus propios registros financieros.
*   **Dashboard Financiero Avanzado:** Visualización de balances generales, sumatorias asíncronas en tiempo real de ingresos/gastos y eliminación reactiva de movimientos.
*   **Arquitectura Standalone Moderna:** Implementación limpia utilizando componentes independientes de Angular, inyección de dependencias optimizada vía `inject()` y ciclo de vida de Ionic.
*   **Interfaz Móvil Premium:** Scroll nativo optimizado con variables de entorno CSS (`--padding-bottom`) para evitar solapamientos con la barra de navegación inferior.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** Ionic Framework (Última versión) & Angular (Componentes Standalone)
*   **Backend & Seguridad:** Supabase (PostgreSQL + Auth Server)
*   **Gestor de Paquetes:** npm / Node.js
*   **Estilos:** Sass (SCSS) / Componentes Web Nativos de Ionic

---

## ⚙️ Requisitos Previos

Antes de comenzar la instalación, asegúrate de tener configurado tu entorno global con las siguientes herramientas:

*   **Node.js:** Versión LTS activa (v20 o superior recomendada).
*   **Ionic CLI:** Instalado de forma global en tu máquina.
    ```bash
    npm install -g @ionic/cli
    ```
*   **Angular CLI:** Instalado de forma global.
    ```bash
    npm install -g @angular/cli
    ```

---

## 📦 Instalación del Proyecto

Sigue estos pasos en orden secuencial para clonar, instalar y levantar el entorno local de desarrollo:

### 1. Clonar el repositorio e instalar dependencias
Abre tu terminal en tu directorio de proyectos y ejecuta:
```bash
git clone [https://github.com/tu-usuario/nexura.git](https://github.com/tu-usuario/nexura.git)
cd nexura
npm install
