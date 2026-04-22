# ChatBox - Real-time Chat Application Frontend 🗨️

## 📄 Overview

ChatBox is a modern, responsive real-time chat application frontend built with the latest React ecosystem. It provides a complete chat experience including user authentication, private messaging, group chats, contact management, and profile handling. Designed for seamless integration with a backend API and WebSocket server.

## ✨ Features

- 👤 **Complete Authentication Flow**: Login, Register, Forgot Password, Reset Password, Profile Management
- 💬 **Real-time Messaging**: Private chats and group conversations with Socket.io integration
- 👥 **Contact & Group Management**: Add contacts, create groups via intuitive modals
- 📱 **Responsive Design**: Mobile-first UI with TailwindCSS and Framer Motion animations
- 🔐 **Protected Routes**: Secure chat access with Redux auth state management
- 📂 **Chat Organization**: Chat lists, message bubbles, input with rich UX
- ⚡ **Modern State Management**: Redux Toolkit for auth, chat, and messages
- 🚀 **Optimized Performance**: Vite for fast builds and hot reloads
- 🌐 **Deployment Ready**: Vercel configuration included

## 🛠️ Tech Stack

| Category             | Technologies                                                    |
|----------------------|-----------------------------------------------------------------|
| **Framework**        | React 19.2.4, React Router 7.14.0                               |
| **Styling**          | TailwindCSS 4.2.2 (w/ Vite plugin), CSS Modules                 |
| **State Management** | Redux Toolkit 2.11.2, React-Redux 9.2.0                         | 
| **Real-time**        | Socket.io-client 4.8.3, Custom Socket Hook                      |
| **HTTP Client**      | Axios 1.15.0                                                    |
| **UI/Animations**    | Framer Motion 12.38.0, React Icons 5.6.0, React Hot Toast 2.6.0 |
| **Build Tool**       | Vite 5.4.0                                                      |


## 📋 Prerequisites

- Node.js 18+ 
- npm
- Backend server with REST API endpoints (auth, chats, messages, groups)
- Socket.io server for real-time communication

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mjansitha03/chat-frontend.git
   cd chat-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view in browser.

4. **Build for production**
   ```bash
   npm run build
   ```

Available scripts:
```bash
npm run dev     # Start dev server
npm run build   # Build for production

```

## 📁 Project Structure

```
chat-frontend/
├── public/                 # Static assets
├── src/
│   ├── Components/         # Reusable UI components (ChatList, MessageBubble, Modals, Navbar, MessageInput)
│   ├── Pages/              # Route-based pages (ChatPage, LoginPage, ProfilePage, etc.)
│   ├── Hooks/              # Custom hooks (useSockets)
│   ├── Redux/              # Redux slices & store (authSlice, chatSlice, messageSlice)
│   ├── Services/           # API & Socket services
│   ├── Utils/              # Utilities (themes)
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── vercel.json             # Vercel deployment config
├── vite.config.js          # Vite configuration
├── package.json
└── README.md
```

## ☁️ Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo in Vercel dashboard
3. Set environment variables for backend API URL and Socket server
4. Deploy! 

Environment variables needed (set in Vercel):
```
VITE_API_URL=https://chat-backend-nvpz.onrender.com
```

## 🔌 Backend Requirements

This frontend expects:
- **REST API**: `/auth/login`, `/auth/register`, `/users/me`, `/chats`, `/messages`, `/groups`
- **WebSocket**: Namespaces for real-time messages, typing indicators, online status
- JWT authentication

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

Built with ❤️ for modern chat experiences. Contributions welcome!"

