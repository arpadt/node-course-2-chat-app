let socket = io(); // stores the socket in a var

// 'connect' is a built in client side event
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

// custom events emitted from the server to client
socket.on('newMessage', function(message) {
    console.log('New message', message);
});