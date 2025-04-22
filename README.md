# Chat Application

A simple and interactive chat application built with HTML, CSS, and JavaScript. This application allows users to connect via WebSocket and exchange messages in real-time.

## Features
- **Real-Time Messaging**: Send and receive messages instantly using WebSocket.
- **User Identification**: Users are cd chat-app# Real-Time Chat Application

![Chat Application](https://img.shields.io/badge/Chat-Application-blue)
![Version](https://img.shields.io/badge/Version-1.0-green)

A modern, real-time chat application built with HTML, CSS, and JavaScript that allows users to communicate instantly across devices.

## ✨ Features

- **Real-Time Messaging**: Instantly send and receive messages through WebSocket technology
- **User Identification**: Each user is identified by their chosen username
- **User Connection Status**: Notifications when users connect or disconnect
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **IP Information Display**: Shows user's public and local IP addresses
- **Location Data**: Displays geographic location and ISP information
- **Modern UI**: Clean, minimalist interface for optimal user experience

## 🚀 Getting Started

### Prerequisites

- Web server (Apache, Nginx, etc.)
- Modern web browser
- WebSocket server running on port 3001

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-application.gitprompted to enter their name upon joining the chat.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.
- **Public and Local IP Display**: Shows the user's public and local IP addresses.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/chat-app.git

2. Deploy the files to your web server directory.
3. Ensure the WebSocket server is running on port 3001.

```cd chat/websocket_servers
    python websocket.py
```
4. Deploy the HTML and JavaScript files to your web server directory.
5. Open your web browser and navigate to the URL of your web server (e.g., http://yourserverip/chat).

# Configuration

- Clone the repository: `git clone https://github.com/yourusername/chat-application.git`
- Deploy the files to your web server directory.
- Open your web browser and navigate to the URL of your web server (e.g., http://yourserverip/chat).

- Ensure the WebSocket server is running on port 3001.Or whatever port you have configured for the webserver IP. 
```javascript
    ws.connect("ws://yourserverip:3001");
```
# 📝 Developer Notes
The application uses two methods for real-time communication:

Socket.io implementation (primary method)
Native WebSocket API (secondary/fallback method)