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

// CONFIGURACIÓN DE CORREO
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "jnebrijabasededatos@gmail.com", pass: "vowjhgquzuditnqe" },
});

const enviarAlerta = async (sku, stock) => {
  const material = await Material.findOne({ sku });
  const mailOptions = {
    from: "SGA CaPaNiWa Tech",
    to: "jnebrijabasededatos@gmail.com",
    subject: `⚠️ ALERTA DE STOCK BAJO: ${sku}`,
    html: `<h2>Aviso de Inventario Crítico</h2><p>El producto <b>${sku}</b> ha bajado de las 5 unidades. Stock actual: <b>${stock}</b>.</p>`
  };
  transporter.sendMail(mailOptions);
};

// CONEXIÓN DB
mongoose.connect("mongodb://localhost:27017/sga_db");

app.get("/api/stock", async (req, res) => res.json(await Material.find()));
app.get("/api/historial", async (req, res) => res.json(await Movimiento.find().sort({ fecha: -1 })));

app.post("/api/material", async (req, res) => {
  const nuevo = new Material(req.body);
  await nuevo.save();
  res.json(nuevo);
});

app.put("/api/movimiento/:sku", async (req, res) => {
  const { cantidad, usuario, almacen } = req.body;
  const material = await Material.findOneAndUpdate(
    { sku: req.params.sku },
    { $inc: { stock: cantidad } },
    { new: true }
  );
  if (material) {
    const mov = new Movimiento({ 
      sku: material.sku, 
      cantidad: Math.abs(cantidad), 
      tipo: cantidad > 0 ? "ENTRADA" : "SALIDA", 
      usuario, 
      almacen 
    });
    await mov.save();
    if (material.stock < 5) enviarAlerta(material.sku, material.stock);
    res.json(material);
  } else {
    res.status(404).send("SKU no encontrado");
  }
});

app.listen(5000, () => console.log("Servidor CaPaNiWa activo en puerto 5000"));