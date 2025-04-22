# Not Secure Chat Pro

A real-time chat application with WebSocket and Socket.io support, featuring accessibility, emoji reactions, user list, dark mode, i18n, and more.

## Features
- Real-time chat using WebSocket and Socket.io
- Custom CAPTCHA with accessible alternative
- Emoji picker and message reactions
- Responsive design for desktop and mobile
- Avatar support with preview and validation
- Public and local IP display
- User list sidebar (real-time)
- Private messaging (in progress)
- Message history (localStorage)
- Browser notifications
- Dark mode (theming toggle)
- Language selector (English/Spanish, i18n-ready)
- Admin controls (planned)

## Accessibility
- All buttons have accessible labels (aria-label or visible text)
- Images include descriptive alt attributes
- Keyboard navigation and focus outlines
- Live region for new messages
- Accessible CAPTCHA option

## Security
- All user input is sanitized
- Avatar uploads validated (type/size)
- Client-side rate limiting for spam prevention

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- Python 3 (optional, for Python WebSocket server)

### Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/elithaxxor/not-secure-chat-pro.git
   cd not-secure-chat-pro
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js WebSocket server:
   ```bash
   npm start
   # or
   node websocket_servers/server.js
   ```
4. (Optional) Start the Python WebSocket server:
   ```bash
   cd websocket_servers
   python websocket.py
   ```
5. Serve the front-end files (e.g., with Python):
   ```bash
   python3 -m http.server 3000
   ```
6. Open your browser to `http://localhost:3000`.

### Docker
To run with Docker:
```bash
docker build -t chat-app .
docker run -p 3000:3000 -p 3001:3001 chat-app
```

### CI/CD
- GitHub Actions workflow for linting and basic tests is included in `.github/workflows/ci.yml`.

## Changelog
See [CHANGELOG.md](CHANGELOG.md) for a list of changes and new features.

## Security Warning
This project is for educational/demo purposes and is **not secure for production**. Do not use in production environments.

## License
MIT