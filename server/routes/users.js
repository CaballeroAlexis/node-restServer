const express = require("express");
const User = require("../models/user");
const {verificarToken,verificarRole} = require("../middlewares/autenticacion");

const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();

app.get("/users", [verificarToken,verificarRole], (req, res) => {
	let desde = req.query.desde || 0;
	desde = Number(desde);
	let limite = req.query.limite || 5;
	limite = Number(limite);
	User.find({estado:true})
		.skip(desde)
		.limit(limite)
		.exec((err, usuarios) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}
			User.count({estado:true}, (err,count) => {
				res.json({
					ok: true,
					usuarios,
					count
				});
			})
		});
});

app.post("/users", verificarToken, (req, res) => {
	let body = req.body;
	let usuario = new User({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});
	usuario.save((err, usuarioDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}
		usuarioDB.password = null;
		res.json({
			ok: true,
			usuario: usuarioDB
		});
	});
});

app.put("/users/:id", verificarToken, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
	User.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true, context: "query" },
		(err, usuarioDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}
			res.json({
				ok: true,
				usuario: usuarioDB
			});
		}
	);
});

app.delete("/users/:id", verificarToken, (req, res) => {
	let id = req.params.id;
	let body = {
		estado:false
	}
	User.findByIdAndUpdate(id,body,(err,usuarioBorrado) =>{
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}
		if(!usuarioBorrado) {
			return res.status(400).json({
				ok: false,
				err: 'Usuario no existe'
			});
		}
		res.json({
			ok:true,
			usuario:usuarioBorrado
		})
	})
	
});

module.exports = app;
