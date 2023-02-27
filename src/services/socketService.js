const socketIO = require('socket.io');
const Solicitud = require('../models/solicitudModel');
const Ofertas = require('../models/offerModel');

// Load the full build.
var _ = require("lodash");
// Load the core build.
var _ = require("lodash/core");
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require("lodash/fp");


var contratantes_online = [];
var contratistas_online = [];
var solicitudes_rooms = [];
var usernames = [];

let io;

function init(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);


    console.log(
      "nuevo ususario user ",
      socket.id +
      " - id ususario: " +
      socket.handshake.query.cliente +
      " Terminal: " +
      socket.handshake.query.tipo
    );


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
      //console.clear();
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

    ////

    ////


    socket.on("solicitudPendiente", (data) => {
      //console.clear()
      if (data.tipo == "cliente") {
        Solicitud.findOne(
          {
            id_client: data._id,
            $or: [
              { status: "PENDING" }, 
              { status: "Abierta" }, 
              { status: "Cerrada",ratedClient:null },
          ],
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
                  ratedClient:null,
                  ratedDriver:null
                },
              });
              return false;
            }
            console.log("tiene solicitud cliente ");
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
          { id_driver: data._id, $or: [
            { status: "Abierta" }, 
            { status: "Cerrada",ratedDriver:null}]
          },
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

                  console.log("tiene solicitud contratista pero cliente ");

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

    //hu2 
    socket.on("crear_solicitud_cliente", (data) => {
      //console.clear();
      console.log("crear solicitud cliente ");

      Solicitud.create({ ...data, fecha: new Date(), status: "PENDING" }, function (err, solicitud) {
        if (err) {
          res.send(err);
        }
        socket.join("solicitud_" + solicitud._id);
        io.to("solicitud_" + solicitud._id).emit("seTsolicitud", {
          sol: { ...data, fecha: new Date(), status: "PENDING" },
          offers: [],
        });

        console.log("Rooms ", io.sockets.adapter.rooms);

        Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
          if (err) {
            res.send(err);
          }

          io.to("contratistas").emit("solicitudes_abiertas", solicitudes);
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

        /////////////////
      });
    });

    socket.on("setOffer", function (payload) {
      //console.clear();
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
              console.log("join contratista oferta ", payload.contratista);


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


    socket.on("aceptar_solicitud_driver_oferta", (data) => {
      //console.clear();
      console.log("Aceptar solicitud cliente a oferta", data);
      Solicitud.findOne(
        { _id: data.solicitud, status: "PENDING" },
        function (err, sol) {
          if (sol) {
            //console.log("offer in accpt ", data);
            Solicitud.findOneAndUpdate(
              { _id: data.solicitud },
              { status: "Abierta", id_driver: data.contratista },
              { upsert: true },
              function (errS, solicitudAbierta) {
                if (solicitudAbierta) {

                  Ofertas.findOneAndUpdate(
                    { _id: data._id },
                    { estado: "ACCEPT" },
                    { upsert: true },
                    function (err, ofertaAceptada) {
                      Ofertas.findOneAndUpdate(
                        { solicitud: data.solicitud },
                        { estado: "CLOSE" },
                        { upsert: true },
                        function (err, ofertaCerradas) {



                          console.log("solicitud aceptada ", {
                            ...solicitudAbierta._doc,
                            status: "Abierta",
                            id_driver: data.contratista
                          })



                          io.to("solicitud_" + data.solicitud).emit("offerAccept", {
                            sol: {
                              ...solicitudAbierta._doc,
                              status: "Abierta",
                              id_driver: data.contratista
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
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  console.log("No se creo la solicitud ", errS);

                }
              }
            );
          } else {
            console.log("ya esta tomada");
            // return res.status(200).send({ result: "FAILURE" });
          }
        }
      );
    });

    socket.on("terminar_soliitud", (solicitud) => {

      console.log("Terminar solicitud rest ", solicitud);
      Solicitud.findOne(
        {
          _id: solicitud._id,
          status: "Abierta",
        },
        function (err, sol) {
          if (sol) {
            Solicitud.findOneAndUpdate(
              { _id: sol._id },
              { status: "Cerrada" },
              { upsert: true },
              function (err, solicitudCerrada) {

                console.log("Rooms ", io.sockets.adapter.rooms);

                io.to("solicitud_" + solicitud._id).emit(
                  "terminateService",
                  { finishBy: "user", sol: { ...solicitudCerrada._doc, status: "Cerrada" } }
                );



                Solicitud.find({ status: "PENDING" }, function (err, solicitudes) {
                  if (err) {
                    //        res.send(err);
                  }

                  io.to("contratistas").emit("solicitudes_abiertas", solicitudes);

                  console.log(
                    "enviadas solicitudes abiertas para el contratista.",
                    solicitudes
                  );
                });

                //      return res.status(200).send({ result: "SUCCESS" });
              }
            );
          } else {
            console.log("ya esta tomada");
            //    return res.status(200).send({ result: "FAILURE" });
          }
        }
      );

    })


  });
}

module.exports = {
  init,
};
