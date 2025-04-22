// Import the WebSocket library
const WebSocket = require('ws');

// Use environment variable or default for port
const PORT = process.env.WS_PORT || 6969;
const wss = new WebSocket.Server({ port: PORT });

// Track connected users
const users = new Map(); // ws => {username, isAdmin, muted, banned}

// Broadcast helper
function broadcast(data, exceptWs = null) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== exceptWs) {
            client.send(JSON.stringify(data));
        }
    });
}

// Send updated user list to all
function sendUserList() {
    const userList = Array.from(users.values()).map(u => ({username: u.username, isAdmin: u.isAdmin, muted: u.muted}));
    broadcast({type: 'user-list', users: userList});
}

wss.on('connection', (ws) => {
    let userInfo = {username: null, isAdmin: false, muted: false, banned: false};
    users.set(ws, userInfo);
    console.log('Client connected');

    ws.on('message', (raw) => {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch {
            ws.send(JSON.stringify({type: 'error', error: 'Invalid message format'}));
            return;
        }
        // Handle join
        if (msg.type === 'join') {
            userInfo.username = msg.username;
            userInfo.isAdmin = !!msg.isAdmin;
            sendUserList();
            broadcast({type: 'system', text: `${msg.username} joined the chat.`}, ws);
            return;
        }
        // Handle chat message
        if (msg.type === 'chat') {
            if (userInfo.muted) {
                ws.send(JSON.stringify({type: 'error', error: 'You are muted.'}));
                return;
            }
            if (msg.privateTo) {
                // Private message
                for (let [client, info] of users.entries()) {
                    if (info.username === msg.privateTo && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({type: 'private', from: userInfo.username, text: msg.text}));
                        ws.send(JSON.stringify({type: 'private', from: userInfo.username, text: msg.text, self: true}));
                        break;
                    }
                }
            } else {
                broadcast({type: 'chat', from: userInfo.username, text: msg.text});
            }
            return;
        }
        // Handle reactions
        if (msg.type === 'reaction') {
            broadcast({type: 'reaction', from: userInfo.username, messageId: msg.messageId, emoji: msg.emoji});
            return;
        }
        // Admin controls
        if (msg.type === 'admin' && userInfo.isAdmin) {
            for (let [client, info] of users.entries()) {
                if (info.username === msg.target) {
                    if (msg.action === 'mute') info.muted = true;
                    if (msg.action === 'unmute') info.muted = false;
                    if (msg.action === 'kick') {
                        client.send(JSON.stringify({type: 'system', text: 'You have been kicked by an admin.'}));
                        client.close();
                    }
                    if (msg.action === 'ban') {
                        info.banned = true;
                        client.send(JSON.stringify({type: 'system', text: 'You have been banned by an admin.'}));
                        client.close();
                    }
                    break;
                }
            }
            sendUserList();
            return;
        }
    });

    ws.on('close', () => {
        users.delete(ws);
        sendUserList();
        console.log('Client disconnected');
    });
});