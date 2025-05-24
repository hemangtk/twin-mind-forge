
# PersonaGen - AI Personality Twin Chatbot

PersonaGen is a full-stack web application that creates a personalized AI chatbot ("twin") that mimics the user's tone, decision-making style, and personality. Users complete a personality assessment during onboarding, and the AI learns to communicate in their unique style.

## 🌟 Features

- **Beautiful Landing Page**: Modern, techy design with smooth animations
- **Personality Onboarding**: 7 thoughtful questions to build a comprehensive personality profile
- **AI Chat Interface**: Real-time chat with your personality twin
- **Memory System**: Stores personality profile and chat history locally
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Voice Input Support**: Optional voice input during onboarding (UI ready, implementation pending)

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for beautiful, accessible components
- **React Router** for navigation
- **Lucide React** for icons

### Current Implementation
- **Local Storage** for personality profiles and chat history
- **Simulated AI Responses** (ready for Gemini API integration)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (Shadcn/UI)
├── pages/              # Main application pages
│   ├── Index.tsx       # Landing page
│   ├── Onboarding.tsx  # Personality questionnaire
│   ├── Chat.tsx        # Chat interface with AI twin
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles and Tailwind imports
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personagen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 How It Works

1. **Landing Page**: Users are welcomed with a beautiful, modern interface explaining PersonaGen's capabilities

2. **Onboarding Flow**: 
   - 7 carefully crafted personality questions
   - Text input with optional voice recording UI
   - Progress tracking and validation
   - Creates comprehensive personality profile

3. **Chat Experience**:
   - Real-time chat interface with typing indicators
   - Personality-aware responses (simulated, ready for AI integration)
   - Chat history persistence
   - Profile management options

4. **Data Storage**:
   - Personality profiles stored in localStorage
   - Chat history preserved between sessions
   - Easy reset and management options

## 🔄 Future Backend Integration

The frontend is designed to easily integrate with a Node.js + Express backend:

### Planned Backend Structure
```
backend/
├── server.js           # Express server setup
├── routes/
│   ├── personality.js  # Personality profile endpoints
│   ├── chat.js        # Chat and AI response endpoints
│   └── memory.js      # Memory management
├── utils/
│   ├── gemini.js      # Gemini API integration
│   └── memory.js      # JSON file memory system
└── data/              # Local JSON storage
```

### API Endpoints (Planned)
- `POST /api/personality` - Save personality profile
- `GET /api/personality/:id` - Retrieve personality profile
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/:profileId` - Get chat history
- `DELETE /api/chat/:profileId` - Clear chat history

## 🤖 AI Integration (Next Steps)

The app is ready for Gemini API integration:

1. **Add Gemini API key** to backend environment
2. **Create personality-aware system prompts** using stored profiles
3. **Replace simulated responses** with real Gemini API calls
4. **Implement conversation memory** and context management

## 🎨 Design System

- **Colors**: Blue-purple gradient theme with modern accessibility
- **Typography**: Inter font family for clean, readable text
- **Components**: Consistent Shadcn/UI components throughout
- **Animations**: Smooth transitions and hover effects
- **Layout**: Responsive grid system with mobile-first approach

## 🔧 Customization

### Adding New Personality Questions
Edit the `personalityQuestions` array in `src/pages/Onboarding.tsx`:

```typescript
const personalityQuestions = [
  {
    id: 8,
    question: "Your new question here?",
    placeholder: "Helpful placeholder text..."
  }
];
```

### Modifying AI Response Logic
Update the `generateBotResponse` function in `src/pages/Chat.tsx` to integrate with your AI service.

### Styling Changes
Modify `tailwind.config.ts` and `src/index.css` for theme customization.

## 📱 Mobile Responsive

The app is fully responsive and provides an excellent experience on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Privacy & Security

- No user authentication required for this demo version
- All data stored locally in browser localStorage
- No external API calls in current implementation
- Ready for secure backend integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS. Ready for AI integration with Gemini API.
