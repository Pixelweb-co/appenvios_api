//conectar socket 

  var socket = io('http://5.189.156.130:2042', {query: {tipo:'cliente', cliente:localStorage.getItem('user_id')}});

     socket.connect();

var timer = new easytimer.Timer();

var actual = '*' ;

socket.on('updaterooms', function(data){ 
console.log('Update room: ',data);
}) 


var id_sel = "*"; 


   var app = angular.module('AgilEnvio', []); 
   var scope;
   var mymarker; 



var clientIcon = L.icon({
  iconUrl: "/images/client.png",
  iconSize: [15, 15]
});

var serviceIcon = L.icon({
  iconUrl: "images/mensajero_map.png",
  iconSize: [30, 30]
});
   






   var view_oferta = function(e){


 ///           console.log($(e).data('id'));

          scope.ObtenerOferta($(e).data('id'));  
  
        setTimeout(function(){
         scope.oferta_servicio = scope.oferta_servicio;
 
         console.log("Oferta: ",scope.oferta_servicio);

          setTimeout(function(){        

          scope.solicitudSel(scope.oferta_servicio.solicitud,actual);

          //scope.listchat(scope.oferta_servicio.solicitud); 

          scope.obtener_ofertas(scope.oferta_servicio.solicitud);


         console.log("Oferta: ",scope.oferta_servicio.solicitud);


       $('#modal_servicio_oferta').modal('show');
     },500)
 
},6000)


  }



    var add_svr = function(){
 
$.ajax({
    type: "GET", 
    url: "solicitud.html",
    dataType:'html', 
    success: function (data) {
        
            $('.page-content-body').html(data);

    }

});


    }

    var mis_datos = function(){

      $.ajax({
    type: "GET", 
    url: "misdatos.html",
    dataType:'html', 
    success: function (data) {
        
            $('.page-content-body').html(data);

    }

});
    }


   var sendmsg = function(){


          
    if($('#btn-inputc').val()){
    console.log(scope.solicitud_sel);
    socket.emit('privatemsg',{solicitud:scope.solicitud_sel._id,de:localStorage.getItem('user_id'),para:scope.solicitud_sel.contratista,mensaje:$('#btn-inputc').val()});

socket.emit("set_leidos", {solicitud:scope.solicitud_sel,de:scope.solicitud_sel.contratante});
$('#newmsg').html("0").hide();
  
    $('#btn-inputc').val('');

      //  scope.listchat(scope.solicitud_sel._id);

    }


        }


