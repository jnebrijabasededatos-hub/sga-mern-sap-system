const mongoose = require("mongoose");
const MaterialSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  descripcion: String,
  stock: { type: Number, default: 0 },
  proveedor: String,
  fecha: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Material", MaterialSchema);
