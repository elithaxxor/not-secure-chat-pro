// Chat module: handles sending/receiving messages, reactions, private messaging
import { currentUser } from './user.js';
export function sendMessage(socket, text, privateTo=null) {
  socket.send(JSON.stringify({ type: 'chat', text, privateTo }));
}
export function sendReaction(socket, messageId, emoji) {
  socket.send(JSON.stringify({ type: 'reaction', messageId, emoji }));
}
export function handleMessage(msg, socket) {
  if (msg.type === 'chat') {
    appendMessage({ sender: msg.from, text: msg.text });
  } else if (msg.type === 'private') {
    appendMessage({ sender: msg.from, text: msg.text, private: !msg.self });
  } else if (msg.type === 'reaction') {
    addReactionToMessage(msg.messageId, msg.emoji, msg.from);
  } else if (msg.type === 'system') {
    appendSystemMessage(msg.text);
  } else if (msg.type === 'error') {
    showError(msg.error);
  }
}
