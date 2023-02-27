const Rating = require('../models/calificacionModel');
const Solicitud = require('../models/solicitudModel')

const ratingController = {};

ratingController.getAll = async (req, res) => {
  try {
    const Rating = await Rating.find();
    res.json(Rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de Rating' });
  }
};

ratingController.create = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    const savedRating = await rating.save();
    res.json(savedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar el rating' });
  }
};

ratingController.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRating = await Rating.findByIdAndDelete(id);
    res.json(deletedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el Rating' });
  }
};



ratingController.setRating = async (req, res) => {
  
  
  let whoRating = {}

  if(req.body.tipo=="cliente"){
   whoRating = {ratedClient:"Rated"}
  }

  if(req.body.tipo=="contratista"){
    whoRating = {ratedDriver:"Rated"}
  }



  try {
    const rating = new Rating(req.body);
    const savedRating = await rating.save();
    

  //  res.json(savedRating);
  
  try {
    const solicitud = await Solicitud.findByIdAndUpdate(
      {_id:req.body.solicitud,status:"Cerrada"},
      whoRating,
      { upsert: true }
    );


    res.status(200).json(solicitud);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar el rating' });
  }

}
  
ratingController.obtenerRatings = async function (req, res) {
     console.log("obteniendo Rating");
  
    Rating.find({ user: req.body.user }, function (err, Rating) {
      console.log("Rating ",Rating);
      return res.status(200).send(Rating);
    });


  };


module.exports = ratingController;
