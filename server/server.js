const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
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
        if (!isRealString(params.name) || !isRealString(params.room)) {
            // no code below fires if format is not validated
            return callback('Name and room name are required');
        }

        socket.join(params.room); // people in the same room can chat
        // remove user from any previous rooms
        users.removeUser(socket.id);
        // add user to the new room
        users.addUser(socket.id, params.name, params.room);

        // emit an event to everyone in the room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // fire a message to the new user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // broadcast a message to everyone else
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    // receiving email from client
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // emit event to everyone  - socket.emit() emits an event to a single connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
        // broadcasting events - everyone gets the same message BUT ONE PERSON, sender does not receive its own message
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
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