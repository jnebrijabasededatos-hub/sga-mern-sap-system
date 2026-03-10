# 📦 SGA MERN - Enterprise Warehouse Management System

Este es un Sistema de Gestión de Almacenes (SGA) inspirado en la interfaz y lógica de **SAP ERP**, desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js).

## 🚀 Funcionalidades Principales (Módulos SAP)

El sistema replica las transacciones críticas de un entorno logístico real:

* **🏠 Dashboard (BI):** Panel de control con indicadores clave (KPIs) y gráficos dinámicos (**Chart.js**) que muestran los niveles de stock por SKU. Incluye un sistema de **Alertas de Stock Crítico** (< 5 unidades).
* **📊 MB52 (Listado de Stock):** Consulta de inventario en tiempo real con buscador dinámico por SKU o descripción.
* **🚚 MIGO (Movimientos):** Módulo de entradas y salidas de mercancía.
    * *Entradas:* Aumentan el stock mediante botón dedicado.
    * *Salidas:* Reducen el stock automáticamente al procesar el consumo.
    * *Escáner:* Integración con cámara para lectura de códigos de barras.
* **📜 MB51 (Historial):** Registro detallado de todos los movimientos con opción de **Exportación a PDF** profesional (jsPDF).
* **🛠️ MM01 (Maestro de Materiales):** Alta de nuevos productos en la base de datos centralizada.

## 🛠️ Stack Tecnológico

* **Frontend:** React.js (Hooks, Functional Components).
* **Backend:** Node.js + Express.js.
* **Base de Datos:** MongoDB Atlas (NoSQL).
* **Gráficos:** React-Chartjs-2.
* **Reportes:** jsPDF + AutoTable.
* **Estilos:** CSS-in-JS con diseño inspirado en **SAP Fiori**.

## ⚙️ Cómo ejecutar el proyecto

### 1. Backend
1. Navega a la carpeta `/backend`.
2. Instala dependencias: `npm install`.
3. Ejecuta el servidor: `node server.js` o `npm start`.
*(El servidor corre en el puerto 5000)*.

### 2. Frontend
1. Navega a la carpeta `/frontend`.
2. Instala dependencias: `npm install`.
3. Ejecuta la app: `npm start`.
*(La app corre en el puerto 3000)*.

## 📌 Notas para el futuro
- Para las **Salidas** en la MIGO, el sistema convierte automáticamente el número a negativo para mantener la integridad del historial.
- El **Escáner** requiere permisos de cámara en el navegador.
- Si el Dashboard dice "No hay datos", verificar que el backend esté conectado a MongoDB Atlas.

---
Desarrollado con 💻 y lógicas de SAP.

Mejoras Pendientes" (o Backlog

🚀 Roadmap de Futuras Mejoras (To-Do List)

1. Gestión de Usuarios y Roles (Seguridad)
Login: Pantalla de acceso para que no cualquiera pueda modificar el stock.

Roles: Diferenciar entre Operario (solo MIGO y MB52) y Administrador (MM01 y borrado de registros).

Auditoría: Guardar en la base de datos qué usuario hizo cada movimiento en la MB51.

2. Multialmacén y Ubicaciones (WM)
Estructura: Poder definir diferentes almacenes (Ej: Almacén Central, Tienda A, Devoluciones).

Mapa Visual: Una pestaña que muestre un dibujo de las estanterías (Pasillo-Estante-Nivel) y qué hay en cada una.

3. Impresión de Etiquetas QR
Generación: Un botón en la MM01 para generar e imprimir una etiqueta con el código QR del SKU.

Integración: Que el escáner de la MIGO reconozca instantáneamente esos QRs para hacer entradas y salidas en segundos sin escribir nada.

4. Notificaciones Automáticas (Email/Telegram)
Stock de Seguridad: Que el sistema envíe un correo automático al jefe de compras cuando un material entre en "Stock Crítico".

Reporte Diario: Un resumen cada mañana con las entradas y salidas totales del día anterior.)