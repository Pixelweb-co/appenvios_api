"use strict";

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var cors = require("cors");
var middleware = require("./middleware");
var service = require("./services");
var nodemailer = require("nodemailer");
var redis = require("socket.io-redis");
var multer = require("multer");

// Load the full build.
var _ = require("lodash");
// Load the core build.
var _ = require("lodash/core");
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require("lodash/fp");

// Load method categories.
var array = require("lodash/array");
var object = require("lodash/fp/object");

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require("lodash/at");
var curryN = require("lodash/fp/curryN");

var http = require("http");
var random = require("random");
var dateFormat = require("dateformat");

var OneSignal = require("onesignal-node");

var epayco = require("epayco-node")({
  apiKey: "5d921d0dfa8fed575b6f193df9b3f1e8",
  privateKey: "e5f118b8ba012c088fe729f81144b50c",
  lang: "ES",
  test: true,
});

const APP_ID = "25f62b3c-d924-40be-ade7-424f4e9854e1";
const API_KEY = "ZDliMDIxNmItM2UyYi00NmIyLWEwYWItN2Y3NDAyNDJlMWVk";
const USER_KEY = "Nzg4ZmQ1YmUtOWVhMy00OWZkLTkyMzEtMjE3ZDU3NmI2YTc4";

const DEVICE_IDS = ["DEVICE_TOKENS"];

var myClient = new OneSignal.Client({
  userAuthKey: USER_KEY,
  app: { appAuthKey: API_KEY, appId: APP_ID },
});

// npm install spdy@3.x

var Greenlock = require("greenlock-express");
//var Greenlock = require("../");

var socketio = require("socket.io");

require("dotenv").config();

//var server;
var io;
var express = require("express");
var app = express();

const urldb = process.env.MONGO_CONNECTION_STRING;
// ConexiÃƒÂ³n con la base de datos
mongoose.connect(urldb);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.use(express.static(__dirname + "/public"));

//modelos de datos

var Favoritos = mongoose.model("Favoritos", {
  user: String,
  place: Object,
  destination: Object,
  key: String,
});

var Mensajes = mongoose.model("Mensajes", {
  de: String,
  nombre_de: String,
  para: String,
  mensaje: String,
  solicitud: String,
  fecha: String,
  leido: Boolean,
});

var Solicitudes_canceladas = mongoose.model("Solicitudes_canceladas", {
  contratista: String,
  solicitud: String,
  detalle_cancelacion: String,
  fecha: String,
});

var Pin_pago = mongoose.model("Pin_pago", {
  estado: String,
  respuesta: String,
  autorizacion: String,
  recibo: Number,
  fecha: String,
  franquicia: String,
  cod_respuesta: Number,
  ip: String,
  tipo_doc: String,
  documento: String,
  nombres: String,
  apellidos: String,
  email: String,
  enpruebas: Number,
  ciudad: String,
  direccion: String,
  ind_pais: String,
  pin: Number,
  codigoproyecto: Number,
  fechaexpiracion: String,
  fechapago: String,
  valor_pesos: String,
});

var Solicitud = mongoose.model("Solicitudes", {
  id: Number,
  id_client: String,
  client_data: Object,
  id_driver: String,
  status: String,
  comments: Object,
  destinations: Array,
  tarifa: Object,
  type: String,
  origin: Object,
  fecha: Date,
});

var Ofertas = mongoose.model("Ofertas", {
  valor: Number,
  contratista: String,
  contratista_name: String,
  contratante: String,
  cliente: String,
  estado: String,
  solicitud: String,
});

var Pagos = mongoose.model("Pagos", {
  valor: Number,
  transacion_id: String,
  recibo_epayco: String,
  cedula_cliente: String,
  respuesta_transaccion: String,
  codigo_respuesta: String,
  texto_respuesta: String,
  fecha_pago: String,
});

var Usuariosh = mongoose.Schema({
  nombres: String,
  apellidos: String,
  usuario: String,
  password: String,
  email: String,
  telefono: String,
  direccion: String,
  ciudad: String,
  estado: String,
  saldo: Number,
  placa_vehiculo: String,
  modelo_vehiculo: String,
  cedula: Number,
  marca_vehiculo: String,
  tipo: String,
  act_code: String,
  avatar: String,
});

var Tarifas = mongoose.Schema({
  origen: String,
  destino: String,
  tarifa: Number,
});

var tarifasm = mongoose.model("tarifasm", Tarifas);

var usuariom = mongoose.model("usuariom", Usuariosh);

var Ciudades = mongoose.Schema({
  nombre: String,
  estado: String,
  departamento: String,
});

var ciudadesm = mongoose.model("ciudadesm", Ciudades);

//rutas
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage }).single("userPhoto");

//subir_foto

