// User module: handles user state and user list UI
export let currentUser = null;
export let isAdmin = false;
export function setCurrentUser(username, admin=false) {
  currentUser = username;
  isAdmin = admin;
}
export function renderUserList(users) {
  const sidebar = document.getElementById('userListSidebar');
  sidebar.innerHTML = '<h3>Users</h3>' + users.map(u => `<div class="user-entry">${u.username}${u.isAdmin ? ' <span title="admin">⭐</span>' : ''}${u.muted ? ' <span title="muted">🔇</span>' : ''}</div>`).join('');
  sidebar.style.display = users.length ? 'block' : 'none';

  // Populate dropdown for private messaging
  const userSelect = document.getElementById('userSelect');
  if (userSelect) {
    userSelect.innerHTML = '<option value="">Everyone (public)</option>' + users.filter(u => u.username !== currentUser).map(u => `<option value="${u.username}">${u.username}${u.isAdmin ? ' (admin)' : ''}${u.muted ? ' (muted)' : ''}</option>`).join('');
  }

  // Show/hide admin buttons if current user is admin and a target is selected
  const muteBtn = document.getElementById('muteBtn');
  const kickBtn = document.getElementById('kickBtn');
  const banBtn = document.getElementById('banBtn');
  if (muteBtn && kickBtn && banBtn && isAdmin) {
    muteBtn.style.display = '';
    kickBtn.style.display = '';
    banBtn.style.display = '';
  } else if (muteBtn && kickBtn && banBtn) {
    muteBtn.style.display = 'none';
    kickBtn.style.display = 'none';
    banBtn.style.display = 'none';
  }
}
