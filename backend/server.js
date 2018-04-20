var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

home = path.resolve("./frontend/html/home.html");
html = path.resolve("./frontend/html");
js = path.resolve("./frontend/js");
socketio = path.resolve("./node_modules/socket.io-client/dist");


app.use("/html", express.static(html));
app.use("/js", express.static(js));
app.use('/socketio', express.static(socketio));

server.listen(process.env.PORT || 3000);
console.log('Server is running on port 3000');


app.get('/', function(req,res){
    res.sendFile(home);
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
        console.log('a user disconnected');
    })
});

