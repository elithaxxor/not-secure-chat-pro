// Utility module: helpers for sanitization, id generation, etc.
export function sanitizeInput(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
export function generateMessageId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
