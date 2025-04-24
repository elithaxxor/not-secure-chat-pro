// Chat module: handles sending/receiving messages, reactions, private messaging
import { currentUser } from './user.js';
import { renderReactionsUIForMessage } from './ui.js';
import { generateMessageId } from './utils.js';

export function sendMessage(socket, text, privateTo=null) {
  const id = generateMessageId();
  socket.send(JSON.stringify({ type: 'chat', text, privateTo, id }));
  renderReactionsUIForMessage(id);
}

export function sendReaction(socket, messageId, emoji) {
  socket.send(JSON.stringify({ type: 'reaction', messageId, emoji }));
}

export function handleMessage(msg, socket) {
  if (msg.type === 'chat') {
    appendMessage({ sender: msg.from, text: msg.text, id: msg.id });
    renderReactionsUIForMessage(msg.id);
  } else if (msg.type === 'private') {
    appendMessage({ sender: msg.from, text: msg.text, private: !msg.self, id: msg.id });
    renderReactionsUIForMessage(msg.id);
  } else if (msg.type === 'reaction') {
    addReactionToMessage(msg.messageId, msg.emoji, msg.from);
  } else if (msg.type === 'system') {
    appendSystemMessage(msg.text);
  } else if (msg.type === 'error') {
    showError(msg.error);
  }
}

import { appendMessage, appendSystemMessage, showError, addReactionToMessage } from './ui.js';
