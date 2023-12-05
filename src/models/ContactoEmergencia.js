const mongoose = require('mongoose');

const contactoEmergenciaSchema = new mongoose.Schema({
  // En MongoDB, el campo _id generado automáticamente puede ser utilizado como PK
  
  nombre_contacto: {
    type: String,
    required: true,
    maxlength: 250 // VARCHAR(50)
  },
  numero_telefonico_contacto: {
    type: String,
    required: true,
    maxlength: 8 // CHAR(8)
  },
  direccion_contacto: {
    type: String,
    required: true,
    maxlength: 300 // VARCHAR(300)
  },
  correo_contacto: {
    type: String,
    maxlength: 50 // VARCHAR(50), opcional
  }
  // ... más campos según sea necesario ...
});

module.exports = mongoose.model('ContactoEmergencia', contactoEmergenciaSchema);
