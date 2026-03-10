// backend/models/Material.js
const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, default: 0 },
  ubicacion: { type: String, default: "RECEPCION" },
  unidad: { type: String, default: "ST" }, // ST = Unidades en SAP
});

module.exports = mongoose.model("Material", MaterialSchema);
