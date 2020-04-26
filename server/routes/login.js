const express = require("express");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const _ = require("underscore");

const app = express();

app.post("/login",  (req, res) => {
    let body = req.body;
    User.findOne({email : body.email}, (err,userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            });
        }
        if ( !bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            }); 
        }

        let token = jwt.sign({
            usuario: userDB,

        }, process.env.SEED,{ expiresIn: process.env.CAD_TOKEN });
        res.json({
            ok:true,
            usuario:userDB,
            token
        })

    });

})


//Configuración de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend

    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    return {
        nombre:payload.name,
        email:payload.email,
        img: payload.picture,
        google:true
    }

  }

app.post("/google",  async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok:false,
            err:e
        })
    })
    User.findOne( {email:googleUser.email}, (err,usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(usuarioDB) {
            if(!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: 'Debe usar su autenticación normal'
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
        
                }, process.env.SEED,{ expiresIn: process.env.CAD_TOKEN });
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            }

        } else {
            //Si el usuario inicia por vez primera
            let usuario = new User();
            usuario.nombre= googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':D';
            usuario.save((err,usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } 
                let token = jwt.sign({
                    usuario: usuarioDB,
        
                }, process.env.SEED,{ expiresIn: process.env.CAD_TOKEN });
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            });

        }
    })

});
module.exports = app;
