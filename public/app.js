const socket = io();

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const nicknameInput = document.getElementById('nickname-input');
const joinBtn = document.getElementById('join-btn');
const loginError = document.getElementById('login-error');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const roomNameDisplay = document.getElementById('room-name');
const usersList = document.getElementById('users-list');

let myNickname = '';

// -- Login Flow --
joinBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    if (nickname.length < 3) {
        loginError.textContent = 'Nickname must be at least 3 chars.';
        return;
    }

    socket.emit('user:join', { nickname });
    myNickname = nickname;
});

// -- Socket Events --

// On successful connection (acknowledged by receiving data or just UI switch)
// We rely on 'users:update' or history as confirmation joined successfully, 
// strictly speaking we should have an ack, but errors handle simple failures.
socket.on('connect', () => {
    console.log("Connected to server");
});

socket.on('error', (err) => {
    if (loginScreen.style.display !== 'none') {
        loginError.textContent = err.message;
    } else {
        alert(err.message);
    }
});

// Update Users and Room UI
socket.on('users:update', ({ room, users }) => {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    roomNameDisplay.textContent = room;

    usersList.innerHTML = '';
    users.forEach(u => {
        const div = document.createElement('div');
        div.className = 'user-item';
        div.textContent = u === myNickname ? `${u} (You)` : u;
        usersList.appendChild(div);
    });
});

// System Messages
socket.on('system:info', ({ text, time }) => {
    appendMessage({ nickname: 'System', text, time }, 'system');
});

// Chat Messages
socket.on('message:new', (msg) => {
    const type = msg.nickname === myNickname ? 'own' : 'other';
    appendMessage(msg, type);
});

// History
socket.on('history:load', ({ messages }) => {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const type = msg.nickname === myNickname ? 'own' : 'other';
        appendMessage(msg, type);
    });
});

// -- Sending Messages --
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    socket.emit('message:send', { text });
    messageInput.value = '';
});

// -- UI Helper --
function appendMessage(msg, type) {
    const div = document.createElement('div');
    div.className = `message msg-${type}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = msg.nickname;

    const content = document.createElement('div');
    content.textContent = msg.text;

    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = msg.time;

    if (type !== 'system') div.appendChild(meta);
    div.appendChild(content);
    div.appendChild(time);

    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