app.controller('solController', ['$scope', '$http', function ($scope, $http) {
 

    // List of pendientes
    $scope.solicitudes_pendientes = [];
    $scope.solicitudes_activas = [];
    $scope.solicitudes_completadas = [];
    $scope.solicitud_sel = {};
    $scope.contratista_sel = {};
    $scope.chatList = [];
    $scope.chatL = [];
    $scope.leidos = 0;  
    $scope.NewchatList = [];
    $scope.me = localStorage.getItem('user_id'); 
    $scope.cancelar_servicio = {};
    $scope.aceptar_servicio = {}; 
    $scope.ofertas_servicio = [];
    $scope.ofertas_user = []; 
    $scope.termiar_servicio = [];
    $scope.oferta_servicio = [];  
    $scope.ml = false;  
    $scope.usuario = {};

    $scope.mapa_servicio ;
    $scope.results;
    $scope.marker_contratista;

    //obtener contratista en mapa

     $scope.get_contratista_map = function($sol_id){

      console.log("solicitando ubicacion inicial contratista");
        socket.emit('contratista_pos_init',$sol_id);


     } 



    //traking contratista   


    //data usuario
       $scope.obtener_usuario = function () {
        $http.post('http://5.189.156.130:2042/api/obtener_usuario', {user:localStorage.getItem('user_id')})
            .then(function success(e) {

              console.log(e)

                $scope.usuario = e.data.user;


            }, function error(e) {
 
            });
    }

$scope.obtener_usuario();

    
    //data ofertas
       $scope.obtener_ofertas = function (sol_id) {
        $http.post('http://5.189.156.130:2042/api/obtener_ofertas', {solicitud:sol_id})
            .then(function success(e) {

              

                $scope.ofertas_servicio = e.data;


            }, function error(e) {
 
            });
    }


    $scope.obtener_ofertas_user = function (user_id) {
        $http.post('http://5.189.156.130:2042/api/obtener_ofertas_user', {user:user_id})
            .then(function success(e) {

              

                $scope.ofertas_servicio_user = e.data;


            }, function error(e) {
 
            });
    }


    $scope.obtener_ofertas_user(localStorage.getItem('user_id'));

    //data chat
       $scope.listchat = function (sol_id) {
        $http.post('http://5.189.156.130:2042/api/mensajes', {solicitud:sol_id})
            .then(function success(e) {

                console.log("datos chat: "+sol_id);

                console.log("me" , $scope.me);

           

         //       $scope.chatList = e.data;

                 console.log($scope.chatList); 

            }, function error(e) {
 
            });
    }

  //  $scope.listchat('0');


$scope.listsolicitudes = function () {
        $http.post('http://5.189.156.130:2042/api/solicitudes_user', {user:localStorage.getItem('user_id'),estado:'Abierta'})
            .then(function success(e) {


            

                $scope.solicitudes_pendientes = e.data;
            }, function error(e) {
 
            });
    };
    $scope.listsolicitudes();


    //activas
    $scope.listsolicitudes_activas = function () {
        $http.post('http://5.189.156.130:2042/api/solicitudes_user', {user:localStorage.getItem('user_id'),estado:'En curso'})
            .then(function success(e) {


            

                $scope.solicitudes_activas = e.data;
            }, function error(e) {
 
            });
    };
    $scope.listsolicitudes_activas();


    //completadas

    $scope.listsolicitudes_completadas = function () {
         $http.post('http://5.189.156.130:2042/api/solicitudes_user', {user:localStorage.getItem('user_id'),estado:'Cerrada'})
            .then(function success(e) {


            

                $scope.solicitudes_completadas = e.data;
            }, function error(e) {
 
            });

}
    $scope.listsolicitudes_completadas();


      //obtener contratista
    $scope.contratistaSel = function (ids) {
        $http.post('http://5.189.156.130:2042/api/obtener_contratista', {id:ids})
            .then(function success(e) {


            

                $scope.contratista_sel = e.data.contratista;
             }, function error(e) {
 
            });
    };    


      //obtener solicitud
    $scope.solicitudSel = function (ids,actualf) {
        
        console.log("obteniendo solicitud y entrando a sala socket")
            socket.on('solicitud_cliente',function(data){

                         if(data.solicitud.contratista){

                           // alert(data.solicitud.contratista);

                        $scope.contratistaSel(data.solicitud.contratista);     
                         }
             

                 $scope.solicitud_sel = data.solicitud;
               socket.emit("lista_mensajes_get",$scope.solicitud_sel);  

            })

 
              console.log("A enviar: ",{id:ids,actual:actualf});

          socket.emit('obtener_solicitud',{id:ids,actual:actualf}); 


        // $http.post('http://api.agilenvio.co/api/obtener_solicitud', {id:ids,actual:actual})
        //     .then(function success(e) {

        //             if(e.data.solicitud.contratista){


        //                $scope.contratistaSel(e.data.solicitud.contratista);     
        //             }
            

        //         $scope.solicitud_sel = e.data.solicitud;



        //     }, function error(e) {
 
        //     });
    }


   

              //aceptar oferta
    $scope.acetarOferta = function (ids) {
        $http.post('http://5.189.156.130:2042/api/aceptar_oferta', {id:ids})
            .then(function success(e) {

                    console.log("oferta aceptada",e);

            }, function error(e) {
 
            });
    };
    

              //aceptar oferta
    $scope.ObtenerOferta = function (ids) {
        $http.post('http://5.189.156.130:2042/api/obtener_oferta', {id:ids})
            .then(function success(e) {

         $scope.oferta_servicio = e.data; 

            }, function error(e) {
 
            });
    };



    $scope.load_mapa = function(){

      setTimeout(function(){
 console.log("validando mapa..-.");

if($scope.ml == false){

         console.log("cargando mapa..-.");
 
  $scope.mapa_servicio = L.map('map_solicitud').setView([$scope.solicitud_sel.trayectos[0].latitud, $scope.solicitud_sel.trayectos[0].longitud], 13);
$scope.ml = true;
L.control.scale().addTo($scope.mapa_servicio);

// Create a Tile Layer and add it to the map
//var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.pixelweb.com.co/copyright">PIXELWEB</a> contributors'
  }).addTo($scope.mapa_servicio);



  $scope.results = new L.LayerGroup().addTo($scope.mapa_servicio);


//solicitando contratante posicion inicial




}

     $scope.results.clearLayers();





    for (var i = $scope.solicitud_sel.trayectos.length - 1; i >= 0; i--) {
    
    $scope.results.addLayer(L.marker([$scope.solicitud_sel.trayectos[i].latitud, $scope.solicitud_sel.trayectos[i].longitud]).bindPopup($scope.solicitud_sel.trayectos[i].direccion).openPopup());
      console.log('ltk ',[$scope.solicitud_sel.trayectos[i].latitud, $scope.solicitud_sel.trayectos[i].longitud]);
    }

     
    $scope.get_contratista_map($scope.solicitud_sel._id);  
    

    

      },500);

      }

   
    $scope.load_mapa1 = function(){


        console.log("cargando mapa..-.");




      //pedir cordenadas iniciales

  

    setTimeout(function(){  
    
    $scope.mapa_servicio = L.map('map').setView([6.217, -75.567], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize:     [40, 40],
            popupAnchor:  [-3, -76]
        }
    });

    var greenIcon = new LeafIcon({iconUrl: 'images/mensajero_map.png'});

    L.marker([6.217, -75.567], {icon: greenIcon}).bindPopup("Mensajero : <b>Edwin</b>").addTo(map);




},5000)
    }

    $scope.convertToDate = function (stringDate){
    var dateOut = new Date(stringDate);
    dateOut.setDate(dateOut.getDate() + 1);
    return dateOut;
  };


    scope = $scope


        setTimeout(function(){
    console.log(scope.solicitudes_activas.length);


    $('.sabg').html(scope.solicitudes_activas.length);
    $('.tsl').html(scope.solicitudes_activas.length + scope.solicitudes_completadas.length + scope.solicitudes_pendientes.length);
    $('.bsc').html(scope.solicitudes_completadas.length);
    $('.bsx').html(scope.solicitudes_pendientes.length);

    $('.salir-bt').click(function(){
        localStorage.clear();
        location.href = 'login.html';


    })

    if(scope.solicitudes_activas.length > 0){
    $('#tab-act').click();    
    } else if(scope.solicitudes_pendientes.length > 0) {

     $('#tab-pen').click();   
    
    } else {
    
     $('#tab-com').click();   
    
    }



$('.tomar_oferta').click(function(){

scope.acetarOferta($(this).data("oferta")); 


$("#modal_servicio_oferta").modal('hide');
 

})



$('.cancelar_solicitud').click(function(){

timer.stop();
timer = false;


$('#modal_servicio_canelado_detalle').modal('show');

})

$('.versol').click(function(){
console.log("ver sol xxxff");

id_sel = $(this).data('id');

                    
         scope.solicitudSel($(this).data('id'),actual);

          //scope.listchat($(this).data('id')); 



    scope.obtener_ofertas($(this).data('id'));









 $('.vtr').click(function(){

    $("#dirt").html("4s")

    })


         console.log(scope.solicitud_sel);   
         $('#btn-input').val('');
        $('#modal_solicitud').modal('show'); 


setTimeout(function(){


$("#chatbtf").click(function(){
    timer.stop();
    $('#modal_solicitud .chat').html(""); 

console.log("set leidos",$scope.solicitud_sel);


$("#newmsg").html("0").hide();

    $scope.leidos = 0;
scope.leidos = 0;

socket.emit("set_leidos", {solicitud:scope.solicitud_sel,de:scope.solicitud_sel.contratante})





})


 $('#trkbt').click(function(){
  console.log("set event click map");
    scope.load_mapa();


    })

 $('.btctr').click(function(){


        scope.acetarOferta($(this).data('oferta'));




    })

},500)

})

},2000)
    




