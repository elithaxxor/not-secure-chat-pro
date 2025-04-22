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
}
