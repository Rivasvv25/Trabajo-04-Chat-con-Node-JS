# Chat Realtime Node

Application for real-time chat using Node.js, Express, and Socket.io.  
Designed to be multi-client, robust, and easily deployable to Heroku.

## Features
- **Real-time**: Instant messaging with WebSocket.
- **Rooms**: Support for `/join roomName` command to switch channels.
- **Persistence**: In-memory history of the last 50 messages per room.
- **Identity**: Nickname requirement and duplicate handling context.
- **Security**: Basic XSS protection and server-side validation.

## Local Installation

1. Clone or download.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in multiple browser tabs.

---

## Deploy a Heroku (CLI)

This guide assumes you have a Heroku account and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.

### 1. Prerequisites
- **Node.js & npm**: Installed locally.
- **Git**: Project must be a git repository.
- **Heroku CLI**: Logged in via `heroku login`.

**Important**: Heroku detects this as a Node.js app because `package.json` is in the root directory.

### 2. Prepare `package.json`
The project is already configured:
- **Dependencies**: All required packages (`express`, `socket.io`, etc.) are in `dependencies`.
- **Engines**: Node version is explicitly set to `22.x`.
- **Start Script**: `npm start` runs `node src/server.js`.

### 3. Environment Variables (PORT)
The server in `src/server.js` automatically binds to `process.env.PORT` which Heroku provides dynamically.
```javascript
const PORT = process.env.PORT || 3000;
```

### 4. Deploy Steps

1. **Login to Heroku**:
   ```bash
   heroku login
   ```

2. **Create the App**:
   ```bash
   heroku create
   ```
   *(Or specify a name: `heroku create my-chat-app-name`)*

3. **Deploy Code**:
   ```bash
   git push heroku main
   ```
   *(If your branch is master: `git push heroku master`)*

4. **Verify Deployment**:
   Watch the build logs. Once complete, ensure the web process is running:
   ```bash
   heroku ps:scale web=1
   ```

5. **Open App**:
   ```bash
   heroku open
   ```

6. **Troubleshooting**:
   If the app crashes, check logs:
   ```bash
   heroku logs --tail
   ```