$(document).ready(function(){


$("#btn-inputc").focus(function(){

})


  $('#modal_solicitud').on('hidden.bs.modal', function () {
    $("#tab1sol").click();

      timer.stop();

})


})

  // socket.emit('adduser',{user:localStorage.getItem('user_id')})




socket.on('resume_cliente', function(data){
console.log("reactivado Rastreo");
 timer.start();
})


socket.on('updatechat', function(data){
$scope.leidos = 0;
console.log("leyendo mensajes ",data);

var html_fila = '';

data.mensajes.forEach(function(dataf){


console.log("leido ",dataf.leido); 

if(!dataf.leido){
$scope.leidos ++
scope.leidos = $scope.leidos;
}


html_fila =  html_fila+'<div  class="clearfix msj_item">';

if(scope.me == dataf.de){
 
html_fila = html_fila+'<span class="chat-img pull-right"><img src="https://placehold.it/50/55C1E7/fff&text=M" alt="User Avatar" class="img-circle" /></span><div class="bubble you" ><span ><b>'+dataf.nombre_de+'</b> '+dataf.mensaje+'</span></div>';

}else{

html_fila = html_fila+'<span class="chat-img pull-left"><img src="https://placehold.it/50/A5C1E7/fff&text=M" alt="User Avatar" class="img-circle" /></span><div class="bubble me" ><span ><b>'+dataf.nombre_de+'</b> '+dataf.mensaje+'</span></div>';

}

html_fila =  html_fila+'</div>';

});


if($scope.leidos == 0){

$("#newmsg").html($scope.leidos).hide();

}else{

$("#newmsg").html($scope.leidos).show();
}


$('#modal_solicitud .chat').html(html_fila);

console.log('leidos ',$scope.leidos);


setTimeout(function(){
$("#modal_solicitud .scroll-b").stop().animate({ scrollTop: $("#modal_solicitud .chat")[0].scrollHeight}, 1000);
},500)

})




