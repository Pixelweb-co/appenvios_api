const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cors = require("cors");

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
require("dotenv").config();



const userRoutes = require("./src/routes/userRoutes");
const solicitudRoutes = require("./src/routes/solicitudRoutes");
const ofertasRoutes = require("./src/routes/offerRoutes");
const favoritosRoutes = require("./src/routes/favoritosRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");

const socketService = require("./src/services/socketService");

const app = express();
const port = 2042;
const server = http.createServer(app);



mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Error de conexión a la base de datos:")
);
db.once("open", function () {
  console.log("Conexión exitosa a la base de datos");
});

//app.use(express.json());

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.use(express.static(__dirname + "/public"));


// Configurar rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/solicitud", solicitudRoutes);
app.use("/api/ofertas", ofertasRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/rating", ratingRoutes);


//inicializar socket
socketService.init(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
