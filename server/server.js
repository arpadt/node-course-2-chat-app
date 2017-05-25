const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // access to socket.io

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// register an event
io.on('connection', (socket) => {
    console.log('New user connected');      // do something with the connection

    // emit custom events to client
    socket.emit('newMessage', {
        from: 'Arpad',
        text: 'Hey, what is going on',
        createAt: 123
    });

    // receiving email from client
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client');
    });
}); // listen to a connection

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});