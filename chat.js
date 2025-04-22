// Initialize WebSocket connection using environment variable or default
const WS_URL = window.WS_URL || 'wss://192.168.1.113/chat';
const socket = new WebSocket(WS_URL);

// Select elements
const messagesDiv = document.getElementById('messages');
const inputField = document.querySelector('input[type="text"]');
const sendButton = document.getElementById('sendButton');

// Handle incoming messages
socket.onmessage = (event) => {
    const message = document.createElement('div');
    // Add timestamp and avatar if available
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    message.innerHTML = `<span class='msg-time'>[${timeString}]</span> <span class='msg-avatar'></span> Server: ${event.data}`;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// Send message on button click
sendButton.addEventListener('click', () => {
    const msg = inputField.value.trim();
    if (msg) {
        socket.send(msg);
        const userMessage = document.createElement('div');
        userMessage.innerHTML = `<span class='msg-time'>[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span> <span class='msg-avatar'></span> You: ${msg}`;
        messagesDiv.appendChild(userMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        inputField.value = '';
    }
});

// Accessibility: allow Enter to send
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Add basic connection status feedback
socket.onopen = () => {
    messagesDiv.innerHTML += '<div class="msg-status">Connected</div>';
};
socket.onclose = () => {
    messagesDiv.innerHTML += '<div class="msg-status">Disconnected</div>';
};

// TODO: Integrate CAPTCHA validation before enabling chat
