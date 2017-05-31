const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, toLowerCase} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server); // access to socket.io
let users = new Users();

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// register an event
io.on('connection', (socket) => {
    console.log('New user connected');      // do something with the connection

    // io.emit: emit event to everyone
    // socket.broadcast.emit: emit event to everyone but the current user
    // socket.emit: emit event specifically to one user

    // io.to('Room name').emit:emit event to everyone in the same room

    // join room
    socket.on('join', (params, callback) => {
        let room = toLowerCase(params.room);

        if (!isRealString(params.name) || !isRealString(room)) {
            // no code below fires if format is not validated
            return callback('Name and room name are required');
        }

        socket.join(room); // people in the same room can chat
        // remove user from any previous rooms
        users.removeUser(socket.id);
        // add user to the new room
        users.addUser(socket.id, params.name, room);

        // emit an event to everyone in the room
        io.to(room).emit('updateUserList', users.getUserList(room));

        // fire a message to the new user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // broadcast a message to everyone else
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    // receiving email from client
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // emit event to everyone  - socket.emit() emits an event to a single connection
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        // remove user and update the list
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
}); // listen to a connection

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});