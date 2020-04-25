const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
	values: ["ADMIN", "USER"],
	message: "{VALUE} no es un rol válido"
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, "Nombre es necesario"]
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Correo es necesario"]
	},
	password: {
		type: String,
		required: [true, "Contraseña es obligatorio"]
	},
	img: {
		type: String,
		required: [false]
	},
	role: {
		type: String,
		default: "USER_ROLE",
		enum: rolesValidos
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
});

usuarioSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
	message: "{PATH}  debe  de ser único"
});
module.exports = mongoose.model("User", usuarioSchema);
