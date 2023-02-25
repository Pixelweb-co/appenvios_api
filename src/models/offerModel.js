
var Oferta = mongoose.model("Ofertas", {
    valor: Number,
    contratista: String,
    contratista_name: String,
    contratante: String,
    cliente: String,
    estado: String,
    solicitud: String,
  });


 
module.exports = Oferta;
 