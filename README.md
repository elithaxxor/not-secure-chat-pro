# Not Secure Chat Pro

A real-time chat application with WebSocket and Socket.io support, featuring a custom CAPTCHA, emoji picker, and responsive design.

## Features
- Real-time chat using WebSocket and Socket.io
- Custom 'I'm not a robot' CAPTCHA
- Emoji picker
- Responsive design for desktop and mobile
- Avatar support (optional)
- Public and local IP display

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- Python 3 (for optional Python WebSocket server)

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

## Accessibility
- All buttons have accessible labels (aria-label or visible text).
- Images include descriptive alt attributes.
- Keyboard navigation is supported for CAPTCHA and chat controls.

## Security Warning
This project is for educational/demo purposes and is **not secure for production**. Do not use in production environments.

## License
MIT