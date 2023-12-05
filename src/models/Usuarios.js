const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rol",
  },
  especialidad: {
    type: String,
    required: true,
    maxlength: 20, // VARCHAR(20)
  },
  correo: {
    type: String,
    required: true,
    maxlength: 50, // VARCHAR(50)
  },
  direccion: {
    type: String,
    maxlength: 100, // VARCHAR(100), opcional (NULL en SQL)
  },
  numero: {
    type: String,
    maxlength: 100, // VARCHAR(100), opcional (NULL en SQL)
  },
  clinica: {
    type: String,
    required: true,
    maxlength: 50, // VARCHAR(50)
  },
  foto: {
    type: String,
    required: true
  },
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});

userSchema.pre("update", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
