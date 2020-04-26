const  jwt = require('jsonwebtoken');

// ======================
// VERIFICAR TOKEN
// ======================

let verificarToken = (req,res,next) => {
    let token= req.get('token');
    jwt.verify(token, process.env.SEED, (err,decoded) => {
        if (err) {
            return res.status(401).json({
                ok:false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
}

// ======================
// VERIFICAR TOKEN
// ======================

let verificarRole = (req,res,next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN') {
        next();

    } else {
        return res.json({
            ok:false,
            err: 'Usuario no tiene el rol de administrador'
        })
    }

}

module.exports = {
    verificarToken,
    verificarRole
}