app.post("/api/photo1", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.post("/api/cambiar_clave", function (req, res) {
  usuariom.findOneAndUpdate(
    { _id: req.body.user },
    { password: req.body.password },
    { upsert: true },
    function (err, results) {
      return res.status(200).send({ success: true });
    }
  );
});

app.post("/api/guardar_usuario", function (req, res) {
  usuariom.findOneAndUpdate(
    { _id: req.body.user },
    {
      nombres: req.body.nombres,
      telefono: req.body.telefono,
      cedula: req.body.cedula,
    },
    { upsert: true },
    function (err, results) {
      return res.status(200).send({ success: true });
    }
  );
});

app.post("/api/obtener_usuario", function (req, res) {
  usuariom.findOne({ _id: req.body.user }, function (err, user) {
    return res.status(200).send({ success: true, user: user });
  });
});

app.post("/api/photo", function (req, res) {
  var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(
    "public/uploads/" + req.body.user + ".png",
    base64Data,
    "base64",
    function (err) {
      console.log(err);

      if (!err) {
        usuariom.findOneAndUpdate(
          { _id: req.body.user },
          { avatar: req.body.user + ".png" },
          { upsert: true },
          function (err, results) {
            return res.status(200).send({
              success: true,
              image: "uploads/" + req.body.user + ".png",
            });
          }
        );
      }
    }
  );
});

//chat
app.post("/api/set_leidos", function (req, res) {
  Mensajes.findOneAndUpdate(
    { solicitud: req.body.solicitud, para: req.body.user },
    { leido: true },
    { upsert: true },
    function (err, results) {
      return res.status(200).send({ success: true });
    }
  );
});

//cargar chat solicitud

app.post("/api/mensajes", function (req, res) {
  //console.log(req);

  Mensajes.find({ solicitud: req.body.solicitud }, function (err, msjs) {
    console.log("lista de mensajes", msjs);

    return res.status(200).send(msjs);
  }).sort({ fecha: 1 });
});

// obtener saldo
app.post("/api/obtener_saldo", function (req, res) {
  usuariom.findOne({ _id: req.body.id }, function (err, user_s) {
    if (user_s) {
      return res.status(200).send({ saldo: user_s.saldo });
    } else {
      return res.status(200).send({ saldo: 0 });
    }
  });
});

app.post("/auth/signup", function (req, res) {
  console.log(req.body);

  usuariom.create(
    {
      nombres: req.body.name,
      //apellidos:req.body.,
      usuario: req.body.email,
      password: req.body.password,
      email: req.body.email,
      telefono: req.body.phone,
      //direccion:req.body.,
      //ciudad:req.body.,
      estado: "Active",
      saldo: 0,
      //placa_vehiculo:"",
      //modelo_vehiculo:"",
      //cedula:Number,
      //marca_vehiculo:req.body.,
      tipo: "cliente",
      act_code: "",
      avatar: "noImg.png",
    },

    function (err, userNew) {
      if (err) {
        res.send(err);
      }
      console.log("user new");
      res.json({
        status: "SUCCESS",
        data: userNew,
        message:
          "Gracias por registrate, esperamos disfrutes nuestra aplicaciòn",
      });
    }
  );
});

app.post("/auth/signupc", function (req, res) {
  console.log(req.body);

  usuariom.create(
    { email: req.body.email, password: req.body.password },

    function (err, solicitud) {
      if (err) {
        res.send(err);
      }
      console.log("user new");
    }
  );
});

app.post("/auth/login", function (req, res) {
  console.log({ email: req.body.email, password: req.body.password });

  usuariom.findOne(
    { usuario: req.body.email, password: req.body.password },
    function (err, obj) {
      //usuariom.find({ $and : [{"email" : req.body.email}, {"password" : req.body.password}]},  function(err,obj) {

      console.log("accedio db ", err);

      if (obj) {
        console.log(obj);

        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseÃ±a es correcta
        return res.status(200).send({
          status: "SUCCESS",
          message: "Logued Ok",
          token: service.createToken(obj),
          user: obj,
        });
      } else {
        console.log("error de usuario y/o clave");
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseÃ±a es correcta
        return res.status(200).send({ error: "user_invalid" });
      }
    }
  );
});

//chequear email
app.post("/auth/checkemail", function (req, res) {
  console.log(req.body.email);

  usuariom.find({ email: req.body.email }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (user.length > 0) {
      res.json({
        isEmailUnique: false,
      });
    } else {
      res.json({ isEmailUnique: true });
    }

    console.log(user);
  });
});

//chequear cedula
app.post("/auth/checkcedula", function (req, res) {
  console.log(req.body.cedula);

  usuariom.find({ cedula: req.body.cedula }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (user.length > 0) {
      res.json({ isIdUnique: false });
    } else {
      res.json({ isIdUnique: true });
    }

    console.log(user);
  });
});

//chequear telefono
app.post("/auth/checktelefono", function (req, res) {
  console.log(req.body.telefono);

  usuariom.find({ telefono: req.body.telefono }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (user.length > 0) {
      res.json({
        isPhoneUnique: false,
      });
    } else {
      res.json({ isPhoneUnique: true });
    }

    console.log(user);
  });
});

//chequear placa
app.post("/auth/checkplaca", function (req, res) {
  console.log(req.body.placa_vehiculo);

  usuariom.find(
    { placa_vehiculo: req.body.placa_vehiculo },
    function (err, user) {
      if (err) {
        res.send(err);
      }

      if (user.length > 0) {
        res.json({
          isPlacaUnique: false,
        });
      } else {
        res.json({ isPlacaUnique: true });
      }

      console.log(user);
    }
  );
});

//obtener contratista
app.post("/api/obtener_contratista", function (req, res) {
  usuariom.findOne({ _id: req.body.id }, function (err, user) {
    //console.log(user);

    if (!user) {
      return res.status(200).send({ error: "No existe." });
    } else {
      return res
        .status(200)
        .send({ success: "Se te asigno esta solicitud.", contratista: user });
    }
  });
});

app.post("/api/setfavorite", (req, res) => {
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
});

app.post("/api/obtener_favoritos", function (req, res) {
  // console.log("obteniendo favoritos");

  Favoritos.find({ user: req.body.user }, function (err, favoritos) {
    //console.log(favoritos);
    return res.status(200).send(favoritos);
  });
});

app.post("/api/lastlocation", function (req, res) {
  console.log("obteniendo ultima ubicacion ");

  Solicitud.findOne({ id_client: req.body.user, status: "Cerrada" })
    .sort({ fecha: -1 })
    .exec(function (err, lastLocation) {
      console.log("last location get ", lastLocation);
      return res.status(200).send(lastLocation.origin);
    });
});

app.post("/api/obtener/solicitudes_cerradas_driver", (req, res) => {
  const usuario = req.body.user;
  const fechaInicio = new Date(req.body.fechaInicio);
  const fechaFin = new Date(req.body.fechaFin);

  Ofertas.aggregate(
    [
      {
        $match: {
          usuario: usuario,
          estado: "closed",
        },
      },
      {
        $lookup: {
          from: "solicitudes",
          localField: "solicitud",
          foreignField: "_id",
          as: "solicitudes",
        },
      },
      {
        $unwind: "$solicitudes",
      },
      {
        $match: {
          "solicitudes.estado": "closed",
          "solicitudes.fecha_solicitud": {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
        },
      },
      {
        $project: {
          _id: "$solicitudes._id",
          fecha: "$solicitudes.fecha",
          tarifa: "$solicitudes.tarifa",
        },
      },
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ result: "error" });
      } else {
        const total = result.reduce((acc, curr) => acc + curr.tarifa, 0);
        res.json({ result: "success", solicitudes: result, total: total });
      }
    }
  );
});

//obtener usuario
app.post("/api/getuser", function (req, res) {
  usuariom.findOne({ _id: req.body.user_id }, function (err, user) {
    console.log("user app ", user);

    if (!user) {
      return res.status(200).send({ error: "No existe." });
    } else {
      return res.status(200).send(user);
    }
  });
});

//obtener contratista
app.post("/api/obtener_nombre", function (req, res) {
  console.log("Nombre");

  usuariom.findOne({ _id: req.body.id }, function (err, user) {
    console.log(user.nombres);

    if (!user) {
      return res.status(200).send({ error: "No existe." });
    } else {
      return res.status(200).send({ nombre: user.nombres });
    }
  });
});

app.post("/api/obtener_ofertas", function (req, res) {
  // console.log("obteniendo ofertas");

  Ofertas.find(
    { solicitud: req.body.solicitud, estado: "PENDING" },
    function (err, oferta_s) {
      //console.log(oferta_s);
      return res.status(200).send(oferta_s);
    }
  );
});

