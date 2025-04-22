// Admin module: handles admin actions (mute, kick, ban)
export function sendAdminAction(socket, action, target) {
  socket.send(JSON.stringify({ type: 'admin', action, target }));
}
