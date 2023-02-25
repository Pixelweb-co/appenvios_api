const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

const userRoutes = require("./routes/userRoutes");
const solicitudRoutes = requite("./routes/solicitudRoutes");
const ofertasRoutes = require("./routes/ofertasRoutes");

const socketService = require("./services/socketService");

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

app.use(express.json());

// Configurar rutas
app.use("/api/users", userRoutes);
app.use("/api/solicitud", solicitudRoutes);
app.use("/api/ofertas", ofertasRoutes);

//inicializar socket
socketService.init(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
