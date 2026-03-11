# 📦 SGA MERN - Enterprise Warehouse Management System

Este es un Sistema de Gestión de Almacenes (SGA) inspirado en la interfaz y lógica de **SAP ERP**, desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js).

## 🚀 Funcionalidades Principales (Módulos SAP)

El sistema replica las transacciones críticas de un entorno logístico real:

- **🏠 Dashboard (BI):** Panel de control con indicadores clave (KPIs) y gráficos dinámicos (**Chart.js**) que muestran los niveles de stock por SKU. Incluye un sistema de **Alertas de Stock Crítico** (< 5 unidades).
- **📊 MB52 (Listado de Stock):** Consulta de inventario en tiempo real con buscador dinámico por SKU o descripción.
- **🚚 MIGO (Movimientos):** Módulo de entradas y salidas de mercancía.
  - _Entradas:_ Aumentan el stock mediante botón dedicado.
  - _Salidas:_ Reducen el stock automáticamente al procesar el consumo.
  - _Escáner:_ Integración con cámara para lectura de códigos de barras.
- **📜 MB51 (Historial):** Registro detallado de todos los movimientos con opción de **Exportación a PDF** profesional (jsPDF).
- **🛠️ MM01 (Maestro de Materiales):** Alta de nuevos productos en la base de datos centralizada.

Login Real (Simulado): Ahora tienes una puerta de entrada.

Si entras con admin / 1234, verás todas las pestañas.

Si entras con operario / 4321, la pestaña MM01 (Crear Material) desaparecerá.

Auditoría (MB51): En la tabla de historial ahora verás una nueva columna que dice quién hizo el movimiento (admin u operario).

Etiquetas QR (MM01): Al crear un material, se genera automáticamente un código QR que puedes imprimir.

Botón Salir: En la cabecera puedes cerrar sesión.

Multialmacén: En la MIGO puedes elegir entre 4 almacenes. El historial (MB51) ahora registra el almacén exacto de cada operación.

Seguridad por Roles: El operario no puede crear materiales ni ver la pestaña MM01.

Auditoría: Cada movimiento guarda el nombre del usuario que lo realizó.

Generación de QR: Al crear un material, aparece el código QR listo para imprimir

## 🛠️ Stack Tecnológico

- **Frontend:** React.js (Hooks, Functional Components).
- **Backend:** Node.js + Express.js.
- **Base de Datos:** MongoDB Atlas (NoSQL).
- **Gráficos:** React-Chartjs-2.
- **Reportes:** jsPDF + AutoTable.
- **Estilos:** CSS-in-JS con diseño inspirado en **SAP Fiori**.

## ⚙️ Cómo ejecutar el proyecto

### 1. Backend

1. Navega a la carpeta `/backend`.
2. Instala dependencias: `npm install`.
3. Ejecuta el servidor: `node server.js` o `npm start`.
   _(El servidor corre en el puerto 5000)_.

### 2. Frontend

1. Navega a la carpeta `/frontend`.
2. Instala dependencias: `npm install`.
3. Ejecuta la app: `npm start`.
   _(La app corre en el puerto 3000)_.

## 📌 Notas para el futuro

- Para las **Salidas** en la MIGO, el sistema convierte automáticamente el número a negativo para mantener la integridad del historial.
- El **Escáner** requiere permisos de cámara en el navegador.
- Si el Dashboard dice "No hay datos", verificar que el backend esté conectado a MongoDB Atlas.

---

Desarrollado con 💻 y lógicas de SAP.

Mejoras Pendientes" (o Backlog)
