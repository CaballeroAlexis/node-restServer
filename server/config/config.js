


//========================
// PUERTO
// =======================
process.env.PORT = process.env.PORT || 3000;


//========================
// ENTORNO
// =======================
process.env.NODE_ENV =process.env.NODE_ENV  || 'dev'

//========================
// BASE DE DATOS
// =======================

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://Alexis:ryuzaki08@cluster0-lmyxw.mongodb.net/cafe'
}
process.env.URL_DB = urlDB;
