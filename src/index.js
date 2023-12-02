require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoDBURI = process.env.MONGODB_URI;
const userRoutes = require("./routes/userRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const crearUsuariosIniciales = require('./fillers/InitUsesAndRoles');

if (!mongoDBURI) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(mongoDBURI)
  .then(() => {
    console.log('Conectado a MongoDB');
    console.log('Creando usuarios y roles iniciales');
    crearUsuariosIniciales(); // Inicializar usuarios
  })
  .catch((error) => console.error('No se pudo conectar a MongoDB', error));

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
//middleware
app.use('/api', userRoutes);
app.use('/api', pacienteRoutes);

// Configuraciones adicionales, middlewares, rutas, etc.
// Por ejemplo, si tienes middlewares o configuraciones adicionales, añádelos aquí.

// Rutas
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