socket.on('get_pos', function(data){
  //   alert("get_post");
   timer.stop();
   
    if(data.traking == false){

        alert("Rastreo desactivado por el mensajero")

     }else{
     // alert('super llegue '+data.sala)
     console.log('obteniendo ubicacion inicial contratista ',data);

      scope.mapa_servicio.setView([data.coordenadas.latitud, data.coordenadas.longitud], 18);

    // mymarker = L.Marker.movingMarker([
    //     data.latitud,
    //     data.longitud
    // ], 50, {
    //     icon: serviceIcon,
    //     autostart: true,
    //     setZoom: 25
    // }).addTo(scope.mapa_servicio);


var newLatLng = new L.LatLng(data.coordenadas.latitud, data.coordenadas.longitud);
scope.marker_contratista = L.marker(newLatLng, {icon: serviceIcon}).bindPopup("Mensajero : <b>Edwin</b>").addTo(scope.mapa_servicio);

    //socket.emit('init', {
      //  isDriver: isDriver,
       // latLong: e.latlng
    //});



timer.start();
 
timer.addEventListener('secondsUpdated', function (e) {
    //$('#basicUsage').html(timer.getTimeValues().toString());
    //  console.log("tm ",timer.getTimeValues());

        var time = timer.getTimeValues();

        if(time.seconds == 59 || time.seconds == 29 || time.seconds == 9 || time.seconds == 19 || time.seconds == 39 || time.seconds == 49){  

     console.log("solicitando ubicacion ",'solicitud_'+$scope.solicitud_sel._id+" sec "+timer.getTimeValues().toString());  
      socket.emit('coordenadas','solicitud_'+$scope.solicitud_sel._id);

        }
});





 
    }

     
})

socket.on('get_geo', function(data){
     

    if(data.gps == false){

      console.log("desactivar traking");
      timer.stop();
     

    }



     console.log('obteniendo ubicacion contratista ',data);


var actLatLng = new L.LatLng(data.coordenadas.latitud, data.coordenadas.longitud);
scope.marker_contratista.setLatLng(actLatLng);

})


socket.on('servicio_terminado', function(data){
    
console.log("entregado servicio");
console.log(data);

if(data.solicitud.contratante == localStorage.getItem('user_id')){

       scope.termiar_servicio = data;

          scope.solicitudSel(data.solicitud._id,actual);

       //   scope.listchat(data.solicitud._id); 

          scope.obtener_ofertas(data.solicitud._id);

       $('#modal_servicio_terminado').modal('show');
 

}


})    



   socket.on('nueva_oferta', function(data){ 
console.log('Nueva oferta: ');
    console.log(data);

if(data.solicitud.contratante == localStorage.getItem('user_id')){

       scope.oferta_servicio = data;

          scope.solicitudSel(data.solicitud._id,actual);

          //scope.listchat(data.solicitud._id); 

          scope.obtener_ofertas(data.solicitud._id);
 
          scope.obtener_ofertas_user(localStorage.getItem('user_id'));

       $('#modal_servicio_oferta').modal('show');
 

}


   })





