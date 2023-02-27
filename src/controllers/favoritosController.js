const Favoritos = require('../models/FavoritosModel');

const favoritosController = {};

favoritosController.getAll = async (req, res) => {
  try {
    const favoritos = await Favoritos.find();
    res.json(favoritos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de favoritos' });
  }
};

favoritosController.create = async (req, res) => {
  try {
    const favorito = new Favoritos(req.body);
    const savedFavorito = await favorito.save();
    res.json(savedFavorito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar el favorito' });
  }
};

favoritosController.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFavorito = await Favoritos.findByIdAndDelete(id);
    res.json(deletedFavorito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el favorito' });
  }
};



favoritosController.setfavorite = async (req, res) => {
    Favoritos.findOneAndUpdate(
      req.body,
      { key: req.body.key },
      { upsert: true },
      function (err, favoriteUpdate) {
        if (err) {
          return res.send(err);
        }
  
        return res
          .status(200)
          .send({ result: "SUCCESS", favorite: favoriteUpdate });
      }
    );
  }
  
favoritosController.obtenerFavoritos = async function (req, res) {
     console.log("obteniendo favoritos");
  
    Favoritos.find({ user: req.body.user }, function (err, favoritos) {
      console.log("Favoritos ",favoritos);
      return res.status(200).send(favoritos);
    });


  };


module.exports = favoritosController;
