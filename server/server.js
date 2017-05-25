const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server); // access to socket.io

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// register an event
io.on('connection', (socket) => {
    console.log('New user connected');      // do something with the connection

    // fire a message to the new user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // broadcast a message to everyone else
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    // receiving email from client
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        // emit event to everyone  - socket.emit() emits an event to a single connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        // broadcasting events - everyone gets the same message BUT ONE PERSON, sender does not receive its own message
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client');
    });
}); // listen to a connection

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});