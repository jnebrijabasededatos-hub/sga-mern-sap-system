const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Material = require("./models/Material");
const Movimiento = require("./models/Movimiento");

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE NODEMAILER ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jnebrijabasededatos@gmail.com",
    pass: "vowjhgquzuditnqe", // Tu clave de 16 letras
  },
});

const enviarAlertaStock = async (sku, stockActual) => {
  const mailOptions = {
    from: "jnebrijabasededatos@gmail.com", // Remitente
    to: "jnebrijabasededatos@gmail.com", // Destinatario (Tú mismo)
    subject: `🚨 ALERTA: Stock Crítico en SKU ${sku}`,
    html: `
      <div style="font-family: sans-serif; border: 2px solid #d32f2f; padding: 20px; border-radius: 10px;">
        <h2 style="color: #d32f2f;">Reposición Urgente</h2>
        <p>El material <b>${sku}</b> ha bajado del límite de seguridad.</p>
        <p>Stock actual: <span style="font-size: 20px; color: red;"><b>${stockActual}</b></span></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "✅ Correo enviado correctamente a jnebrijabasededatos@gmail.com",
    );
  } catch (error) {
    console.error("❌ Error enviando correo:", error.message);
  }
};

// --- CONEXIÓN BD ---
mongoose
  .connect("mongodb://localhost:27017/sga_db")
  .then(() => console.log("📦 Conectado a MongoDB"))
  .catch((err) => console.error(err));

// --- RUTAS ---

app.get("/api/stock", async (req, res) => {
  const materiales = await Material.find();
  res.json(materiales);
});

app.get("/api/historial", async (req, res) => {
  const movimientos = await Movimiento.find().sort({ fecha: -1 });
  res.json(movimientos);
});

app.post("/api/material", async (req, res) => {
  const nuevo = new Material(req.body);
  await nuevo.save();
  res.json({ message: "Creado" });
});

app.put("/api/movimiento/:sku", async (req, res) => {
  const { cantidad, usuario, almacen } = req.body;

  // Actualizado para evitar el warning de Mongoose
  const material = await Material.findOneAndUpdate(
    { sku: req.params.sku },
    { $inc: { stock: cantidad } },
    { returnDocument: "after" },
  );

  if (material) {
    const nuevoMov = new Movimiento({
      sku: material.sku,
      cantidad: Math.abs(cantidad),
      tipo: cantidad > 0 ? "ENTRADA" : "SALIDA",
      usuario: usuario,
      almacen: almacen,
    });
    await nuevoMov.save();

    // Lógica de alerta
    if (cantidad < 0 && material.stock < 5) {
      console.log(`Intentando enviar alerta para ${material.sku}...`);
      enviarAlertaStock(material.sku, material.stock);
    }

    res.json(material);
  } else {
    res.status(404).json({ message: "No encontrado" });
  }
});

app.listen(5000, () =>
  console.log("🚀 Servidor SGA funcionando en puerto 5000"),
);
