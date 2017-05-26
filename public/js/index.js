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
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from:'User',
        text: jQuery('input[name=message]').val()
    }, function() {

    });
});