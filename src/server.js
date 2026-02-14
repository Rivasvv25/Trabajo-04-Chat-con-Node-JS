const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./sockets');

const PORT = process.env.PORT || 3000;

// Create HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Setup socket events
socketHandler(io);

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
