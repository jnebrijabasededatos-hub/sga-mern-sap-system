import React, { useState, useEffect } from "react";
import axios from "axios";
import Scanner from "./Scanner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QRCodeSVG } from "qrcode.react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const COLORES = {
  primario: "#14b8a6",
  oscuro: "#0d2b4d",
  fondo: "#f1f5f9",
  blanco: "#ffffff",
  rojo: "#ef4444",
  verde: "#10b981",
};

// IMPORTANTE: Al estar en /public, la ruta es simplemente "/"
const LOGO_LOCAL = "/CaPaNiWa.png";

function Login({ alEntrar }) {
  const [usuario, setUsuario] = useState("");
  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <div className="contenedor-logo-gigante">
          <img
            src={LOGO_LOCAL}
            alt="Logo CaPaNiWa"
            className="logo-login-gigante"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x300?text=CaPaNiWa+Tech";
            }}
          />
        </div>
        <div className="seccion-datos-login">
          <h1
            style={{
              color: COLORES.oscuro,
              margin: "0 0 5px 0",
              fontSize: "28px",
            }}
          >
            CaPaNiWa Tech
          </h1>
          <p
            style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px" }}
          >
            Gestión de Inventarios 2026
          </p>
          <div className="formulario-login">
            <input
              placeholder="Nombre de Usuario"
              onChange={(e) => setUsuario(e.target.value)}
            />
            <input type="password" placeholder="Contraseña de Acceso" />
            <button
              className="boton-primario"
              onClick={() =>
                alEntrar({
                  nombre: usuario,
                  rol: usuario === "admin" ? "ADMIN" : "OPERARIO",
                })
              }
            >
              INGRESAR AL SISTEMA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelControl({ materiales, historial }) {
  const stockTotal = materiales.reduce((acc, m) => acc + m.stock, 0);
  const movPorAlmacen = historial.reduce((acc, mov) => {
    const loc = mov.almacen || "CENTRAL";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const datosGrafico = {
    labels: materiales.map((m) => m.sku),
    datasets: [
      {
        label: "Stock Actual",
        data: materiales.map((m) => m.stock),
        backgroundColor: COLORES.primario,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="animar-entrada">
      <div className="fila-kpi">
        <div className="tarjeta-kpi">
          <span>Inventario Total</span>
          <h3>
            {stockTotal} <small>uds</small>
          </h3>
        </div>
        <div className="tarjeta-kpi">
          <span>Modelos (SKU)</span>
          <h3>{materiales.length}</h3>
        </div>
        <div
          className="tarjeta-kpi"
          style={{ borderLeft: `5px solid ${COLORES.primario}` }}
        >
          <span>Servidor</span>
          <h3 style={{ color: COLORES.primario }}>CONECTADO</h3>
        </div>
      </div>
      <div className="cuadricula-dashboard">
        <div className="tarjeta-blanca">
          <h3>📊 Niveles de Existencias</h3>
          <div style={{ height: "280px" }}>
            <Bar data={datosGrafico} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="tarjeta-blanca">
          <h3>📍 Actividad de Almacenes</h3>
          {Object.entries(movPorAlmacen).map(([nombre, total]) => (
            <div key={nombre} className="item-calor">
              <div className="info-calor">
                <span>{nombre}</span>
                <span>{total} movs.</span>
              </div>
              <div className="barra-progreso">
                <div
                  className="relleno-progreso"
                  style={{
                    width: `${(total / (historial.length || 1)) * 100}%`,
                    background: COLORES.oscuro,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Movimientos({ refrescar, usuarioActual }) {
  const [form, setForm] = useState({
    sku: "",
    cantidad: "",
    almacen: "CENTRAL",
  });
  const [verEscaner, setVerEscaner] = useState(false);

  const ejecutarMovimiento = async (tipo) => {
    if (!form.sku || !form.cantidad)
      return alert("Por favor, rellena todos los campos");
    const qty =
      tipo === "SALIDA" ? -Math.abs(form.cantidad) : Math.abs(form.cantidad);
    try {
      await axios.put(`http://localhost:5000/api/movimiento/${form.sku}`, {
        cantidad: qty,
        usuario: usuarioActual.nombre,
        almacen: form.almacen,
      });
      alert(`Éxito: Registro de ${tipo} completado`);
      setForm({ sku: "", cantidad: "", almacen: "CENTRAL" });
      refrescar();
    } catch (e) {
      alert("Error: El código SKU no existe");
    }
  };

  return (
    <div className="tarjeta-blanca animar-entrada">
      <h2>🚚 Registro de Entradas y Salidas</h2>
      <button
        className="boton-escaner"
        onClick={() => setVerEscaner(!verEscaner)}
      >
        📷 Escanear Código QR
      </button>
      {verEscaner && (
        <div className="caja-escaner">
          <Scanner
            onResult={(res) => {
              setForm({ ...form, sku: res });
              setVerEscaner(false);
            }}
          />
        </div>
      )}
      <div className="layout-formulario">
        <div className="campo">
          <label>Código SKU</label>
          <input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>
        <div className="campo">
          <label>Cantidad</label>
          <input
            type="number"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />
        </div>
        <div className="campo">
          <label>Destino/Origen</label>
          <select
            value={form.almacen}
            onChange={(e) => setForm({ ...form, almacen: e.target.value })}
          >
            <option value="CENTRAL">Almacén Central</option>
            <option value="LAB_A">Laboratorio A</option>
            <option value="TIENDA">Tienda Física</option>
            <option value="ANULACIONES">⚠️ ANULACIONES</option>
          </select>
        </div>
      </div>
      <div className="grupo-botones">
        <button
          onClick={() => ejecutarMovimiento("ENTRADA")}
          className="btn-entrada"
        >
          📥 ENTRADA DE STOCK
        </button>
        <button
          onClick={() => ejecutarMovimiento("SALIDA")}
          className="btn-salida"
        >
          📤 SALIDA DE STOCK
        </button>
      </div>
    </div>
  );
}

function Historial({ datos }) {
  return (
    <div className="tarjeta-blanca animar-entrada">
      <h2>📜 Registro Histórico (Auditoría)</h2>
      <table className="tabla-moderna">
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((h, i) => (
            <tr key={i}>
              <td>{new Date(h.fecha).toLocaleString()}</td>
              <td>
                <b>{h.sku}</b>
              </td>
              <td>
                <span className={`etiqueta ${h.tipo}`}>{h.tipo}</span>
              </td>
              <td>{h.cantidad}</td>
              <td>{h.almacen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Maestro({ alCrear }) {
  const [sku, setSku] = useState("");
  const [desc, setDesc] = useState("");
  const [prov, setProv] = useState("CaPaNiWa Tech");
  const [creado, setCreado] = useState(false);

  const guardar = async () => {
    await axios.post("http://localhost:5000/api/material", {
      sku,
      descripcion: desc,
      proveedor: prov,
      stock: 0,
    });
    setCreado(true);
    alCrear();
  };

  return (
    <div className="tarjeta-blanca animar-entrada">
      <h2>🛠 Registro de Nuevos Materiales</h2>
      <div className="layout-formulario">
        <div className="campo">
          <label>SKU (Código único)</label>
          <input onChange={(e) => setSku(e.target.value)} />
        </div>
        <div className="campo">
          <label>Descripción del Producto</label>
          <input onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="campo">
          <label>Proveedor Asignado</label>
          <select onChange={(e) => setProv(e.target.value)}>
            <option value="CaPaNiWa Tech">CaPaNiWa Tech</option>
            <option value="Logística Global">Logística Global</option>
          </select>
        </div>
      </div>
      <button onClick={guardar} className="boton-primario">
        REGISTRAR EN MAESTRO
      </button>
      {creado && (
        <div className="caja-qr">
          <p>Código Generado para {sku}:</p>
          <QRCodeSVG value={sku} size={100} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [seccion, setSeccion] = useState("dashboard");

  const cargarDatos = async () => {
    try {
      const rs = await axios.get("http://localhost:5000/api/stock");
      const rh = await axios.get("http://localhost:5000/api/historial");
      setMateriales(rs.data);
      setHistorial(rh.data);
    } catch (e) {
      console.error("Error conectando con la API");
    }
  };

  useEffect(() => {
    if (usuario) cargarDatos();
  }, [usuario]);

  if (!usuario) return <Login alEntrar={setUsuario} />;

  return (
    <div className="contenedor-app">
      <header className="cabecera">
        <div className="marca">
          <img src={LOGO_LOCAL} alt="CPNW" style={{ height: "40px" }} />
          <h1>
            CaPaNiWa{" "}
            <span style={{ fontWeight: 300, color: "white" }}>Tech</span>
          </h1>
        </div>
        <div className="usuario-info">
          <span>
            Bienvenido, <b>{usuario.nombre}</b>
          </span>
          <button className="btn-salir" onClick={() => setUsuario(null)}>
            Salir
          </button>
        </div>
      </header>
      <nav className="navegacion">
        <button
          onClick={() => setSeccion("dashboard")}
          className={seccion === "dashboard" ? "activo" : ""}
        >
          Panel Control
        </button>
        <button
          onClick={() => setSeccion("migo")}
          className={seccion === "migo" ? "activo" : ""}
        >
          Movimientos
        </button>
        <button
          onClick={() => setSeccion("mb51")}
          className={seccion === "mb51" ? "activo" : ""}
        >
          Historial
        </button>
        {usuario.rol === "ADMIN" && (
          <button
            onClick={() => setSeccion("mm01")}
            className={seccion === "mm01" ? "activo" : ""}
          >
            Maestro Materiales
          </button>
        )}
      </nav>
      <main className="contenido">
        {seccion === "dashboard" && (
          <PanelControl materiales={materiales} historial={historial} />
        )}
        {seccion === "migo" && (
          <Movimientos refrescar={cargarDatos} usuarioActual={usuario} />
        )}
        {seccion === "mb51" && <Historial datos={historial} />}
        {seccion === "mm01" && <Maestro alCrear={cargarDatos} />}
      </main>
      <style>{`
        body { margin: 0; font-family: 'Inter', sans-serif; background: ${COLORES.fondo}; }
        .cabecera { background: ${COLORES.oscuro}; color: white; padding: 10px 40px; display: flex; justify-content: space-between; align-items: center; }
        .marca { display: flex; align-items: center; gap: 15px; }
        .marca h1 { margin: 0; font-size: 24px; color: ${COLORES.primario}; }
        .navegacion { background: white; padding: 0 40px; display: flex; gap: 25px; border-bottom: 1px solid #e2e8f0; }
        .navegacion button { padding: 18px 0; border: none; background: none; font-weight: bold; cursor: pointer; color: #64748b; font-size: 15px; }
        .navegacion button.activo { color: ${COLORES.primario}; border-bottom: 3px solid ${COLORES.primario}; }
        .contenido { padding: 30px 40px; max-width: 1200px; margin: 0 auto; }
        .tarjeta-blanca { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 25px; }
        .fila-kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; }
        .tarjeta-kpi { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .tarjeta-kpi span { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .tarjeta-kpi h3 { margin: 10px 0 0; font-size: 28px; color: ${COLORES.oscuro}; }
        .cuadricula-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
        .item-calor { margin-bottom: 15px; }
        .info-calor { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; }
        .barra-progreso { background: #f1f5f9; height: 10px; border-radius: 10px; overflow: hidden; margin-top: 6px; }
        .relleno-progreso { height: 100%; transition: 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .layout-formulario { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0; }
        .campo label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 8px; color: #475569; }
        input, select { width: 100%; padding: 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 15px; }
        .grupo-botones { display: flex; gap: 20px; }
        .btn-entrada { background: ${COLORES.verde}; color: white; flex: 1; padding: 18px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; font-size: 16px; }
        .btn-salida { background: ${COLORES.rojo}; color: white; flex: 1; padding: 18px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; font-size: 16px; }
        .boton-primario { background: ${COLORES.primario}; color: white; border: none; padding: 16px; border-radius: 10px; width: 100%; font-weight: bold; cursor: pointer; font-size: 16px; }
        .boton-escaner { background: ${COLORES.oscuro}; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; margin-bottom: 15px; }
        .tabla-moderna { width: 100%; border-collapse: collapse; }
        .tabla-moderna th { text-align: left; padding: 18px; background: #f8fafc; font-size: 13px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
        .tabla-moderna td { padding: 18px; border-bottom: 1px solid #f1f5f9; }
        .etiqueta { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .ENTRADA { background: #dcfce7; color: #166534; }
        .SALIDA { background: #fee2e2; color: #991b1b; }
        .btn-salir { background: #ffffff22; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-left: 15px; font-weight: bold; }
        
        /* DISEÑO LOGIN GIGANTE IMPACTANTE */
        .contenedor-login { height: 100vh; background: ${COLORES.oscuro}; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .tarjeta-login { background: white; border-radius: 50px; width: 100%; max-width: 900px; height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.6); }
        .contenedor-logo-gigante { flex: 3; background: #fff; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .logo-login-gigante { width: 100%; height: 100%; object-fit: contain; transform: scale(1.1); }
        .seccion-datos-login { flex: 2; padding: 40px; display: flex; flex-direction: column; align-items: center; background: #f8fafc; border-top: 1px solid #eee; }
        .formulario-login { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 15px; }
        .animar-entrada { animation: aparecer 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes aparecer { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
