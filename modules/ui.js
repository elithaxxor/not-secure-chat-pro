// UI module: handles UI helpers, error/system messages, reactions UI
export function appendMessage({ sender, text, private: isPrivate }) {
  const messages = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message' + (isPrivate ? ' private' : '');
  msgDiv.innerHTML = `<strong>${sender}${isPrivate ? ' (private)' : ''}:</strong> ${text}`;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}
export function appendSystemMessage(text) {
  const messages = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'system-message';
  msgDiv.innerText = text;
  messages.appendChild(msgDiv);
}
export function showError(text) {
  alert(text);
}
export function addReactionToMessage(messageId, emoji, from) {
  // Placeholder: implement message reaction UI
}
