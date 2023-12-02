const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  dui_paciente: {
    type: String,
    required: true,
    unique: true,
    maxlength: 9 // CHAR(9)
  },
 
  nombre: {
    type: String,
    required: true,
    maxlength: 50 // VARCHAR(50)
  },
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  direccion: {
    type: String,
    maxlength: 50 // VARCHAR(50), opcional
  },
  sexo_paciente: {
    type: String,
    required: true,
    maxlength: 10 // VARCHAR(10)
  },
  correo: {
    type: String,
    required: true,
    maxlength: 50 // VARCHAR(50)
  },
  numero_telefonico: {
    type: String,
    required: true,
    maxlength: 8 // CHAR(8)
  },
  antecedentes: {
    type: String,
    maxlength: 300 // VARCHAR(300), opcional
  },
  foto: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  contacto_emergencia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContactoEmergencia",
  },

  citas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CitaMedica",
  }],

 
  // ... más campos según sea necesario ...
});

module.exports = mongoose.model('Paciente', pacienteSchema);
