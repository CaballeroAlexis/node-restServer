require("./config/config");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("./routes/users"));

mongoose.connect(process.env.URL_DB, 
  {useNewUrlParser:true,useCreateIndex:true},
  (err, res) => {
	if (err) throw err;
	console.log("Base conectada");
});

app.listen(process.env.PORT, () => {
	console.log("Escuchando");
});