app.post("/api/ofertas", function (req, res) {
  console.clear();
  console.log("nueva oferta", req.body);

  Ofertas.findOneAndUpdate(
    {
      solicitud: req.body.solicitud,
      contratista: req.body.contratista,
      estado: "PENDING",
    },
    { valor: req.body.valor },
    { upsert: true },
    function (err, ofertaActualizada) {
      if (err) {
        console.log("Error pffert ", err);
        return res.send(err);
      }

      Ofertas.find(
        { solicitud: req.body.solicitud, estado: "PENDING" },
        function (err, oferta_s) {
          console.log(oferta_s);
          //socket.emit("seToffers",{offers:oferta_s,lastOferUpdate:ofertaActualizada})
          console.log("join cntratista oferta ", req.body.contratista);

          var pickedf = _.filter(usernames, {
            userName: req.body.contratista,
          });
          console.log(usernames);
          console.log("pkc ", pickedf);

          io.to("contratistas").emit("joinRequisition", {
            requisitionId: req.body.solicitud,
            contratista: req.body.contratista,
          });

          console.log("enviando notificacion de oferta");
          console.log(
            "room ",
            io.sockets.adapter.rooms["solicitud_" + req.body.solicitud]
          );
          io.to("solicitud_" + req.body.solicitud).emit("seToffers", {
            offers: oferta_s,
            lastOferUpdate: ofertaActualizada,
          });
          return true;
        }
      );

      return res
        .status(200)
        .send({ result: "SUCCESS", offer: ofertaActualizada });
    }
  );
});

//cargar chat solicitud

app.post("/api/mensajes", function (req, res) {
  console.log("get_msg");

  //console.log(req);

  Mensajes.find({ solicitud: req.body.solicitud }, function (err, docs) {
    //          console.log(docs);

    return res.status(200).send(docs);
  }).sort({ fecha: 1 });
});

//ofertas de usuario
app.post("/api/obtener_ofertas_user", function (req, res) {
  console.log("obteniendo ofertas user");

  var resultof = [];
  Ofertas.find(
    { contratante: req.body.user, estado: "0" },
    function (err, oferta_s) {
      return res.status(200).send(oferta_s);
    }
  );
});

app.post("/api/solicitudes", function (req, res) {
  Solicitud.create(
    { ...req.body.requisition, fecha: new Date() },
    function (err, solicitud) {
      if (err) {
        res.send(err);
      }

      //    console.log("rest ", solicitud);

      Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
        if (err) {
          res.send(err);
        }
        //   socket.broadcast.to('lobby').emit('solicitudes_abiertas', { data: solicitudes });

        // io.to("contratantes").emit("joinRequisition", {
        //   requisitionId: req.body.solicitud,
        //   contratante: solicitud.id_client,
        // });

        io.to("contratistas").emit("solicitudes_abiertas", solicitudes);

        //io.sockets.emit("solicitudes_abiertas", { data: solicitudes });
      });

      //notifications_open.push({
      //id:     solicitud.id,
      //title: 'MAXIENVIOS Nuevo servicio',
      //text: 'Origen: '+solicitud.origen+' Valor: $'+tarifa,
      //at: new Date(new Date().getTime() + 1 * 1000),
      //led: 'FF0000',
      //sound: 'res://platform_default'
      //})

      /////////////

      // var not = {
      //   title: "apienvios.pixelweb.com.co Nuevo servicio",
      //   message: "message",
      // }; // req.body;
      // console.log("push notificacion Snd ");
      // var firstNotification = new OneSignal.Notification({
      //   contents: {
      //     en:
      //       "Origen : " +
      //       solicitud.origin.title +
      //       " Valor: $" +
      //       solicitud.tarifa.valor,
      //   },
      //   //filters: [
      //   //{"field": "tag", "key": "user_type", "relation": "=", "value": "0"}
      //   //    ]
      // });

      // firstNotification.setParameter("headings", { en: not.title });
      // firstNotification.setParameter("data", { type: "alert" });
      // firstNotification.setParameter("android_sound", "noti");

      // // set target users
      // firstNotification.setIncludedSegments(["Mensajeros"]);
      // firstNotification.setExcludedSegments(["Inactive Users"]);

      // myClient.sendNotification(
      //   firstNotification,
      //   function (err, httpResponse, data) {
      //     if (err) {
      //       res.status(500).json({ err: err });
      //     } else {
      //       console.log(data, httpResponse.statusCode);
      //       //res.status(httpResponse.statusCode).json(data);
      //       res.json(solicitud);
      //     }
      //   }
      // );

      res.json(solicitud);

      /////////////////
    }
  );
});

app.get("/api/solicitudes", (req, res) => {
  console.log("obteniendo solicitudes");
  Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
    if (err) {
      res.send(err);
    }
    console.log("solicitudes cargadas ", solicitudes);
    res.json(solicitudes);
  });
});

//crear solicitud
app.post("/api/solicitudes2", function (req, res) {
  console.log(req.body["trayectos[]"]);

  var direcciones = req.body["direccion[]"];
  var contactos = req.body["contacto[]"];
  var diligencias = req.body["diligencia"];
  var tipos = req.body["tipo"];
  var tarifa = req.body["tarifa"];
  var origen = trayectos[0];
  var destino = trayectos[trayectos.length - 1];
  var fecha = new Date();
  var contratante = req.body.contratante;
  var observaciones = req.body.observaciones;

  console.log("Nro: " + trayectos.length);

  var trayectos_final = [];

  for (i = 0; i <= trayectos.length - 1; i++) {
    trayectos_final[i] = {
      direccion: direcciones[i],
      contacto: contactos[i],
      diligencia: diligencias[i],
      tipo: tipos[i],
    };
  }

  console.log(
    "---------------------------------NUEVA SOLICITUD EN PROCESO-------------------------------------------------"
  );

  Solicitud.create(
    {
      origen: origen,
      destino: destino,
      trayectos: trayectos_final,
      tarifa: tarifa,
      observaciones: observaciones,
      estado: "PENDING",
      fecha: fecha,
      contratante: contratante,
    },
    function (err, solicitud) {
      if (err) {
        res.send(err);
      }

      //notifications_open.push({
      //id:     solicitud.id,
      //title: 'MAXIENVIOS Nuevo servicio',
      //text: 'Origen: '+solicitud.origen+' Valor: $'+tarifa,
      //at: new Date(new Date().getTime() + 1 * 1000),
      //led: 'FF0000',
      //sound: 'res://platform_default'
      //})

      /////////////

      var not = {
        title: "apienvios.pixelweb.com.co Nuevo servicio",
        message: "message",
      }; // req.body;
      console.log("push notificacion 1");
      var firstNotification = new OneSignal.Notification({
        contents: {
          en: "Origen : " + solicitud.origen + " Valor: $" + tarifa,
        },
        //filters: [
        //{"field": "tag", "key": "user_type", "relation": "=", "value": "0"}
        //    ]
      });

      firstNotification.setParameter("headings", { en: not.title });
      firstNotification.setParameter("data", { type: "alert" });
      firstNotification.setParameter("android_sound", "noti");

      // set target users
      firstNotification.setIncludedSegments(["Mensajeros"]);
      firstNotification.setExcludedSegments(["Inactive Users"]);

      myClient.sendNotification(
        firstNotification,
        function (err, httpResponse, data) {
          if (err) {
            res.status(500).json({ err: err });
          } else {
            //console.log(data, httpResponse.statusCode);
            //res.status(httpResponse.statusCode).json(data);
            //            res.json(solicitud);
          }
        }
      );

      /////////////////

      Solicitud.find({ estado: "PENDING" }, function (err, solicitudes) {
        if (err) {
          res.send(err);
        }
        socket.broadcast.to("lobby").emit("solicitudes_abiertas", solicitudes);

        console.log("notification");

        //socket.broadcast.to('lobby').emit('notification', notifications_open);

        res.json(solicitudes);
      });
    }
  );
});

