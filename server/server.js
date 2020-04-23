require('./config/config');
const express = require('express')
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.get('/users', function (req, res) {
  res.send('GET users')
});
 
app.post('/users', function (req, res) {
    let body = req.body;
    res.json(body)
  });

app.put('/users/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });

})

app.delete('/users', function (req, res) {
res.send('DELETE users')
})  
app.listen(process.env.PORT, () => {
    console.log("Escuchando")
})