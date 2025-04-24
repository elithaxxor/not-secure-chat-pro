# Not Secure Chat Pro

A modular, real-time chat application with private messaging, admin controls, emoji reactions, accessibility, and comprehensive testing.

---

## Features
- **Real-time chat** (WebSocket backend)
- **Private messaging** between users
- **Admin controls:** mute, kick, ban users
- **Emoji reactions** to messages
- **User list sidebar** with live updates
- **Modular frontend code** (ES modules)
- **Accessibility:** ARIA labels, keyboard navigation, color contrast
- **Responsive UI** for desktop and mobile
- **Theming:** Light/Dark mode toggle
- **Language selector** (English, Español)
- **Avatar upload & validation**
- **Local message history** (with localStorage)
- **Browser notifications** for new messages
- **Comprehensive Cypress tests** (including accessibility via axe-core)

---

## Getting Started

### Prerequisites
- Node.js (for Cypress tests)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Running the Chat App
1. Start the WebSocket server (`server.js` in `websocket_servers/`):
   ```bash
   node websocket_servers/server.js
   ```
2. Open `index.html` in your browser (or serve via a local web server).

### Running Tests
1. Install Cypress (if not already):
   ```bash
   npm install cypress cypress-axe --save-dev
   ```
2. Run all tests:
   ```bash
   npx cypress run
   ```

---

## Accessibility & Manual Testing Checklist
- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] Screen reader support (ARIA labels/roles)
- [x] Color contrast meets WCAG AA
- [x] Error banners are accessible
- [x] Responsive on all devices
- [x] All features work on Chrome, Firefox, Safari, Edge, iOS, Android

---

## Contributing
- Follow modular code style (see `modules/` directory)
- Write or update Cypress tests for new features
- Document changes in `CHANGELOG.md`

---

## License
MIT