//solicitudes usuario solicitante

app.post("/api/solicitudes_user", function (req, res) {
  Solicitud.find(
    {
      $or: [{ status: "PENDING" }, { status: "Abierta" }],
      id_client: req.body.id_client,
    },
    function (err, solicitudes) {
      if (err) {
        res.send(err);
      }
      //socket.emit('message', { data: solicitudes });
      console.log("solicitudes abiertas usuario: ");

      res.json(solicitudes);

      return false;
    }
  );
});

//traer ciudades
app.get("/api/ciudades", function (req, res) {
  console.log("lista ciudades");

  ciudadesm.find(function (err, docs) {
    return res.status(200).send(docs);
  });
});

//obtener solicitud
app.post("/api/obtener_solicitud", function (req, res) {
  //console.log(req.body);

  Solicitud.findOne({ _id: req.body.id }, function (err, sol) {
    //console.log(sol);

    if (!sol) {
      return res.status(200).send({ error: "No existe." });
    } else {
      if (req.body.actual != "*") {
        //socket.leave('solicitud_'+req.body.actual);
      }

      //console.log('Ingresando a sala :','solicitud_'+req.body.id);

      //socket.join('solicitud_'+req.body.id);

      return res
        .status(200)
        .send({ success: "Se te asigno esta solicitud.", solicitud: sol });
    }
  });
});

// obtener saldo
app.post("/api/obtener_saldo", function (req, res) {
  usuariom.findOne({ _id: req.body.id }, function (err, user_s) {
    if (user_s) {
      return res.status(200).send({ saldo: user_s.saldo });
    } else {
      return res.status(200).send({ saldo: 0 });
    }
  });
});

//aceptar solicitud driver por valor
app.post("/api/aceptar_solicitud_driver", function (req, res) {
  console.clear();
  console.log("Aceptar solicitud driver ", req.body);

  Solicitud.findOne(
    { _id: req.body.offer.solicitud, status: "PENDING" },
    function (err, sol) {
      if (sol) {
        Ofertas.create(req.body.offer, function (err, newOffert) {
          Solicitud.findOneAndUpdate(
            { _id: req.body.offer.solicitud },
            { status: "Abierta", contratista: req.body.offer.contratista },
            { upsert: true },
            function (err, solicitudAbierta) {
              console.log("solicitud aceptada por driver ", solicitudAbierta);
              return res.status(200).send({
                result: "SUCCESS",
                solicitud: solicitudAbierta,
                offer: newOffert,
              });
            }
          );
        });
      } else {
        console.log("ya esta tomada");
        return res.status(200).send({ result: "FAILURE" });
      }
    }
  );
});

