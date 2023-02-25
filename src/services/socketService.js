const socketIO = require('socket.io');

let io;

function init(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('aceptar_solicitud', (data) => {
      console.log(`Se aceptó la solicitud: ${data}`);
      io.emit('solicitud_aceptada', data);
    });

    socket.on('terminar_solicitud', (data) => {
      console.log(`Se terminó la solicitud: ${data}`);
      io.emit('solicitud_terminada', data);
    });
  });
}

module.exports = {
  init,
};
