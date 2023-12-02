const mongoose = require('mongoose');

const citaMedicaSchema = new mongoose.Schema({
  // En MongoDB, _id se genera automáticamente y puede usarse como PK
  id_paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true // FK a la colección de Pacientes
  },
  
  id_medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true // FK a la colección de Medicos
  },
  fecha_cita: {
    type: Date,
    required: true
  },
  fecha_proxima_cita: Date, // Opcional
  motivo: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  presion_arterial: {
    type: String,
    required: true,
    maxlength: 7 // VARCHAR(7)
  },
  ritmo_cardiaco: {
    type: Number,
    required: true,
    max: 999 // INT(3)
  },
  temperatura: {
    type: Number,
    required: true,
    max: 999 // INT(3)
  },
  oxigeno: {
    type: Number,
    max: 999 // INT(3), opcional
  },
  sintomas: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  diagnostico: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  tratamiento: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  notas: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },

 
  // ... más campos según sea necesario ...
});

module.exports = mongoose.model('CitaMedica', citaMedicaSchema);