// Aceptar solicitud cliente
app.post("/api/aceptar_solicitud", function (req, res) {
  console.clear();
  console.log("Aceptar solicitud cliente a oferta");
  Solicitud.findOne(
    { _id: req.body.offer.solicitud, status: "PENDING" },
    function (err, sol) {
      if (sol) {
        console.log("offer in accpt ", req.body.offer);
        Solicitud.findOneAndUpdate(
          { _id: req.body.offer.solicitud },
          { status: "Abierta", id_driver: req.body.offer.contratista },
          { upsert: true },
          function (errS, solicitudAbierta) {
            if (solicitudAbierta) {
              console.log("sol abrierta ", {
                ...solicitudAbierta._doc,
                status: "Abierta",
              });

              Ofertas.findOneAndUpdate(
                { _id: req.body.offer._id },
                { estado: "ACCEPT" },
                { upsert: true },
                function (err, ofertaAceptada) {
                  Ofertas.findOneAndUpdate(
                    { solicitud: req.body.offer.solicitud },
                    { estado: "CLOSE" },
                    { upsert: true },
                    function (err, ofertaCerradas) {
                      console.log("notificacion de cambioi de estado ");

                      //console.log("Rooms ",io.sockets.adapter.rooms)
                      //notificar al contratista

                      io.to("contratistas").emit("offerAccept", {
                        solicitud: {
                          ...solicitudAbierta._doc,
                          status: "Abierta",
                        },
                        offer: ofertaAceptada,
                      });

                      Solicitud.find(
                        { estado: "PENDING" },
                        function (err, solicitudes) {
                          if (err) {
                            res.send(err);
                          }
                          io.to("contratistas").emit(
                            "solicitudes_abiertas",
                            solicitudes
                          );

                          console.log("notification");

                          //socket.broadcast.to('lobby').emit('notification', notifications_open);

                          //res.json(solicitudes);

                          return res.status(200).send({
                            result: "SUCCESS",
                            solicitud: {
                              ...solicitudAbierta._doc,
                              status: "Abierta",
                              driver_id: ofertaAceptada.contratista,
                            },
                            offer: ofertaAceptada,
                          });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              console.log("No se creo la solicitud ", errS);
              return res
                .status(200)
                .send({ result: "ERROR", msg: "no se pudo crear" });
            }
          }
        );
      } else {
        console.log("ya esta tomada");
        return res.status(200).send({ result: "FAILURE" });
      }
    }
  );
});

// Terminal solicitud
app.post("/api/terminar_solicitud", function (req, res) {
  console.log("Terminar solicitud rest ", req.body);
  Solicitud.findOne(
    {
      _id: req.body.requisition._id,
      $or: [{ status: "PENDING" }, { status: "Abierta" }],
    },
    function (err, sol) {
      if (sol) {
        Solicitud.findOneAndUpdate(
          { _id: sol._id },
          { status: "Cerrada" },
          { upsert: true },
          function (err, solicitudCerrada) {
            io.to("solicitud_" + req.body.requisition._id).emit(
              "terminateService",
              { finishBy: "user" }
            );

            Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
              if (err) {
                res.send(err);
              }
              io.to("contratistas").emit("solicitudes_abiertas", solicitudes);

              console.log(
                "enviadas solicitudes abiertas para el contratista.",
                solicitudes
              );
            });

            return res.status(200).send({ result: "SUCCESS" });
          }
        );
      } else {
        console.log("ya esta tomada");
        return res.status(200).send({ result: "FAILURE" });
      }
    }
  );
});

app.post("/auth/login", function (req, res) {
  //console.log(req.body)
  console.log({ email: req.body.usuario, password: req.body.clave });

  usuariom.findOne(
    { email: req.body.usuario, password: req.body.clave },
    function (err, obj) {
      console.log("accedio db");

      console.log(obj);

      if (obj) {
        console.log(obj);

        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseÃ±a es correcta
        return res
          .status(200)
          .send({ token: service.createToken(obj), user: obj });
      } else {
        console.log("error de usuario y/o clave");
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseÃ±a es correcta
        return res.status(200).send({ error: "user_invalid" });
      }
    }
  );
});

app.get("/insecure", function (req, res) {
  res.send("Dangerous!");
});

//

var greenlock = Greenlock.create({
  // Let's Encrypt v2 is ACME draft 11
  version: "draft-11",

  server: "https://acme-v02.api.letsencrypt.org/directory",
  // Note: If at first you don't succeed, stop and switch to staging
  // https://acme-staging-v02.api.letsencrypt.org/directory

  // You MUST change this to a valid email address
  email: "pixeleweb@iwebsuite.com",

  // You MUST NOT build clients that accept the ToS without asking the user
  agreeTos: true,

  // You MUST change these to valid domains
  // NOTE: all domains will validated and listed on the certificate
  approvedDomains: ["apienvios.pixelweb.com.co"],

  // You MUST have access to write to directory where certs are saved
  // ex: /home/foouser/acme/etc
  configDir: "~/.config/acme/",

  // Get notified of important updates and help me make greenlock better
  communityMember: true,

  debug: true,
});

////////////////////////
// http-01 Challenges //
////////////////////////

// http-01 challenge happens over http/1.1, not http2
//var redirectHttps = require("redirect-https")();
var acmeChallengeHandler = greenlock.middleware(function (req, res) {
  res.writeHead(301, { Location: "http://api.agilenvio.co" });
  res.end();

  //res.redirect('https://' + req.headers.host + req.url);

  //res.setHeader("Content-Type", "text/html; charset=utf-8");
  //res.end(
  //	"<h1>Hello, ⚠️ Insecure mundo!</h1><a>Visit Secure Site</a>" +
  //		'<script>document.querySelector("a").href=window.location.href.replace(/^http/i, "https");</script>'
  //);
});

var server_http = require("http").Server(app);

server_http.listen(2042, function () {
  console.log("Listening http server", this.address());
});

////////////////////////
// http2 via SPDY h2  //
////////////////////////

// // spdy is a drop-in replacement for the https API
// var spdyOptions = Object.assign({}, greenlock.tlsOptions);
// spdyOptions.spdy = { protocols: ["h2", "http/1.1"], plain: false };
// var server = require("spdy").createServer(
// 	spdyOptions,
// 	app
// );

// server.on("error", function(err) {
// 	console.error(err);
// });
// server.on("listening", function() {
// 	console.log("Listening for SPDY/http2/https requests on", this.address());
// });
//server.listen(443);

io = socketio(server_http);
var socket = null;
var contratantes_online = [];
var contratistas_online = [];
var solicitudes_rooms = [];
var usernames = [];

// conexiones sockets
io.on("connection", function (socket) {
  socket = socket;

  console.log(
    "nuevo ususario user ",
    socket.id +
      " - id ususario: " +
      socket.handshake.query.cliente +
      " Terminal: " +
      socket.handshake.query.tipo
  );

  //console.log('solicitudes en curso (salas) ', solicitudes_rooms);

  var pickedf = _.filter(usernames, {
    userName: socket.handshake.query.cliente,
  });

  //console.log("pkc ", pickedf);

  if (pickedf.length == 0) {
    if (socket.handshake.query.cliente) {
      //  console.log("agregadp a lista nuevo");

      usernames.push({
        id: socket.id,
        userName: socket.handshake.query.cliente,
        nombres: socket.handshake.query.username,
        //push_id : userName.push_id ,
        tipo: socket.handshake.query.tipo,
      });

      let len = usernames.length;
      len--;
    } else {
      console.log("user indefinido ", socket.handshake.query);
    }
  } else {
    //console.log("se actualiza socket");
    usernames.forEach(function (item) {
      if (item.userName == pickedf[0].userName) {
        item.id = socket.id;
      }
    });
  }

  console.log("userlist: ", usernames);

  socket.broadcast.emit("userList", usernames);

  socket.username = socket.handshake.query.cliente;
  socket.tipo = socket.handshake.query.tipo;

  console.log("Tipo usuario: ", socket.handshake.query.tipo);

  if (socket.handshake.query.cliente == "admin") {
    console.clear();
    console.log("A ingresado un admin");
    socket.join("contratistas");
    socket.join("contratantes");
    console.log("salas ", io.sockets.adapter.rooms);

    Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
      if (err) {
        res.send(err);
      }
      socket.broadcast.emit("solicitudes_abiertas", solicitudes);
    });
  }

  //console.log("Rooms ", io.sockets.adapter.rooms);

  if (socket.handshake.query.tipo == "cliente") {
    console.log("A ingresado un contratante");

    Ofertas.find(
      { cliente: socket.handshake.query.cliente, estado: "PENDING" },
      function (err, oferta_s) {
        if (err) {
          console.log(err);
          return false;
        }
        console.log("se encontro oferta ", oferta_s.length);

        if (oferta_s.length > 0) {
          socket.join("solicitud_".oferta_s.solicitud);
          socket.emit("seToffers", {
            offers: oferta_s,
            lastOferUpdate: oferta_s[0],
          });
          console.log("enviando notificacion de oferta");
        }
      }
    );

    socket.join("contratantes");
  }

  if (socket.handshake.query.tipo == "contratista") {
    console.log("A ingresado un contratista");
    socket.join("contratistas");

    Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
      if (err) {
        res.send(err);
      }
      socket.emit("solicitudes_abiertas", solicitudes);

      //  console.log(
      //s    "enviadas solicitudes abiertas para el contratista.",
      //  solicitudes
      //);
    });
  }

  //solicitudes en curso actuales reponer conexiones

  if (solicitudes_rooms.length == 0) {
    Solicitud.find({ status: "Abierta" }, function (err, solicitudes_en_curso) {
      if (err) {
        console.log(err);
        return false;
      }

      console.log("soles ", solicitudes_en_curso);

      solicitudes_en_curso.forEach(function (item) {
        solicitudes_rooms.push({
          sala: "solicitud_" + item._id,
          contratante: item.contratante,
          contratista: item.contratista,
        });

        // verificar si los usuarios de la conexion estan en linea y conectarlos a la solicitud
        var picked_contratante_enlinea = _.filter(usernames, {
          userName: item.contratante,
        });
        var picked_contratista_enlinea = _.filter(usernames, {
          userName: item.contratista,
        });

        //esta en linea?
        if (picked_contratante_enlinea > 0) {
          var clients_socket = io.sockets.clients(
            picked_contratista_enlinea.id
          ); // list of all clients in room1

          console.log("cliente cone", clients_socket);
        }
      });
    });
  }

  console.log("solicitudes en curso memoria", solicitudes_rooms);

  var picked_solicitud_existe_cte = _.filter(solicitudes_rooms, {
    contratante: socket.handshake.query.cliente,
  });

  //contratista
  var picked_solicitud_existe_cta = _.filter(solicitudes_rooms, {
    contratista: socket.handshake.query.cliente,
  });

  var en_sala = false;

  console.log("Exite contratante en sala ", picked_solicitud_existe_cte);
  console.log("Exite constratista en sala ", picked_solicitud_existe_cta);

  if (picked_solicitud_existe_cte.length == 0) {
    if (picked_solicitud_existe_cta == 0) {
      console.log("user indefindido");
    } else {
      console.log(
        "contratista en solicitud guardada reconectando ... ",
        picked_solicitud_existe_cta.sala
      );

      //resume sala

      socket.join(picked_solicitud_existe_cta[0].sala);
    }
  } else {
    console.log(
      "contratante en solicitud guardada reconectando ... ",
      picked_solicitud_existe_cte.sala
    );

    //resume sala
    socket.join(picked_solicitud_existe_cte[0].sala);
  }

  socket.on("solicitudPendiente", (data) => {
    console.clear();
    console.log("solicitud pendiente para ", data.tipo);

    if (data.tipo == "cliente") {
      Solicitud.findOne(
        {
          id_client: data._id,
          $or: [{ status: "PENDING" }, { status: "Abierta" }],
        },
        function (err, sol) {
          if (!sol) {
            console.log("No tiene pendientes de cliente");

            socket.emit("seTsolicitud", {
              type: "client",
              offers: [],
              sol: {
                id: null,
                id_client: null,
                client_data: null,
                id_driver: null,
                origin: { title: "initial", coords: null },
                destinations: [],
                status: "NEW",
                tarifa: { valor: 0, formaPago: "efectivo" },
                type: null,
                comments: { notes: "", serviceTypeOptions: null },
              },
            });
            return false;
          }
          //          console.log("tiene solicitud cliente ", sol);
          socket.join("solicitud_" + sol._id);
          console.log("salas ", solicitudes_rooms);
          /* solicitudes_rooms.push({
            sala: "solicitud_" + sol._id,
            contratante: data._id,
            contratista: null,
          }); */

          Ofertas.find(
            { solicitud: sol._id, estado: "PENDING" },
            function (err, oferta_s) {
              console.log(oferta_s);
              socket.emit("seTsolicitud", {
                type: "client",
                sol: sol,
                offers: oferta_s,
              });
              return true;
            }
          );
        }
      );
    }

    if (data.tipo == "contratista") {
      console.log("buscando solicitud " + data.tipo);
      Solicitud.findOne(
        { id_driver: data._id, status: "Abierta" },
        function (err, sol) {
          if (!sol) {
            console.log("No tiene pendientes de contratista");
            //si no tiene como contratista ver si tiene como cliente

            Solicitud.findOne(
              {
                id_client: data._id,
                $or: [{ status: "PENDING" }, { status: "Abierta" }],
              },
              function (err, sol2) {
                //console.log("buscamdo cliente  ", sol2);
                if (!sol2) {
                  //console.log("No tiene pendientes de cliente");
                  return false;
                }

                console.log("tiene solicitud contratista pero cliente ", sol2);

                socket.emit("seTsolicitud", sol2);

                return false;
              }
            );

            return false;
          }

          if (sol) {
            console.log("tiene solicitud contratista ");

            socket.join("solicitud_" + sol._id);

            var picked_sala = _.filter(solicitudes_rooms, {
              sala: "solicitud_" + sol._id,
            });

            console.log("sala encontrada para el contratista ", picked_sala);

            // if (picked_sala.length == 0) {
            //   solicitudes_rooms.push({
            //     sala: "solicitud_" + sol._id,
            //     contratante: data.solicitud.contratante,
            //     contratista: data.solicitud.contratista,
            //   });
            // }

            console.log("salas ", io.sockets.adapter.rooms);

            socket.emit("seTsolicitud", { sol: sol, offers: [] });
          }
        }
      );
    }
  });

  socket.on("ping2", function (payload) {
    console.log("ping ", payload);
  });

  socket.on("setTarifaClient", (payload) => {
    console.clear();
    console.log("Valor de servicio actualizado", payload);
    //actualizar solicitud

    Solicitud.findOneAndUpdate(
      { _id: payload.solicitud },
      { tarifa: payload.tarifa },
      { upsert: true },
      function (err, solicitudActualizada) {
        console.log("payload ", {
          ...solicitudActualizada._doc,
          tarifa: payload.tarifa,
        });

        io.to("solicitud_" + solicitudActualizada._doc._id).emit(
          "valorSolicitudActualizado",
          {
            requisition: {
              ...solicitudActualizada._doc,
              tarifa: payload.tarifa,
            },
          }
        );

        Solicitud.find({ status: "PENDING" }, function (err, docs) {
          socket.broadcast
            .to("contratistas")
            .emit("solicitudes_abiertas", docs);
          socket.emit("solicitudes_abiertas", docs);
        });
      }
    );
  });

  socket.on("locationDriverSend", (payload) => {
    // console.clear()
    console.log("Ubicacion driver", payload);
    io.to("solicitud_" + payload.requisition._id).emit(
      "locationDriverLoad",
      payload.location
    );
  });

  socket.on("setOffer", function (payload) {
    console.clear();
    console.log("nueva oferta", payload);

    socket.join("solicitud_" + payload.solicitud);

    Ofertas.findOneAndUpdate(
      {
        solicitud: payload.solicitud,
        contratista: payload.contratista,
        estado: "PENDING",
      },
      { valor: payload.valor },
      { upsert: true },
      function (err, ofertaActualizada) {
        if (err) {
          console.log("Error pffert ", err);
          return res.send(err);
        }

        Ofertas.find(
          { solicitud: payload.solicitud, estado: "PENDING" },
          function (err, oferta_s) {
            console.log(oferta_s);
            //socket.emit("seToffers",{offers:oferta_s,lastOferUpdate:ofertaActualizada})
            console.log("join cntratista oferta ", payload.contratista);

            var pickedf = _.filter(usernames, {
              userName: payload.contratista,
            });
            console.log(usernames);
            console.log("pkc ", pickedf);

            io.to("contratistas").emit("joinRequisition", {
              requisitionId: payload.solicitud,
              contratista: payload.contratista,
            });

            console.log("enviando notificacion de oferta");
            console.log("room ", io.sockets.adapter.rooms);
            io.to("solicitud_" + payload.solicitud).emit("seToffers", {
              offers: oferta_s,
              lastOferUpdate: ofertaActualizada,
            });
            return true;
          }
        );
      }
    );
  });

  socket.on("joinRequisition", (payload) => {
    console.log("join user ___________________________- ", payload);
    socket.join("solicitud_" + payload.requisitionId);
    console.log("rooms ", io.sockets.adapter.rooms);
  });

  socket.on("ver_solicitud", (data) => {
    console.log("ingreso a solicitud contratista ", data);

    if (data.actual != "*") {
      //socket.leave(data.actual);
    }

    //socket.join(data.solicitud);
    // list all rooms

    console.log("rm ", io.sockets.adapter.rooms);

    //socket.emit('updateapp');
  });

  ///////////

  socket.on("obtener_solicitud", (dataf) => {
    console.log("obtener solicitud contratante", dataf);

    Solicitud.findOne({ _id: dataf.id }, function (err, sol) {
      if (!sol) {
        socket.emit("solicitud_cliente", { error: "No existe." });
      } else {
        var picked_sala = _.filter(solicitudes_rooms, {
          sala: "solicitud_" + dataf.id,
        });

        console.log("sala existe? ", picked_sala);

        if (dataf.actual != "*" || dataf.actual != undefined) {
          //socket.leave('solicitud_'+dataf.actual);
        }

        console.log("Ingesar a sala contratante", dataf.id);

        socket.join("solicitud_" + dataf.id);

        console.log("salas ", io.sockets.adapter.rooms);

        console.log("salas memoria", solicitudes_rooms);

        socket.emit("solicitud_cliente", {
          success: "SE encuentra",
          solicitud: sol,
        });
      }
    });
  });

  socket.on("cancelar_solicitud", (data) => {
    console.log("cancelando solicitud", data);

    if (data.id) {
      Solicitud.findOneAndUpdate(
        { _id: data.id },
        { estado: "Abierta", contratista: undefined },
        { upsert: true },
        function (err, results) {
          Solicitudes_canceladas.create(
            {
              solicitud: data.id,
              fecha: new Date(),
              contratista: data.contratista,
              detalle_cancelacion: data.detalle.texto_cancelacion,
            },
            function () {
              Solicitud.findOne({ _id: data.id }, function (err, sol) {
                usuariom.findOne(
                  { _id: data.contratista },
                  function (err, contratista_c) {
                    console.log("notif contratista");

                    socket.leave("solicitud_" + data.id);

                    socket.broadcast.to("contratantes").emit("updateapp");
                    socket.broadcast.to("contratantes").emit("cancelada", {
                      solicitud: sol,
                      contratista: contratista_c,
                      texto_cancelacion: data.detalle.texto_cancelacion,
                    });
                  }
                );
              });
            }
          );
        }
      );
    }

    Solicitud.find({ estado: "PENDING" }, function (err, docs) {
      socket.broadcast.to("contratistas").emit("solicitudes_abiertas", docs);
      socket.emit("solicitudes_abiertas", docs);
    });
  });

  socket.on("solicitudes_get", (user) => {
    console.log("obteniendo solucitudes pendientes ");
    Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
      if (err) {
        res.send(err);
      }

      console.log("SL ", solicitudes);
      io.to("contratistas").emit("solicitudes_abiertas", solicitudes);
    });
  });

  socket.on("aceptar_solicitud", (data) => {
    console.log("aceptar solicitud ", data);

    Solicitud.findOne(
      { _id: data.solicitud._id, estado: "Abierta" },
      function (err, sol) {
        console.log("validando solicitud 1");

        //console.log("Solicitud: ",sol);

        if (!sol) {
          console.log("Tomada no se puede asignar");
        } else if (sol.estado == "Abierta") {
          console.log("Existe abierta sera tomada");

          usuariom.findOne(
            { _id: socket.handshake.query.cliente },
            function (err, user) {
              data.solicitud.estado = "En curso";
              data.solicitud.contratista = socket.handshake.query.cliente;
              data.solicitud.valor_contratado = sol.tarifa;

              if (sol.valor_contratado) {
                var precio = sol.valor_contratado;
              } else {
                var precio = sol.tarifa;
              }

              if (user.saldo > (precio * 20) / 100) {
                console.log("Alcanza el saldo");

                //saldo ok

                Solicitud.findOneAndUpdate(
                  { _id: sol._id, estado: "Abierta" },
                  data.solicitud,
                  { upsert: true },
                  function (err, results) {
                    console.log("asignada....");

                    socket.join("solicitud_" + sol._id);

                    var picked_sala = _.filter(solicitudes_rooms, {
                      sala: "solicitud_" + sol._id,
                    });

                    if (picked_sala.length == 0) {
                      solicitudes_rooms.push({
                        sala: "solicitud_" + sol._id,
                        contratante: data.solicitud.contratante,
                        contratista: data.solicitud.contratista,
                      });
                    }

                    console.log("salas ", io.sockets.adapter.rooms);

                    //envio notificaciones al loby para blquear la solicitud a los demas

                    socket.broadcast.to("contratistas").emit("tomada", {
                      user: socket.handshake.query.cliente,
                      sol: data.solicitud._id,
                      estado: data.solicitud.estado,
                    });
                    socket.broadcast
                      .to("contratantes")
                      .emit("modal_servicio_tomado", {
                        solicitud: data.solicitud,
                      });
                    socket.broadcast.to("contratantes").emit("updateapp");

                    Solicitud.find({ estado: "PENDING" }, function (err, docs) {
                      //notiicacion a todos los contratistas
                      socket.broadcast
                        .to("contratistas")
                        .emit("solicitudes_abiertas", docs);
                    });

                    socket.emit("solicitud_asignacion", {
                      success: "Asignada correctamente.",
                    });
                  }
                );
              } else {
                socket.emit("solicitud_asignacion", {
                  success: "Asignada correctamente.",
                });
              }
            }
          );
        }
      }
    );
  });

  //solicitud pocicion inicial contratista backend
  socket.on("contratista_pos_init", function (sol_id) {
    console.log("solicitar posicion inicial contratista", sol_id);
    socket.broadcast.to("solicitud_" + sol_id).emit("init_get", sol_id);
  });

  //retornando posicion
  socket.on("set_pos", function (data) {
    console.log("retornando posicion inicial contratista", data);
    socket.broadcast.to("solicitud_" + data.sala).emit("get_pos", data);
  });

  //retornando posicion
  socket.on("set_sol", function (data) {
    console.log("reconectando solicitud contratista -> ", data);
    socket.join("solicitud_" + data);
    console.log("salas ", io.sockets.adapter.rooms);
  });

  //reactivar traking por contratista
  socket.on("resume_gps", function (data) {
    console.log("reactivando gps contratista");
    socket.broadcast.to("solicitud_" + data._id).emit("resume_cliente", data);
  });

  socket.on("lista_mensajes_get", function (data) {
    console.log("solmensajes ", data);

    Mensajes.find({ solicitud: data._id }, function (err, docs) {
      console.log(
        "enviando lista mensajes de usuario sala solicitud_" + data._id
      );

      socket.emit("updatechat", { mensajes: docs });
    });
  });

  socket.on("set_leidos", function (data) {
    console.log("solll ", { solicitud: data.solicitud._id, de: data.de });

    Mensajes.updateMany(
      { solicitud: data.solicitud._id, de: data.de },
      { leido: true },
      function (err, results) {
        console.log("rus ", results);

        Mensajes.find({ solicitud: data.solicitud._id }, function (err, docs) {
          console.log(
            " set leidos enviando lista mensajes de usuario sala solicitud_ "
          );

          socket.emit("updatechat", { mensajes: docs });
        });
      }
    );
  });

  socket.on("privatemsg", function (data) {
    console.log("mensaje solicitud", data);

    usuariom.find({ _id: data.de }, function (err, name_user) {
      //  console.log(name_user)
      var mensajep = new Mensajes({
        solicitud: data.solicitud,
        de: data.de,
        nombre_de: name_user[0].nombres,
        para: "*",
        mensaje: data.mensaje,
        fecha: new Date(),
        leido: false,
      });

      mensajep.save(function (err, user) {
        Mensajes.find({ solicitud: data.solicitud }, function (err, docs) {
          console.log(
            "enviando lista mensajesde sala solicitud_" + data.solicitud
          );

          socket.broadcast
            .to("solicitud_" + data.solicitud)
            .emit("updatechat", { mensajes: docs });

          socket.emit("updatechat", { mensajes: docs });
        });
      });
    });
  });

  ///////
  //solicitar cordenadas
  socket.on("coordenadas", function (data) {
    console.log("solicitar cordenadas a: ", data);
    socket.broadcast.to(data).emit("geo_get", data);
  });

  //retornar coordenadas
  socket.on("set_geo", function (data) {
    console.log("retornando cordenadas", data);
    socket.broadcast.to(data.sala).emit("get_geo", data);
  });

  /////

  socket.on("nueva_solicitud", (data) => {
    var tray = [];
    var direcciones = [];
    var contactos = [];
    var diligencia = "";
    var tipo = "";
    var tarifa = "";
    var fecha = new Date();
    var contratante = "";
    var observaciones = "";
    var latitudes = [];
    var longitudes = [];

    var c = 0;
    console.log("nueva solicitud", data);

    data.forEach(function (s) {
      // if(s.name == 'trayectos[]'){
      // console.log("trayecto",s.value);
      // tray.push(s.value);

      // }

      if (s.name == "direccion[]") {
        console.log("direccion", s.value);
        direcciones.push(s.value);
      }

      if (s.name == "latitud[]") {
        console.log("latitud", s.value);
        latitudes.push(s.value);
      }

      if (s.name == "longitud[]") {
        console.log("longitud", s.value);
        longitudes.push(s.value);
      }

      if (s.name == "contacto[]") {
        console.log("contacto", s.value);
        contactos.push(s.value);
      }

      if (s.name == "diligencia") {
        console.log("diligencia", s.value);
        diligencia = s.value;
      }

      if (s.name == "tipo") {
        console.log("tipo", s.value);
        tipo = s.value;
      }

      if (s.name == "tarifa") {
        console.log("tarifa", s.value);
        tarifa = s.value;
      }

      if (s.name == "observaciones") {
        console.log("observaciones", s.value);
        observaciones = s.value;
      }

      if (s.name == "contratante") {
        console.log("contratante", s.value);
        contratante = s.value;
      }

      c++;
    });

    var origen = direcciones[0];
    var destino = direcciones[direcciones.length - 1];

    var trayectos_final = [];

    var i;
    for (i = 0; i <= direcciones.length - 1; i++) {
      trayectos_final[i] = {
        direccion: direcciones[i],
        contacto: contactos[i],
        diligencia: diligencia,
        tipo: tipo,
        latitud: latitudes[i],
        longitud: longitudes[i],
      };
    }

    console.log("trayectos final ", trayectos_final);

    console.log(
      "---------------------------------NUEVA SOLICITUD EN PROCESO-------------------------------------------------"
    );

    Solicitud.create(
      {
        origen: origen,
        destino: destino,
        trayectos: trayectos_final,
        tarifa: tarifa,
        observaciones: observaciones,
        estado: "PENDING",
        fecha: fecha,
        contratante: contratante,
      },
      function (err, solicitud) {
        if (err) {
          res.send(err);
        }

        //notifications_open.push({
        //id:     solicitud.id,
        //title: 'MAXIENVIOS Nuevo servicio',
        //text: 'Origen: '+solicitud.origen+' Valor: $'+tarifa,
        //at: new Date(new Date().getTime() + 1 * 1000),
        //led: 'FF0000',
        //sound: 'res://platform_default'
        //})

        /////////////

        var not = {
          title: "apienvios.pixelweb.com.co Nuevo servicio",
          message: "message",
        }; // req.body;
        console.log("push notificacion 1");
        var firstNotification = new OneSignal.Notification({
          contents: {
            en: "Origen : " + solicitud.origen + " Valor: $" + tarifa,
          },
          //filters: [
          //{"field": "tag", "key": "user_type", "relation": "=", "value": "0"}
          //    ]
        });

        firstNotification.setParameter("headings", { en: not.title });
        firstNotification.setParameter("data", { type: "alert" });
        firstNotification.setParameter("android_sound", "noti");

        // set target users
        firstNotification.setIncludedSegments(["Mensajeros"]);
        firstNotification.setExcludedSegments(["Inactive Users"]);

        myClient.sendNotification(
          firstNotification,
          function (err, httpResponse, data) {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              //console.log(data, httpResponse.statusCode);
              //res.status(httpResponse.statusCode).json(data);
              //            res.json(solicitud);
            }
          }
        );

        /////////////////

        Solicitud.find({ estado: "PENDING" }, function (err, solicitudes) {
          if (err) {
            res.send(err);
          }
          socket.broadcast
            .to("contratistas")
            .emit("solicitudes_abiertas", solicitudes);

          console.log("notification");
          //console.log(notifications_open);

          // socket.broadcast.to('lobby').emit('notification', notifications_open);

          //res.json(solicitudes);
        });
      }
    );
  });
});
