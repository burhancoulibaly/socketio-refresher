var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');


var users = [];//holds each users username
var connections = [];//holds the amount of users

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
    connections.push(socket);
    console.log('A new user connected. %s user/users connected', connections.length);

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('new user', function(usr){
        socket.username = usr;
        users.push(socket.username);
        console.log('New user: ' + usr);
        updateUsernames(socket);
        socket.broadcast.emit('get users',users);
        
    })

    socket.on('disconnect', function(usr){
        socket.broadcast.emit('disconnected',socket.username);
        console.log(socket.username+' disconnected. %s user/users connected', connections.length-1);  
        users.splice(users.indexOf(socket.username),1); 
        connections.splice(connections.indexOf(socket),1);
        updateUsernames(socket);
    })

    socket.on('typing', function(user){
        console.log(user+" is typing");
        socket.broadcast.emit('isTyping',user);
    })
});

    function updateUsernames(socket){
        io.emit('updateUsers',users);
    }

