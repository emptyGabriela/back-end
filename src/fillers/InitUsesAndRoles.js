const Rol = require("../models/Rol");
const User = require("../models/Usuarios");
async function crearUsuariosIniciales() {
    try {
    const adminExists = await User.findOne({ username: '0000000-1' });
        const doctorExist = await User.findOne({ username: '0000000-2' });
        const nurseExists = await User.findOne({ username: '0000000-3' });



        const roles = ['administrador', 'medico', 'enfermero'];
        const rolesCreados = {};

        for (const nombreRol of roles) {
            let rol = await Rol.findOne({ nombre: nombreRol });
            if (!rol) {
                rol = await Rol.create({ nombre: nombreRol });
            }
            rolesCreados[nombreRol] = rol._id;
        }

        if (!adminExists) {
            await User.create({
                nombre: 'Administrador',
                username: '0000000-1',
                password: 'admin', // Usa una contraseña más segura en producción
                rol: rolesCreados['administrador'],
                especialidad:"adminsitrador",
                correo:"admin@adin.com",
                direccion: "D1",
                numero:"12112121221",
                clinica:"CLINICA",
                foto:"https://ih1.redbubble.net/image.4890856206.4703/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
            });
            console.log('Usuario administrador creado');
        }

        if (!doctorExist) {
            await User.create({
                nombre: 'Medico',
                username: '0000000-2',
                password: 'medico', // Usa una contraseña más segura en producción
                rol: rolesCreados['medico'],
                especialidad:"adminsitrador",
                correo:"admin@adin.com",
                direccion: "D1",
                numero:"12112121221",
                clinica:"CLINICA",
                foto:"https://ih1.redbubble.net/image.4890856206.4703/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
            
            });
            console.log('Usuario medico creado');
        }

        if (!nurseExists) {
            await User.create({
                nombre: 'Enfermero',
                username: '0000000-3',
                password: 'enfermero', // Usa una contraseña más segura en producción
                rol: rolesCreados['enfermero'],
                especialidad:"adminsitrador",
                correo:"admin@adin.com",
                direccion: "D1",
                numero:"12112121221",
                clinica:"CLINICA",
                foto:"https://ih1.redbubble.net/image.4890856206.4703/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
            
            });
            console.log('Usuario enfermero creado');
        }
    } catch (error) {
        console.error('Error al crear usuarios iniciales:', error);
    }
}

module.exports = crearUsuariosIniciales;
