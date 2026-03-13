const mongoose = require("mongoose");
const MovimientoSchema = new mongoose.Schema({
  sku: String,
  cantidad: Number,
  tipo: String,
  usuario: String,
  almacen: String,
  fecha: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Movimiento", MovimientoSchema);
