# SAP SGA MERN - Sistema de Gestión de Almacenes

Este es un sistema **SGA (Sistema de Gestión de Almacenes)** inspirado en la interfaz de SAP, desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js). El sistema permite gestionar inventarios multialmacén, trazabilidad de movimientos y alertas automáticas.

## 🚀 Características Principales

- **Dashboard de Control:** Visualización de KPIs y gráficas de stock en tiempo real (Chart.js).
- **Gestión Multialmacén:** Capacidad para mover mercancía entre diferentes ubicaciones (Central, Tiendas, Devoluciones).
- **Transacciones SAP-Style:**
  - **MM01:** Creación de materiales con generación automática de códigos QR.
  - **MIGO:** Registro de entradas y salidas de mercancía con auditoría de usuario.
  - **MB52:** Reporte de stock actual con filtros de búsqueda.
  - **MB51:** Historial detallado de movimientos (Documentos de material) con exportación a **PDF**.
- **Alertas Inteligentes:** Integración con **Nodemailer** para envío automático de correos cuando el stock baja de los niveles de seguridad (5 unidades).
- **Seguridad:** Login basado en roles (Admin / Operario).

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Axios, Chart.js, Lucide Icons, JsPDF.
- **Backend:** Node.js, Express, Nodemailer.
- **Base de Datos:** MongoDB (Mongoose).
- **Seguridad:** Dotenv para gestión de credenciales sensibles.

## 📦 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/sga-mern.git
   ```
