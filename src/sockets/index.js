const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addMessageToHistory,
    getHistory
} = require('./roomStore');
const {
    validateNickname,
    validateMessage,
    escapeHtml
} = require('./validators');

module.exports = (io) => {
    io.on('connection', (socket) => {

        // -- JOIN EVENT --
        socket.on('user:join', ({ nickname, room }) => {
            const safeRoom = room || 'general';

            if (!validateNickname(nickname)) {
                return socket.emit('error', {
                    code: 'INVALID_NICKNAME',
                    message: 'Nickname invalid (3-20 alphanumeric chars).'
                });
            }

            // Add user
            addUser(socket.id, nickname, safeRoom);
            socket.join(safeRoom);

            // System Message
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            io.to(safeRoom).emit('system:info', {
                room: safeRoom,
                text: `${nickname} joined the room.`,
                time
            });

            // Send History to user
            const history = getHistory(safeRoom);
            socket.emit('history:load', { room: safeRoom, messages: history });

            // Build User List for room
            const userList = getUsersInRoom(safeRoom);
            io.to(safeRoom).emit('users:update', { room: safeRoom, users: userList });
        });

        // -- MESSAGE EVENT --
        socket.on('message:send', ({ text }) => {
            const user = getUser(socket.id);
            if (!user) return; // User not logged in

            if (!validateMessage(text)) {
                return socket.emit('error', {
                    code: 'INVALID_MESSAGE',
                    message: 'Message empty or too long (max 280).'
                });
            }

            // Command handling: /join
            if (text.startsWith('/join ')) {
                const newRoom = text.split(' ')[1];
                if (newRoom && /^[A-Za-z0-9_]+$/.test(newRoom)) {
                    // Leave current
                    const oldRoom = user.room;
                    socket.leave(oldRoom);

                    // Notify old room
                    io.to(oldRoom).emit('system:info', {
                        room: oldRoom,
                        text: `${user.nickname} left the room.`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                    io.to(oldRoom).emit('users:update', { room: oldRoom, users: getUsersInRoom(oldRoom) });

                    // Join new
                    user.room = newRoom;
                    socket.join(newRoom);
                    addUser(socket.id, user.nickname, newRoom); // Update store reference if needed or just object mutation implies update if ref held, but here simple mutation works

                    // Notify new room
                    io.to(newRoom).emit('system:info', {
                        room: newRoom,
                        text: `${user.nickname} joined ${newRoom}.`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });

                    socket.emit('history:load', { room: newRoom, messages: getHistory(newRoom) });
                    io.to(newRoom).emit('users:update', { room: newRoom, users: getUsersInRoom(newRoom) });

                    return;
                }
            }

            // Normal Message
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const safeText = escapeHtml(text);

            const msgPayload = {
                room: user.room,
                nickname: user.nickname,
                text: safeText,
                time
            };

            addMessageToHistory(user.room, msgPayload);
            io.to(user.room).emit('message:new', msgPayload);
        });

        // -- DISCONNECT EVENT --
        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            if (user) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                io.to(user.room).emit('system:info', {
                    room: user.room,
                    text: `${user.nickname} left.`,
                    time
                });
                io.to(user.room).emit('users:update', {
                    room: user.room,
                    users: getUsersInRoom(user.room)
                });
            }
        });

    });
};
