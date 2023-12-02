const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // NOT NULL en SQL
    maxlength: 25 // Equivalente a VARCHAR(25)
  }
  // No es necesario definir rol_id, ya que Mongoose crea automáticamente _id
});

module.exports = mongoose.model('Rol', rolSchema);

