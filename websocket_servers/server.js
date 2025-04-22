// Import the WebSocket library
const WebSocket = require('ws');

// Use environment variable or default for port
const PORT = process.env.WS_PORT || 6969;
const wss = new WebSocket.Server({ port: PORT });

// Event listener for new connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Event listener for incoming messages
    ws.on('message', (message) => {
        // Basic echo with timestamp
        const now = new Date();
        ws.send(`[${now.toISOString()}] ${message}`);
    });

    // Event listener for when the connection is closed
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});