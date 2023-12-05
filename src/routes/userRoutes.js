const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/Usuarios");

const JWT_SECRET = process.env.JWT_SECRET || "12345";
const Rol = require("../models/Rol");

function generarToken(usuario) {
  return jwt.sign({ id: usuario._id, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send({ mensaje: "Token requerido." });

  try {
    var token2 = token.split(" ")[2];
    const decoded = jwt.verify(token2, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ mensaje: "Token inválido." });
  }
}

// Asegúrate de importar y usar tus controladores y middlewares adecuados aquí

// Crear usuario (POST)
router.post("/usuarios" /* controlador para crear usuario */);

// Leer usuarios (GET)
router.get("/usuarios", verificarToken, async (req, res) => {
  try {
    var { username } = req.query;
    var regex = new RegExp(`${username}`, "i");
    // Obtener todos los usuarios. Puedes decidir qué campos excluir en la consulta.
    const usuarios = await User.find({ nombre: regex }, "-password"); // Excluye la contraseña en el resultado
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Leer un usuario específico (GET)
router.get("/usuarios/:id", verificarToken, async (req, res) => {
  try {
    var { id } = req.params;
    // Obtener todos los usuarios. Puedes decidir qué campos excluir en la consulta.
    const usuarios = await User.findOne({ _id: id }, "-password"); // Excluye la contraseña en el resultado
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Actualizar usuario (PUT)
router.put("/usuarios/:id", verificarToken, async (req, res) => {
//   try {
    var { id } = req.params;
    console.log(req.body)
    var {
      nombre,
      rol,
      especialidad,
      correo,
      direccion,
      numero,
      clinica,
      foto,
      username,
      password
    } = req.body;
    var updateUser = {
      nombre,
      rol,
      especialidad,
      correo,
      direccion,
      numero,
      clinica,
      foto,
      username
    };

    if (password) {
        updateUser.password = password;
    }

    User.findOneAndUpdate({ _id: id }, updateUser);
//   } catch (error) {
    // res.status(500).json({ mensaje: "Error en el servidor.", error: error });
//   }
});

// Eliminar usuario (DELETE)
router.delete(
  "/usuarios/:id",
  verificarToken /* controlador para eliminar un usuario */
);

// Login (POST)
router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    const { username, password } = req.body;

    // Buscar usuario por correo electrónico
    const usuario = await User.findOne({ username })
      .populate({
        path: "rol",
        model: Rol,
      })
      .exec();
    if (!usuario) {
      return res.status(401).send({ mensaje: "El usuario no existe." });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).send({ mensaje: "Contrasena incorrecta." });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.send({
      mensaje: "Login exitoso",
      token,
      _id: usuario._id,
      rol: usuario.rol.nombre,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesion" });
  }
});

// Logout (POST)
router.post("/logout", (req, res) => {
  // El logout generalmente se maneja en el cliente eliminando el token almacenado
  res.send("Logout exitoso");
});

router.get("/roles", verificarToken, async (req, res) => {
  try {
    // Obtener todos los roles. Puedes decidir qué campos excluir en la consulta.
    const roles = await Rol.find({}); // Excluye la contraseña en el resultado
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});
module.exports = router;
