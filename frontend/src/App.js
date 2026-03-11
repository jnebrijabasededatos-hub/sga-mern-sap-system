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

// --- COMPONENTE: LOGIN ---
function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const handleEntrar = () => {
    if (user === "admin" && pass === "1234")
      onLogin({ nombre: "Admin-SAP", rol: "ADMIN" });
    else if (user === "operario" && pass === "4321")
      onLogin({ nombre: "Operario-Almacen", rol: "OPERARIO" });
    else alert("Credenciales incorrectas");
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
      }}
    >
      <div className="sap-card" style={{ width: "350px", textAlign: "center" }}>
        <h2 style={{ color: "#003366" }}>SGA ENTERPRISE LOGON</h2>
        <div
          className="sap-form"
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            placeholder="Usuario"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="sap-btn-primary" onClick={handleEntrar}>
            Acceder
          </button>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD ---
function Dashboard({ materiales, setTab }) {
  const stockTotal = materiales.reduce((acc, curr) => acc + curr.stock, 0);
  const stockCritico = materiales.filter((m) => m.stock < 5);
  const dataGrafico = {
    labels: materiales.map((m) => m.sku),
    datasets: [
      {
        label: "Stock Actual",
        data: materiales.map((m) => m.stock),
        backgroundColor: materiales.map((m) =>
          m.stock < 5 ? "rgba(211, 47, 47, 0.7)" : "rgba(10, 110, 209, 0.7)",
        ),
        borderColor: materiales.map((m) =>
          m.stock < 5 ? "#d32f2f" : "#0a6ed1",
        ),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="sap-kpi-card"
          style={{ borderLeft: "5px solid #0a6ed1" }}
        >
          <small>SKUs TOTALES</small>
          <h3>{materiales.length}</h3>
        </div>
        <div
          className="sap-kpi-card"
          style={{ borderLeft: "5px solid #2e7d32" }}
        >
          <small>STOCK FÍSICO</small>
          <h3>{stockTotal} UN</h3>
        </div>
        <div
          className="sap-kpi-card"
          style={{ borderLeft: "5px solid #d32f2f" }}
        >
          <small>STOCK CRÍTICO</small>
          <h3
            style={{ color: stockCritico.length > 0 ? "#d32f2f" : "inherit" }}
          >
            {stockCritico.length}
          </h3>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: "25px",
        }}
      >
        <div className="sap-card">
          <Bar data={dataGrafico} options={{ responsive: true }} />
        </div>
        <div className="sap-card" style={{ borderTop: "4px solid #d32f2f" }}>
          <h3 style={{ color: "#d32f2f", fontSize: "16px", marginTop: 0 }}>
            ⚠️ Alertas
          </h3>
          {stockCritico.length > 0 ? (
            stockCritico.map((m) => (
              <div
                key={m.sku}
                className="sap-alert-item"
                onClick={() => setTab("inventario")}
              >
                <strong>{m.sku}</strong>: {m.stock} unidades.
              </div>
            ))
          ) : (
            <p>Stock saludable.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MB52 (STOCK) ---
function Inventario({ materiales }) {
  const [busqueda, setBusqueda] = useState("");
  const filtrados = materiales.filter(
    (m) =>
      m.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  );
  return (
    <div className="sap-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>📊 MB52 - Listado de Stock</h2>
        <input
          className="sap-search-input"
          placeholder="🔍 Buscar..."
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <table className="sap-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Descripción</th>
            <th>Stock Global</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((m) => (
            <tr key={m.sku}>
              <td>
                <b>{m.sku}</b>
              </td>
              <td>{m.descripcion}</td>
              <td>{m.stock}</td>
              <td>
                <span
                  className="sap-badge"
                  style={{
                    background: m.stock < 5 ? "#fee2e2" : "#e0f2fe",
                    color: m.stock < 5 ? "#991b1b" : "#0369a1",
                  }}
                >
                  {m.stock < 5 ? "BAJO" : "OK"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- MIGO (MOVIMIENTOS MULTIALMACÉN) ---
function Movimientos({ refrescar, materiales, usuarioActual }) {
  const [form, setForm] = useState({
    sku: "",
    cantidad: "",
    almacen: "CENTRAL",
  });
  const [showScanner, setShowScanner] = useState(false);
  const almacenes = ["CENTRAL", "TIENDA_A", "DEVOLUCIONES", "PUESTA_EN_MARCHA"];

  const procesarMovimiento = async (tipo) => {
    const cant = Number(form.cantidad);
    if (!form.sku || cant <= 0) return alert("Datos inválidos.");

    if (tipo === "SALIDA") {
      const mat = materiales.find((m) => m.sku === form.sku);
      if (!mat || mat.stock < cant) return alert("❌ Stock insuficiente.");
    }

    try {
      await axios.put(`http://localhost:5000/api/movimiento/${form.sku}`, {
        cantidad: tipo === "SALIDA" ? -Math.abs(cant) : Math.abs(cant),
        usuario: usuarioActual.nombre,
        almacen: form.almacen,
      });
      alert(`✅ Movimiento registrado en ${form.almacen}`);
      setForm({ ...form, sku: "", cantidad: "" });
      refrescar();
    } catch (err) {
      alert("❌ Error.");
    }
  };

  return (
    <div className="sap-card">
      <h2>🚚 MIGO - Movimiento de Mercancía</h2>
      <div className="sap-form" style={{ display: "grid", gap: "15px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={form.almacen}
            onChange={(e) => setForm({ ...form, almacen: e.target.value })}
            style={{ flex: 1, padding: "10px" }}
          >
            {almacenes.map((a) => (
              <option key={a} value={a}>
                📍 Almacén: {a}
              </option>
            ))}
          </select>
          <button
            className="sap-btn-secondary"
            onClick={() => setShowScanner(!showScanner)}
          >
            📷 Escanear
          </button>
        </div>
        {showScanner && (
          <Scanner
            onResult={(res) => {
              setForm({ ...form, sku: res });
              setShowScanner(false);
            }}
          />
        )}
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="sap-btn-primary"
            style={{ background: "#16a34a", flex: 1 }}
            onClick={() => procesarMovimiento("ENTRADA")}
          >
            📥 Entrada
          </button>
          <button
            className="sap-btn-primary"
            style={{ background: "#dc2626", flex: 1 }}
            onClick={() => procesarMovimiento("SALIDA")}
          >
            📤 Salida
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MB51 (HISTORIAL COMPLETO) ---
function Historial({ datos }) {
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte MB51 - Auditoría SGA", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Fecha", "SKU", "Tipo", "Cant", "Almacén", "Usuario"]],
      body: datos.map((h) => [
        new Date(h.fecha).toLocaleString(),
        h.sku,
        h.tipo,
        h.cantidad,
        h.almacen,
        h.usuario,
      ]),
    });
    doc.save("MB51_Reporte.pdf");
  };
  return (
    <div className="sap-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <h2>📜 MB51 - Documentos de Material</h2>
        <button className="sap-btn-pdf" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>
      <table className="sap-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>SKU</th>
            <th>Tipo</th>
            <th>Cant</th>
            <th>Almacén</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((h, i) => (
            <tr key={i}>
              <td>{new Date(h.fecha).toLocaleString()}</td>
              <td>{h.sku}</td>
              <td
                style={{ color: h.tipo === "ENTRADA" ? "#16a34a" : "#dc2626" }}
              >
                {h.tipo}
              </td>
              <td>{h.cantidad}</td>
              <td>
                <span className="sap-badge" style={{ background: "#f1f5f9" }}>
                  {h.almacen}
                </span>
              </td>
              <td>
                <small>{h.usuario}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- MM01 (ADMIN + QR) ---
function MaestroMaterial({ alCrear }) {
  const [nuevo, setNuevo] = useState({ sku: "", descripcion: "" });
  const [ultimoQR, setUltimoQR] = useState(null);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/material", nuevo);
      setUltimoQR(nuevo.sku);
      alert("✅ Material Creado");
      alCrear();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="sap-card">
      <h2>🛠️ MM01 - Creación de Material</h2>
      <form onSubmit={guardar} className="sap-form">
        <input
          placeholder="SKU"
          value={nuevo.sku}
          onChange={(e) => setNuevo({ ...nuevo, sku: e.target.value })}
          required
        />
        <input
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          required
        />
        <button className="sap-btn-primary" type="submit">
          Grabar Material
        </button>
      </form>
      {ultimoQR && (
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            border: "1px dashed #0a6ed1",
            padding: "15px",
          }}
        >
          <h4>🏷️ QR Generado para {ultimoQR}</h4>
          <QRCodeSVG value={ultimoQR} size={120} />
          <br />
          <button
            className="sap-btn-secondary"
            style={{ marginTop: "10px" }}
            onClick={() => window.print()}
          >
            Imprimir Etiqueta
          </button>
        </div>
      )}
    </div>
  );
}

// --- APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [tab, setTab] = useState("dashboard");

  const fetchData = async () => {
    try {
      const rs = await axios.get("http://localhost:5000/api/stock");
      const rh = await axios.get("http://localhost:5000/api/historial");
      setMateriales(rs.data);
      setHistorial(rh.data);
    } catch (e) {
      console.error("Error");
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          background: "#003366",
          color: "white",
          padding: "12px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>SAP SGA | {user.rol}</h1>
        <div>
          👤 {user.nombre} |{" "}
          <button
            onClick={() => setUser(null)}
            style={{
              background: "none",
              color: "white",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Salir
          </button>
        </div>
      </header>
      <nav className="sap-nav">
        <button
          onClick={() => setTab("dashboard")}
          className={tab === "dashboard" ? "active" : ""}
        >
          🏠 Dashboard
        </button>
        <button
          onClick={() => setTab("inventario")}
          className={tab === "inventario" ? "active" : ""}
        >
          📊 MB52
        </button>
        <button
          onClick={() => setTab("migo")}
          className={tab === "migo" ? "active" : ""}
        >
          🚚 MIGO
        </button>
        <button
          onClick={() => setTab("mb51")}
          className={tab === "mb51" ? "active" : ""}
        >
          📜 MB51
        </button>
        {user.rol === "ADMIN" && (
          <button
            onClick={() => setTab("mm01")}
            className={tab === "mm01" ? "active" : ""}
          >
            🛠️ MM01
          </button>
        )}
      </nav>
      <main style={{ padding: "25px", flex: 1 }}>
        {tab === "dashboard" && (
          <Dashboard materiales={materiales} setTab={setTab} />
        )}
        {tab === "inventario" && <Inventario materiales={materiales} />}
        {tab === "migo" && (
          <Movimientos
            refrescar={fetchData}
            materiales={materiales}
            usuarioActual={user}
          />
        )}
        {tab === "mb51" && <Historial datos={historial} />}
        {tab === "mm01" && user.rol === "ADMIN" && (
          <MaestroMaterial alCrear={fetchData} />
        )}
      </main>
      <footer className="sap-footer">
        <div>© 2024 SGA SAP MERN</div>
        <div>
          Almacén Actual: {user.rol === "ADMIN" ? "GLOBAL" : "SECTORIZADO"}
        </div>
      </footer>
      <style>{`.sap-nav { background: white; display: flex; border-bottom: 2px solid #e2e8f0; }.sap-nav button { padding: 16px 25px; border: none; background: none; cursor: pointer; font-weight: bold; color: #64748b; border-bottom: 3px solid transparent; }.sap-nav button.active { color: #0a6ed1; border-bottom: 3px solid #0a6ed1; }.sap-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid #0a6ed1; margin-bottom: 20px; }.sap-table { width: 100%; border-collapse: collapse; }.sap-table th { background: #f8fafc; padding: 12px; text-align: left; font-size: 13px; border-bottom: 2px solid #e2e8f0; }.sap-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }.sap-kpi-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }.sap-alert-item { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-bottom: 8px; }.sap-btn-primary { background: #0a6ed1; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }.sap-btn-secondary { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 15px; border-radius: 4px; cursor: pointer; }.sap-btn-pdf { background: #991b1b; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }.sap-form input, .sap-form select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none; }.sap-search-input { padding: 8px 15px; border-radius: 20px; border: 1px solid #cbd5e1; width: 250px; }.sap-footer { background: #1e293b; color: #94a3b8; padding: 15px 25px; font-size: 12px; display: flex; justify-content: space-between; border-top: 4px solid #0a6ed1; }.sap-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }`}</style>
    </div>
  );
}