socket.on('updateapp', function(data){
    
    console.log('Update app: ');
    
    scope.listsolicitudes();
    scope.listsolicitudes_activas();
    scope.listsolicitudes_completadas();

    setTimeout(function(){ 

    $('.sabg').html(scope.solicitudes_activas.length);
    $('.tsl').html(scope.solicitudes_activas.length + scope.solicitudes_completadas.length + scope.solicitudes_pendientes.length);
    $('.bsc').html(scope.solicitudes_completadas.length);
    $('.bsx').html(scope.solicitudes_pendientes.length);

   
    if(scope.solicitudes_activas.length > 0){
    $('#tab-act').click();    
    } else if(scope.solicitudes_pendientes.length > 0) {

     $('#tab-pen').click();   
    
    } else {
    
     $('#tab-com').click();   
    
    }



$('.cancelar_solicitud').click(function(){



$('#modal_solicitud').modal('hide');


$('#modal_servicio_canelado_detalle').modal('show');

})


    
$('.versol').click(function(){
console.log("ver solicitud xx   ");

var actual = id_sel;
id_sel = $(this).data('id');

                    
         scope.solicitudSel($(this).data('id'),actual);

         // scope.listchat($(this).data('id')); 





socket.emit("lista_mensajes_get",scope.solicitud_sel);


    scope.obtener_ofertas($(this).data('id'));









 $('.vtr').click(function(){

    $("#dirt").html("4s")

    })


         console.log(scope.solicitud_sel);   
         $('#btn-input').val('');
        $('#modal_solicitud').modal('show'); 


setTimeout(function(){


$('#tab1sol').click(function(){


    timer.stop();

})


$("#chatbtf").click(function(){
    timer.stop();
    $('#modal_solicitud .chat').html(""); 

$("#newmsg").html("0").hide();
    $scope.leidos = 0;
scope.leidos = 0;

console.log("set leidos",$scope.solicitud_sel);

socket.emit("set_leidos", {solicitud:scope.solicitud_sel,de:scope.solicitud_sel.contratante});





})


$("#chatbtf").click(function(){
    timer.stop();
    $('#modal_solicitud .chat').html(""); 


$("#newmsg").html("0").hide();
console.log("set leidos",$scope.solicitud_sel);

    $scope.leidos = 0;
scope.leidos = 0;
socket.emit("set_leidos", {solicitud:scope.solicitud_sel,de:scope.solicitud_sel.contratante})






})


 $('#trkbt').click(function(){
 console.log("set event click map");
    $scope.load_mapa();


    })


 $('.btctr').click(function(){


        $scope.acetarOferta($(this).data('oferta'));




    })

},500)

})    


},2000)




});



socket.on('cancelada', function(data){
    
console.log("cancelado servicio");
console.log(data);
 

    if(data.solicitud.contratante == localStorage.getItem('user_id')){

        scope.cancelar_servicio = data;

         // scope.solicitudSel(data.solicitud._id,actual);

          //scope.listchat(data.solicitud._id); 

          scope.obtener_ofertas(data.solicitud._id);
            $("#tab1sol").click();
$('#modal_solicitud').modal('hide');
       $('#modal_servicio_cancelado').modal('show');
    }


    

   })
    



socket.on('modal_servicio_ofertado', function(data){

console.log("ofertado servicio");
console.log(data);

 if(data.solicitud.contratante == localStorage.getItem('user_id')){
 
 scope.ofertar_servicio = data;

         // scope.solicitudSel(data.solicitud._id,actual);

       //   scope.listchat(data.solicitud._id); 

          scope.obtener_ofertas(data.solicitud._id);


        $('#modal_solicitud').modal('hide'); 


       $('#modal_servicio_ofertado').modal('show');



}



})


socket.on('modal_servicio_tomado', function(data){
    
console.log("tomado servicio");
console.log(data);


console.log("contratante: "+localStorage.getItem('user_id'));

 if(data.solicitud.contratante == localStorage.getItem('user_id')){
  
 scope.aceptar_servicio = data;


          //scope.solicitudSel(data.solicitud._id,actual);

          //scope.listchat(data.solicitud._id); 

          scope.obtener_ofertas(data.solicitud._id);


       $('#modal_servicio_oferta').modal('hide'); 

        $('#modal_solicitud').modal('hide'); 


       $('#modal_servicio_tomado').modal('show');

}

    

   })




}]);


