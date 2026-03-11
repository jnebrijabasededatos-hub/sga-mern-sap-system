const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Material = require("./models/Material");
const Movimiento = require("./models/Movimiento");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/sga_db")
  .then(() => console.log("📦 Conectado a BD: Multialmacén y Auditoría Activa"))
  .catch((err) => console.error(err));

// --- MB51: Historial con Almacén y Usuario ---
app.get("/api/historial", async (req, res) => {
  const movimientos = await Movimiento.find().sort({ fecha: -1 });
  res.json(movimientos);
});

// --- MB52: Stock General ---
app.get("/api/stock", async (req, res) => {
  const materiales = await Material.find();
  res.json(materiales);
});

// --- MM01: Crear Material ---
app.post("/api/material", async (req, res) => {
  const nuevo = new Material(req.body);
  await nuevo.save();
  res.json({ message: "Material creado en el maestro" });
});

// --- MIGO: Movimiento Multialmacén ---
app.put("/api/movimiento/:sku", async (req, res) => {
  const { cantidad, usuario, almacen } = req.body;

  const material = await Material.findOneAndUpdate(
    { sku: req.params.sku },
    { $inc: { stock: cantidad } },
    { new: true },
  );

  if (material) {
    const nuevoMov = new Movimiento({
      sku: material.sku,
      cantidad: Math.abs(cantidad),
      tipo: cantidad > 0 ? "ENTRADA" : "SALIDA",
      usuario: usuario || "Sistema",
      almacen: almacen || "GENERAL", // Guardamos el almacén de origen/destino
    });
    await nuevoMov.save();
    res.json(material);
  } else {
    res.status(404).json({ message: "SKU no existe" });
  }
});

app.listen(5000, () => console.log("🚀 Server Multialmacén en puerto 5000"));
