const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public/');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.emit('message', 'Welcome!');

    socket.broadcast.emit('message', 'A new user has joined!');

    const filter = new Filter();

    socket.on('sendMessage', (message, callback) => {
        message = filter.clean(message);
        io.emit('message', message);

        callback();
    }); 

    socket.on('shareLocation', (coords, callback) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', "A user has disconnected!");
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});