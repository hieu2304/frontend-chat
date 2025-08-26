# Real-time Chat Analytics Frontend

A modern chat application built with Next.js 15, TypeScript, and Tailwind CSS. Features real-time WebSocket communication with message analytics and session statistics.

## 🚀 Features

- **Real-time Chat**: WebSocket-based messaging with instant delivery
- **Message Analytics**: Word count, character count, sentence analysis
- **Sentiment Detection**: Basic sentiment analysis (positive/negative/neutral)
- **Question Detection**: Identifies questions vs statements
- **Session Statistics**: Real-time chat session metrics
- **Modern UI**: Clean, responsive interface with dark mode
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Reusable UI components

## 🛠 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **WebSocket API** - Real-time communication
- **clsx & tailwind-merge** - Class name utilities

## 📋 Prerequisites

- Backend server running on port 8000 (for full functionality)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx     # Button with variants
│   │   ├── Input.tsx      # Input with icons
│   │   ├── Card.tsx       # Card components
│   │   ├── Badge.tsx      # Status badges
│   │   ├── Avatar.tsx     # User avatars
│   │   ├── Spinner.tsx    # Loading indicators
│   │   └── index.ts       # Component exports
│   └── chat/              # Chat-specific components
│       ├── Chat.tsx       # Main chat container
│       ├── ChatWindow.tsx # Message display area
│       ├── MessageBubble.tsx # Individual messages
│       ├── MessageInput.tsx  # Message input
│       ├── StatsPanel.tsx    # Analytics display
│       └── index.ts       # Component exports
├── hooks/
│   ├── useWebSocket.ts    # WebSocket connection management
│   └── useApi.ts          # REST API integration
├── lib/
│   ├── api.ts             # API client and utilities
│   ├── config.ts          # Configuration management
│   └── utils.ts           # Utility functions
├── types/
│   └── chat.ts            # TypeScript type definitions
└── public/                # Static assets
```

## 🎯 Key Components

### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: With icons, validation states, and labels
- **Card**: Flexible card layout with header, content, footer
- **Badge**: Status indicators with different colors
- **Avatar**: User avatars with fallback initials
- **Spinner**: Loading indicators

### Chat Components
- **Chat**: Main container managing state and WebSocket
- **ChatWindow**: Message display with auto-scroll
- **MessageBubble**: Individual message with analytics
- **MessageInput**: Message input with validation
- **StatsPanel**: Real-time session statistics

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env.local` file:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/chat
```