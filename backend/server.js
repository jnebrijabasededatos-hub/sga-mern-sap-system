// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Material = require("./models/Material");
const Movimiento = require("./models/Movimiento");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (Usa tu cadena de conexión de MongoDB Atlas o local)
mongoose
  .connect("mongodb://localhost:27017/sga_db")
  .then(() => console.log("📦 Conectado a la BD de Almacén"))
  .catch((err) => console.error(err));

// --- RUTAS TIPO SAP MM ---
//0.Nuevo ruta para obtener el historial (MB51)
app.get("/api/historial", async (req, res) => {
  const movimientos = await Movimiento.find().sort({ fecha: -1 }); // Los más recientes primero
  res.json(movimientos);
});
// 1. Ver todo el Inventario (Equivalente a MB52)
app.get("/api/stock", async (req, res) => {
  const materiales = await Material.find();
  res.json(materiales);
});

// 2. Crear nuevo Material (Equivalente a MM01)
app.post("/api/material", async (req, res) => {
  const nuevo = new Material(req.body);
  await nuevo.save();
  res.json({ message: "Material creado" });
});

// 3. Movimiento de Mercancía (Equivalente a MIGO - Entrada/Salida)
app.put("/api/movimiento/:sku", async (req, res) => {
  const { cantidad } = req.body; // Positivo para entrada, negativo para salida

  const material = await Material.findOneAndUpdate(
    { sku: req.params.sku },
    { $inc: { stock: cantidad } },
    { new: true },
  );
  if (material) {
    //CREAR REGISTRO EN EL HISTORIAL

    const nuevoMov = new Movimiento({
      sku: material.sku,
      cantidad: Math.abs(cantidad),
      tipo: cantidad > 0 ? "ENTRADA" : "SALIDA",
    });
    await nuevoMov.save();
    res.json(material);
  } else {
    res.status(404).json({ message: "Material no encontrado" });
  }
});

app.listen(5000, () => console.log("🚀 Servidor corriendo en puerto 5000"));
