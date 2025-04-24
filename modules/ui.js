// UI module: handles UI helpers, error/system messages, reactions UI
export function appendMessage({ sender, text, private: isPrivate, id }) {
  const messages = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message' + (isPrivate ? ' private' : '');
  msgDiv.setAttribute('tabindex', '0');
  if (id) msgDiv.dataset.messageId = id;
  msgDiv.innerHTML = `<strong>${sender}${isPrivate ? ' (private)' : ''}:</strong> <span class="msg-text">${text}</span>` +
    `<span class="reactions" aria-label="Reactions"></span>`;
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
  // Inline error banner
  let errorDiv = document.getElementById('errorBanner');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'errorBanner';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.className = 'error-banner';
    document.body.prepend(errorDiv);
  }
  errorDiv.innerText = text;
  errorDiv.style.display = 'block';
  setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
}

export function addReactionToMessage(messageId, emoji, from) {
  const msgDiv = document.querySelector(`[data-message-id="${messageId}"] .reactions`);
  if (!msgDiv) return;
  let btn = msgDiv.querySelector(`button[data-emoji="${emoji}"]`);
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'reaction-btn';
    btn.setAttribute('data-emoji', emoji);
    btn.setAttribute('aria-label', `React with ${emoji}`);
    btn.innerText = emoji;
    btn.onclick = () => window.sendReaction(messageId, emoji);
    msgDiv.appendChild(btn);
    btn.focus();
  }
  // Optionally show reaction count and highlight if from current user
}

export function enableReactionUI(socket) {
  document.getElementById('messages').addEventListener('click', function(e) {
    if (e.target.classList.contains('reaction-btn')) {
      const messageId = e.target.closest('.message').dataset.messageId;
      const emoji = e.target.textContent;
      socket.send(JSON.stringify({ type: 'reaction', messageId, emoji }));
    }
  });
}

export function renderReactionsUIForMessage(msgId) {
  const msgDiv = document.querySelector(`.message[data-message-id='${msgId}']`);
  if (msgDiv) {
    const reactionsDiv = msgDiv.querySelector('.reactions');
    reactionsDiv.innerHTML = ['😀','😂','😍','👍','🎉','😢','😡'].map(emoji => `<button class='reaction-btn' tabindex='0' data-emoji='${emoji}' aria-label='React with ${emoji}'>${emoji}</button>`).join('');
  }
}
