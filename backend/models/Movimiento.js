const mongoose = require("mongoose");

const MovimientoSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  cantidad: { type: Number, required: true },
  tipo: { type: String, enum: ["ENTRADA", "SALIDA"], required: true },
  fecha: { type: Date, default: Date.now },
  usuario: { type: String, default: "Operario_Almacen" }, // Aquí podrías luego meter login
});

module.exports = mongoose.model("Movimiento", MovimientoSchema);
