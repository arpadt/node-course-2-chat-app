let socket = io(); // stores the socket in a var

function forEach(array, callback, scope) {
	for (let i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
    }
}

function scrollToBottom() {
    // Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');
    // heights
    const clientHeight = messages.prop('clientHeight'); // prop() jQuery method for cross browser access of properties
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight); // moving to the bottom of messages
    }
}

// 'connect' is a built in client side event
socket.on('connect', function() {
    // join a room - deparam is a custom library
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
       if (err) {
           alert(err);
            window.location.href = '/'; // redirecting user to the main page
       } else {
            console.log('No error');
       }
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});


socket.on('updateUserList', function(users) {
    let ol = jQuery('<ol></ol>');

    // users.forEach( (user) => {
    //     ol.append(jQuery('<li></li>').text(user));
    // });
    forEach(users, function(i, user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);  // no append because we don't want to update it but completely wipe it out
});

// custom events emitted from the server to client
socket.on('newMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    let messageTextbox = jQuery('input[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function() {
        // clear the value once the server received the message
        messageTextbox.val('');
    });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    // disable location button
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {  // success and error
        locationButton.removeAttr('disabled').text('Send location'); // remove disabled 
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});