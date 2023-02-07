module.exports = (function() {
    'use strict';
    var externalRoutes = require('express').Router();

  
//obtener contratista
externalRoutes.post('/api/obtener_contratista',function(req,res){

usuariom.findOne({_id: req.body.id}, function(err, user){

 //console.log(user);
 
if(!user){
 
       return res
            .status(200)
            .send({error: 'No existe.'});
 
 }else{
        return res
            .status(200)
            .send({success: 'Se te asigno esta solicitud.',contratista: user});
 }


})


})



//obtener contratista
externalRoutes.post('/api/obtener_nombre',function(req,res){



console.log("Nombre");

usuariom.findOne({_id: req.body.id}, function(err, user){

 console.log(user.nombres);
 
if(!user){
 
       return res
            .status(200)
            .send({error: 'No existe.'});
 
 }else{
        return res
            .status(200)
            .send({nombre: user.nombres});
 }


})


})




externalRoutes.post('/api/obtener_ofertas',function(req,res){

console.log("obteniendo ofertas");


Ofertas.find({solicitud:req.body.solicitud, estado:"0"},function(err,oferta_s){


//console.log(oferta_s);
       return res
            .status(200)
            .send(oferta_s);


})

})


//cargar chat solicitud

externalRoutes.post('/api/mensajes',function(req,res){

console.log("get_msg");

//console.log(req);

Mensajes.find({solicitud:req.body.solicitud},function (err, docs) {
            
  //          console.log(docs);


     


       return res
            .status(200)
            .send(docs);
 

        }).sort({"fecha":1});



})

//ofertas de usuario
externalRoutes.post('/api/obtener_ofertas_user',function(req,res){

console.log("obteniendo ofertas user");

var resultof = [];
Ofertas.find({contratante:req.body.user, estado:"0"},function(err,oferta_s){




       return res
            .status(200)
            .send(oferta_s);


})

})


//crear solicitud
externalRoutes.post('/api/solicitudes', function(req, res) {


console.log(req.body['trayectos[]']);

var trayectos = req.body['trayectos[]'];
var direcciones =  req.body['direccion[]'];
var contactos =  req.body['contacto[]'];
var diligencias = req.body['diligencia'];
var tipos = req.body['tipo'];
var tarifa = req.body['tarifa'];
var origen = trayectos[0];
var destino = trayectos[trayectos.length-1];
var fecha =  new Date();
var contratante = req.body.contratante;
var observaciones = req.body.observaciones;

console.log("Nro: "+trayectos.length);


var trayectos_final = [];

for(i = 0; i <= trayectos.length -1;i++){
trayectos_final[i] = {
        ciudad:trayectos[i],
        direccion:direcciones[i],
        contacto:contactos[i],
        diligencia:diligencias[i],
        tipo:tipos[i]
    };     
}


console.log('---------------------------------NUEVA SOLICITUD EN PROCESO-------------------------------------------------');


  
        Solicitud.create({
        origen: origen ,
        destino:destino,
        trayectos:trayectos_final,
        tarifa: tarifa,
        observaciones:observaciones,
        estado: 'Abierta',
        fecha:fecha,
        contratante: contratante
    }, function(err, solicitud){
        if(err) {
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

    var not = {title:"AGILENVIO.CO Nuevo servicio",message: "message"}; // req.body;
    console.log("push notificacion 1")
    var firstNotification = new OneSignal.Notification({
        contents: {
            en: 'Origen : '+solicitud.origen+' Valor: $'+tarifa
        }
        ,
        //filters: [
        //{"field": "tag", "key": "user_type", "relation": "=", "value": "0"}
//    ]
    });

    firstNotification.setParameter('headings', {"en": not.title});
    firstNotification.setParameter('data', {"type": "alert"});
    firstNotification.setParameter('android_sound', "noti");

    
    // set target users
    firstNotification.setIncludedSegments(['Mensajeros']);
    firstNotification.setExcludedSegments(['Inactive Users']); 


    myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
        if (err) {
            res.status(500).json({err: err});
        } else {
            //console.log(data, httpResponse.statusCode);
            //res.status(httpResponse.statusCode).json(data);
//            res.json(solicitud);
        }
    });

/////////////////


 
        Solicitud.find({estado:'Abierta'},function(err, solicitudes) {
            if(err){
                res.send(err);
            }
            socket.broadcast.to('lobby').emit('solicitudes_abiertas', { data: solicitudes });

console.log("notification");
console.log(notifications_open);           
            
            socket.broadcast.to('lobby').emit('notification', notifications_open);


           
            res.json(solicitudes);
        });


    });


})


//solicitudes usuario solicitante

externalRoutes.post('/api/solicitudes_user', function(req, res) {  




        Solicitud.find({estado:req.body.estado,contratante:req.body.user},function(err, solicitudes) {
            if(err){
                res.send(err);
            }
            //socket.emit('message', { data: solicitudes });
console.log("solicitudes abiertas usuario: ");

           
            res.json(solicitudes);
        });



})


//traer ciudades
externalRoutes.get('/api/ciudades',function(req,res){

console.log('lista ciudades');

ciudadesm.find(function (err, docs) {
            
       return res
            .status(200)
            .send(docs);
 
        });
})



//obtener solicitud
externalRoutes.post('/api/obtener_solicitud',function(req,res){

//console.log(req.body);

Solicitud.findOne({_id: req.body.id}, function(err, sol){

 //console.log(sol);
 
if(!sol){
 
       return res
            .status(200)
            .send({error: 'No existe.'});
 
 }else{

if(req.body.actual != '*'){
//socket.leave('solicitud_'+req.body.actual);
}

//console.log('Ingresando a sala :','solicitud_'+req.body.id);

//socket.join('solicitud_'+req.body.id);


        return res
            .status(200)
            .send({success: 'Se te asigno esta solicitud.',solicitud: sol});
 }


})


})


// obtener saldo
externalRoutes.post('/api/obtener_saldo',function(req,res){


usuariom.findOne({_id: req.body.id}, function(err, user_s){




        if(user_s){
               return res
            .status(200)
            .send({saldo:user_s.saldo});

        }else{
           return res
            .status(200)
            .send({saldo:0});

        }


})

})



externalRoutes.post('/auth/login', function(req,res){

//console.log(req.body)
console.log({email: req.body.usuario, password: req.body.clave});


usuariom.findOne({email: req.body.usuario, password: req.body.clave}, function(err,obj) { 


console.log("accedio db");

console.log(obj)


if(obj){
console.log(obj);

 // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        return res
            .status(200)
            .send({token: service.createToken(obj),user:obj});




}else{
console.log("error de usuario y/o clave");
 // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        return res
            .status(200)
            .send({error: "user_invalid"});


}
 


 });





});

    return externalRoutes;
})();