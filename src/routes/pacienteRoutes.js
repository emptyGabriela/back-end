const express = require("express");

const router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Paciente = require('../models/Paciente');
const CitaMedica = require("../models/CitaMedica");
const ContactoEmergencia = require("../models/ContactoEmergencia");
const moment = require("moment")
const JWT_SECRET = process.env.JWT_SECRET || '12345';



function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido.');

    try {

        var token2 = token.split(' ')[2]
        const decoded = jwt.verify(token2, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Token inválido.');
    }
}

// Asegúrate de importar y usar tus controladores y middlewares adecuados aquí

// Crear paciente (POST)
router.post('/pacientes', verificarToken, async (req, res) => {
try{
    const { nombre,
        fecha_nacimiento,
        dui_paciente,
        sexo_paciente,
        direccion,
        numero_telefonico,
        correo,
        nombre_contacto,
        numero_telefonico_contacto,
        direccion_contacto,
        correo_contacto,
        antecedentes, foto
    } = req.body;
var contacto_emergencia =  ContactoEmergencia({
    nombre_contacto,
    numero_telefonico_contacto,
    direccion_contacto,
    correo_contacto
});
let output1;
    output1 = await contacto_emergencia.save();
    if (!output1) {
        res.status(400).json({ mensaje: "Error al crear el objeto:", err });
    }
    var nuevo_paciente = Paciente({
        nombre,
        fecha_nacimiento,
        dui_paciente,
        sexo_paciente,
        direccion,
        numero_telefonico,
        correo,
        contacto_emergencia:contacto_emergencia._id,
        antecedentes, foto
    });
    let output;
    output = await nuevo_paciente.save();
    if (!output) {
        res.status(400).json({ mensaje: "Error al crear el objeto:", err });
    }
    res.json({ mensaje: "Paciente guardado correctamente!" });
}catch(error){
    res.status(400).json({ mensaje: 'Error en el servidor.', error: error });
}

});

// Leer pacientes (GET)
router.get('/pacientes', verificarToken, async (req, res) => {
    try {
        // Obtener todos los pacientes. Puedes decidir qué campos excluir en la consulta.

        var { nombre } = req.query;
        var regex = new RegExp(`${nombre}`, 'i');
        const pacientes = await Paciente.find({ nombre: regex });
        res.json(pacientes);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el servidor.', error: error });
    }
});

// Leer un usuario específico (GET)
router.get('/pacientes/:id', verificarToken, async (req, res) => {
    try {
        var { id } = req.params
        // Obtener todos los pacientes. Puedes decidir qué campos excluir en la consulta.
        const pacientes = await Paciente.findOne({ _id: id }).populate({
            path: 'contacto_emergencia',model:ContactoEmergencia}
            ).exec(); // Excluye la contraseña en el resultado
        res.json(pacientes);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el servidor.' });
    }
});


// Leer un usuario específico (GET)
router.get('/pacientes/:id/historial', verificarToken, async (req, res) => {
    try {
        var { id } = req.params
        var { fechaInicio, fechaFin } = req.query
        console.log(req.query);
        // Obtener todos los pacientes. Puedes decidir qué campos excluir en la consulta.
        const pacientes = await Paciente.findOne({
            _id: id,
        }).populate({
            path: 'citas', 
            match: {
                'fecha_cita': {
                    $gte: moment(fechaInicio+"T00:00:00Z").utc(),
                    $lte: moment(fechaFin+"T23:59:59Z").utc(),
                }
            },
             select: '_id fecha_cita diagnostico', model: CitaMedica,
             sort: { 'fecha_cita': 0 }
        }).exec(); // Excluye la contraseña en el resultado
        res.json(pacientes.citas);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el servidor.', error: error });
    }
});


// Leer un usuario específico (GET)
router.post('/pacientes/:id/nueva_cita', verificarToken, async (req, res) => {
    try {
        var { id } = req.params;

        var { id_medico, fecha_cita,
            fecha_proxima_cita, motivo, presion_arterial,
            ritmo_cardiaco, temperatura, oxigeno, sintomas,
            diagnostico, tratamiento, notas } = req.body;
        // Obtener todos los pacientes. Puedes decidir qué campos excluir en la consulta.
        const paciente = await Paciente.findOne({ _id: id }); // Excluye la contraseña en el resultado

        const nuevaCitaMedica = new CitaMedica({
            id_paciente: id, id_medico, fecha_cita,
            fecha_proxima_cita, motivo, presion_arterial,
            ritmo_cardiaco, temperatura, oxigeno, sintomas,
            diagnostico, tratamiento, notas
        });
        console.log(fecha_cita);
        let citaGuardada;
        citaGuardada = await nuevaCitaMedica.save();
        if (!citaGuardada) {
            res.status(400).json({ mensaje: "Error al crear el objeto:", error: '' });
        }
        // res.json({ mensaje: "CitaMedica guardado correctamente!" });

        paciente.citas.push(citaGuardada._id);
        console.log(citaGuardada);
        pacienteActualizado = await paciente.save()
        if (!pacienteActualizado) {
            res.status(400).json({ mensaje: "Error al crear el objeto:", err });
        }
        res.json({ mensaje: "Paciente actualizado correctamente!" });

    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el servidor.', error: error });
    }
});

// Actualizar usuario (PUT)
router.put('/pacientes/:id', verificarToken, /* controlador para actualizar un usuario */);

// Eliminar usuario (DELETE)
router.delete('/pacientes/:id', verificarToken, /* controlador para eliminar un usuario */);

// Leer un usuario específico (GET)
router.get('/citamedica/:id', verificarToken, async (req, res) => {
    try {
        var { id } = req.params
        console.log("id"+id)
        // Obtener todos los pacientes. Puedes decidir qué campos excluir en la consulta.
        const pacientes = await CitaMedica.findOne({ _id: id }); // Excluye la contraseña en el resultado
        res.json(pacientes);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el servidor.' });
    }
});

module.exports = router;
