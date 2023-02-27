const mongoose = require('mongoose');

var Favoritos = mongoose.model("Favoritos", {
    user: String,
    place: Object,
    destination: Object,
    key: String,
  });

module.exports = Favoritos;