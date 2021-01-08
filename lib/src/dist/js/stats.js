//Used for socket.io
$(function(){

    var status = $('.status');
    var users = $('.users');
    var guilds = $('#guilds');

    var socket = io();

    //.html('New Text');
    socket.on('guild update', function(data){
        guilds.text(data.amount);
    });
    socket.on('user update', function(data){
        guilds.text(data.amount);
    });
});