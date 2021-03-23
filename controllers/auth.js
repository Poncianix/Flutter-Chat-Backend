const {response} = require('express');
const Usuario = require('../models/usuario');
const bycypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req,res = response) =>{

    const {email,password} = req.body;
    try {

        const exiteEmail = await Usuario.findOne({email});
        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const usuario = new Usuario( req.body ); 

        // Encriptar contrasena 

        const salt = bycypt.genSaltSync();
        usuario.password = bycypt.hashSync(password,salt);

        await usuario.save();
        // Generar mi JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            usuario,
            token
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admin'
        });
    }
    
}
const login = async(req,res = response)=>{

    const {email,password} = req.body;
    try {
        
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
            
        }
        const validPassword = bycypt.compareSync(password,usuarioDB.password);
        if (!validPassword) {

            return res.status(400).json({
                ok: false,
                msg: 'Password error'
            });
            
        }
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        }); 

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
    

}

const renewToken = async(req,res)=>{
    
    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);
    res.json({
        ok:true,
        usuario,
        token
    }); 
}
module.exports = {

    crearUsuario,
    login,
    renewToken
}