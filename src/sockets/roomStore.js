// In-memory storage
const users = new Map(); // socket.id -> { nickname, room }
const history = new Map(); // room -> [messages]

const MAX_HISTORY = 50;

/**
 * Add a user to the store
 */
const addUser = (id, nickname, room) => {
    users.set(id, { nickname, room });
};

/**
 * Remove a user from the store
 * @returns {Object|null} The removed user or null
 */
const removeUser = (id) => {
    const user = users.get(id);
    if (user) {
        users.delete(id);
        return user;
    }
    return null;
};

/**
 * Get user by socket id
 */
const getUser = (id) => users.get(id);

/**
 * Get all users in a specific room
 */
const getUsersInRoom = (room) => {
    const roomUsers = [];
    users.forEach((u) => {
        if (u.room === room) roomUsers.push(u.nickname);
    });
    return roomUsers;
};

/**
 * Add message to history
 */
const addMessageToHistory = (room, message) => {
    if (!history.has(room)) {
        history.set(room, []);
    }
    const messages = history.get(room);
    messages.push(message);
    if (messages.length > MAX_HISTORY) {
        messages.shift();
    }
};

/**
 * Get history for a room
 */
const getHistory = (room) => {
    return history.get(room) || [];
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addMessageToHistory,
    getHistory
};
