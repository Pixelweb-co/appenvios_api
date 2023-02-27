const mongoose = require('mongoose');


var Calificacion = mongoose.Schema({
    solicitud: String,
    user:String,
    tipo:String,
    calificacion:String
  });


var Rating = mongoose.model("ratings", Calificacion);
  

module.exports = Rating;
