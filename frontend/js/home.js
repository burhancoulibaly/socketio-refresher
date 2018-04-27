var socket = io();
var user;

$(document).ready(function(){
    $('#chat-home').submit(function(){
        $('#messages').append('<li>You : '+$('#m').val());
        socket.emit('chat message', user+": "+$('#m').val());
        $('#m').val('');
        return false;
    });

    $('#usr-form').submit(function(){
        user = $('#usr').val();
        socket.emit('new user', $('#usr').val());
        $('#usr').val('');
        $('#chat-home').css("visibility","visible");
        $('#usr-form').css("visibility","hidden");
        return false;
    })

    $('#m').keypress(function(){
        socket.emit('typing', user);
    })

})

socket.on('chat message', function(msg){
    $('#messages').append('<li>'+msg);
})

socket.on('get users', function(users){
    $('#messages').append('<li> New user: '+users[users.length - 1]);
})

socket.on('isTyping',function(user){
    console.log(user+" is Typing");
})

socket.on('disconnected',function(user){
    // console.log("hello");
    $('#messages').append('<li>'+user+" disconnected");
})

socket.on('updateUsers',function(users){
    console.log(users);
    $('#usrnames').html("");
    users.forEach(function(user) {
        $('#usrnames').append('<li>'+user);
    });
})
