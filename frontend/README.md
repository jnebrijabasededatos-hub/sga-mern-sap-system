📦 SGA CaPaNiWa Tech - Gestión de Inventarios 2026🚀

Sobre el ProyectoCaPaNiWa Tech es una solución integral de Sistema de Gestión de Almacenes (SGA) diseñada para optimizar el control de existencias, movimientos de mercancía y auditoría en tiempo real. Este software utiliza el stack MERN (MongoDB, Express, React, Node.js) para ofrecer una experiencia fluida, robusta y escalable.

El sistema permite la automatización de alertas de stock crítico mediante correo electrónico y la generación de etiquetas QR para la identificación de materiales.

🛠️ Funcionalidades Principales

1. Panel de Control (Dashboard)KPIs en tiempo real: Visualización del stock total global y número de productos activos.Gráficos de Barras: Comparativa visual de niveles de existencias por SKU.Mapa de Calor de Almacenes: Control de flujo y movimientos por cada ubicación física (Central, Laboratorio, Tienda).

2. Gestión de Movimientos (MIGO)Entradas y Salidas: Interfaz simplificada para registrar aumentos o disminuciones de inventario.
   Escáner QR: Integración con la cámara para lectura rápida de códigos de barras/QR de los productos.Trazabilidad: Cada movimiento queda vinculado a un usuario y a un almacén específico.

3. Registro de Maestros (MM01)Alta de nuevos productos en la base de datos.Generación automática de códigos QR únicos para cada material.Asignación de proveedores oficiales.

4. Historial de Auditoría (MB51)Listado detallado de todas las transacciones realizadas.Exportación de reportes profesionales en formato PDF.

🔐 Acceso al SistemaEl sistema cuenta con un control de acceso basado en el nombre de usuario para definir privilegios.Credenciales Predeterminadas:Rol de UsuarioUsuario (ID)

ContraseñaPrivilegios Administradoradmin(Cualquiera)

Acceso total: Dashboard, MIGO, MB51 y MM01

.Operariooperario(Cualquiera)Acceso a Movimientos e Historial. No puede crear productos.

Nota: En esta versión de desarrollo, el campo contraseña está habilitado para validación visual. El rol se define escribiendo "admin" en el campo de usuario.

📧 Sistema de Alertas AutomáticasEl sistema monitoriza el stock de forma inteligente.Umbral Crítico: <

5 unidades.Acción: Al llegar al umbral, el servidor envía un correo automático a la dirección configurada (jnebrijabasededatos@gmail.com) detallando el SKU y el stock restante para proceder a la reposición.

🏗️ Estructura TécnicaRequisitos Previos:MongoDB: Debe estar corriendo en localhost:27017.Node.js: Versión 16 o superior.Instalación y Puesta en Marcha:Clonar el repositorio:Bashgit clone https://github.com/tu-usuario/SGA-MERN.git
Configurar el Backend:Bashcd backend
npm install
node server.js

Configurar el Frontend:Bashcd frontend

npm install
npm start

📂 Directorios Clavebackend/models/: Esquemas de base de datos (Materiales y Movimientos).backend/server.js: Lógica de la API y envío de correos.frontend/src/App.js: Interfaz de usuario y diseño principal.frontend/public/CaPaNiWa.png: Logo corporativo del sistema.

⚖️ LicenciaEste proyecto es propiedad exclusiva de CaPaNiWa Tech Inc. Queda prohibida su reproducción total o parcial sin autorización expresa.Desarrollado por: CaPaNiWa Tech Team 2026.Contacto: jnebrijabasededatos@gmail.com
