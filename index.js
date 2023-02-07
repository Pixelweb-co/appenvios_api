const express = require("express");
const app = express();
const PORT = 2042;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//👇🏻 New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


const socketIO = require('socket.io')(http, {
    cors: {
        origin: "<http://192.168.0.4:2042>"
    }
});

//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    //socket.emit("userList",[])
    socket.on("userJoin",(data)=>console.log("join",data))


    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});
