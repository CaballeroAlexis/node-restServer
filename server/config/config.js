


//========================
// PUERTO
// =======================
process.env.PORT = process.env.PORT || 3000;


//========================
// ENTORNO
// =======================
process.env.NODE_ENV =process.env.NODE_ENV  || 'dev'


//========================
// VENCIMIENTO DEL TOKEN
// =======================
60 * 60 * 24 * 30
process.env.CAD_TOKEN =  60 * 60 * 24 * 30;

//========================
// SEED DE AUTENTICACIÓN
// =======================
process.env.SEED = process.env.SEED  || 'secret-seed';

//========================
// BASE DE DATOS
// =======================

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = urlDB;
