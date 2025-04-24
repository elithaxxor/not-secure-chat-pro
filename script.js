// --- Modularized Imports ---
import { setCurrentUser, renderUserList } from './modules/user.js';
import { sendMessage, handleMessage } from './modules/chat.js';
import { sendAdminAction } from './modules/admin.js';
import { appendMessage, enableReactionUI } from './modules/ui.js';
import { sanitizeInput, generateMessageId } from './modules/utils.js';

// Helper to get current user (assumes setCurrentUser stores in localStorage)
function getCurrentUser() {
  return localStorage.getItem('currentUser') || '';
}

// --- WebSocket Setup ---
const socket = new WebSocket('ws://' + window.location.hostname + ':6969');

socket.onopen = () => {
  // Join with user info (prompt or modal in real app)
  const username = prompt('Enter your username:');
  setCurrentUser(username);
  socket.send(JSON.stringify({ type: 'join', username }));
};

socket.onmessage = (event) => {
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }
  if (msg.type === 'user-list') {
    renderUserList(msg.users);
  } else {
    handleMessage(msg, socket);
  }
};

enableReactionUI(socket);

// --- UI Event Handlers (modularized) ---
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const userSelect = document.getElementById('userSelect');
const muteBtn = document.getElementById('muteBtn');
const kickBtn = document.getElementById('kickBtn');
const banBtn = document.getElementById('banBtn');

if (sendButton) {
  sendButton.onclick = () => {
    const text = sanitizeInput(messageInput.value);
    const privateTo = userSelect && userSelect.value ? userSelect.value : null;
    sendMessage(socket, text, privateTo);
    messageInput.value = '';
  };
}

if (muteBtn && kickBtn && banBtn && userSelect) {
  muteBtn.onclick = () => {
    if (userSelect.value) sendAdminAction(socket, 'mute', userSelect.value);
  };
  kickBtn.onclick = () => {
    if (userSelect.value) sendAdminAction(socket, 'kick', userSelect.value);
  };
  banBtn.onclick = () => {
    if (userSelect.value) sendAdminAction(socket, 'ban', userSelect.value);
  };
}

// --- Message History (localStorage) ---
function saveMessageToHistory(msgObj) {
  let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.push(msgObj);
  localStorage.setItem('chatHistory', JSON.stringify(history));
}

function loadMessageHistory() {
  let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(msgObj => appendMessage(msgObj));
}

window.addEventListener('DOMContentLoaded', loadMessageHistory);

// Save sent and received messages
socket.onmessage = (event) => {
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }
  if (msg.type === 'user-list') {
    renderUserList(msg.users);
  } else {
    handleMessage(msg, socket);
    saveMessageToHistory(msg);
  }
};

const messageForm = document.getElementById('messageForm');
if (messageForm) {
  messageForm.addEventListener('submit', (event) => {
    const now = Date.now();
    const lastMessageTime = 0;
    const MESSAGE_RATE_LIMIT = 1000; // ms
    if (now - lastMessageTime < MESSAGE_RATE_LIMIT) {
      alert('You are sending messages too quickly.');
      event.preventDefault();
      return;
    }
    const msgObj = { id: generateMessageId(), text: sanitizeInput(messageInput.value), sender: getCurrentUser() };
    saveMessageToHistory(msgObj);
  });
}

// --- Theming (Light/Dark Mode) ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
});

// --- Language Selector (i18n) ---
const langSelect = document.getElementById('langSelect');
const translations = {
  en: { join: 'Join', send: 'Send', placeholder: 'Type a message...' },
  es: { join: 'Unirse', send: 'Enviar', placeholder: 'Escribe un mensaje...' }
};

if (langSelect) {
  langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
}

function setLanguage(lang) {
  document.getElementById('joinBtn').innerText = translations[lang].join;
  document.getElementById('sendButton').innerText = translations[lang].send;
  document.getElementById('messageInput').placeholder = translations[lang].placeholder;
}

window.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('lang') || 'en';
  setLanguage(lang);
  langSelect && (langSelect.value = lang);
});

// --- Browser Notifications ---
socket.onmessage = (event) => {
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }
  if (msg.type === 'user-list') {
    renderUserList(msg.users);
  } else {
    handleMessage(msg, socket);
    saveMessageToHistory(msg);
    if (msg.sender !== getCurrentUser()) {
      if (Notification.permission === 'granted') {
        new Notification('New message', { body: msg.text });
      }
    }
  }
};

if ("Notification" in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// --- Rate Limiting ---
let lastMessageTime = 0;
const MESSAGE_RATE_LIMIT = 1000; // ms

// --- Avatar Validation ---
const joinAvatar = document.getElementById('joinAvatar');
if (joinAvatar) {
  joinAvatar.addEventListener('change', function() {
    const file = this.files[0];
    if (file && (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024)) {
      alert('Please select a valid image file (max 2MB).');
      this.value = '';
    }
  });
}
