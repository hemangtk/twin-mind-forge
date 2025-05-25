import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Brain, Send, User, Bot, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    const rawProfile = localStorage.getItem('personalityProfile');
    console.log("Raw profile from localStorage:", rawProfile);

    const profile = JSON.parse(rawProfile || '{}');

    if (profile && profile.id) {
      setHasProfile(true);

      // fetch chat history from backend
      fetch(`https://16.171.8.239:3001/api/chat/${profile.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.messages)) {
            const messagesWithDates = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(messagesWithDates);
          }
        })
        .catch(err => {
          console.error("Failed to load chat history:", err);
        });

    } else {
      setHasProfile(false);
    }
  }, []);


  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // const generateBotResponse = async (userMessage: string): Promise<string> => {
  //   // In a real app, this would call your backend API with Gemini integration
  //   // For now, we'll simulate a personality-aware response
  //   const profile = JSON.parse(localStorage.getItem('personalityProfile') || '{}');
    
  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
  //   // Simple personality-aware responses (in real app, this would be Gemini with custom prompt)
  //   const responses = [
  //     "That's interesting! Based on what I know about your communication style, I think you'd approach this by...",
  //     "I can see why you'd think that way - it aligns with your decision-making preferences we discussed.",
  //     "Your perspective reminds me of how you described handling challenges. Have you considered...",
  //     "Given your learning style, you might find it helpful to...",
  //     "That resonates with the values you shared with me. In my opinion...",
  //   ];
    
  //   return responses[Math.floor(Math.random() * responses.length)] + " " + 
  //          "What do you think about taking a more structured approach to this?";
  // };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const profile = JSON.parse(localStorage.getItem("personalityProfile") || "{}");

try {
  const response = await fetch(`https://16.171.8.239:3001/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profileId: profile.id,
      message: inputValue,
    }),
  });

  console.log("Chat API raw response:", response);

  const data = await response.json();
  console.log("Chat API data:", data);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Unknown error");
  }

  const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: data.message.text,
    sender: "bot",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Chat API failed:", error);
    toast.error("Failed to get response. Please try again.");
  }

    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Chat cleared! I still remember your personality profile. What would you like to talk about?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    localStorage.removeItem('chatHistory');
    toast.success("Chat history cleared");
  };

  const resetProfile = () => {
    localStorage.removeItem('personalityProfile');
    localStorage.removeItem('chatHistory');
    toast.success("Profile reset. Redirecting to onboarding...");
    setTimeout(() => navigate('/onboarding'), 1500);
  };

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-blue-100">
          <Brain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Personality Profile Found</h2>
          <p className="text-gray-600 mb-6">
            You need to complete the onboarding process to create your AI twin first.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full"
          >
            Start Onboarding
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
              className="border-blue-200 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Your AI Twin</h1>
                <p className="text-xs text-gray-500">Personality-powered chat</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearChat}
              className="border-blue-200 hover:bg-blue-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetProfile}
              className="border-blue-200 hover:bg-blue-50"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-6 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-blue-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-100 px-6 py-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
