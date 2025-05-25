
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Brain, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

const personalityQuestions = [
  {
    id: 1,
    question: "How would you describe your communication style?",
    placeholder: "e.g., Direct and to-the-point, or warm and conversational..."
  },
  {
    id: 2,
    question: "When making decisions, what matters most to you?",
    placeholder: "e.g., Logic and data, gut feeling, input from others..."
  },
  {
    id: 3,
    question: "How do you typically respond to stress or challenges?",
    placeholder: "e.g., Take a step back and analyze, jump into action, seek support..."
  },
  {
    id: 4,
    question: "What's your approach to learning new things?",
    placeholder: "e.g., Hands-on experimentation, reading and research, learning from others..."
  },
  {
    id: 5,
    question: "How do you prefer to spend your free time?",
    placeholder: "e.g., Socializing with friends, reading, outdoor activities, creative projects..."
  },
  {
    id: 6,
    question: "What values guide your daily decisions?",
    placeholder: "e.g., Honesty and integrity, creativity and innovation, helping others..."
  },
  {
    id: 7,
    question: "Describe your ideal work environment and style.",
    placeholder: "e.g., Collaborative team setting, independent work, structured routines..."
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;
  const currentAnswer = answers[personalityQuestions[currentQuestion].id] || "";

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [personalityQuestions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice input not implemented in this demo");
    }
  };

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const formattedAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [`q${key}`, value])
    );

    const response = await fetch("http://localhost:3001/api/personality", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: formattedAnswers })
    });

    console.log("Raw backend response:", response);
    const data = await response.json();
    const profileToStore = {
      id: data.profileId,
      answers: formattedAnswers
    };
    localStorage.setItem("personalityProfile", JSON.stringify(profileToStore));
    console.log("Saved to localStorage:", profileToStore);

    console.log("Parsed data:", data);

    if (!response.ok || !data.success || !data.profileId) {
      toast.error("Failed to save profile.");
      return;
    }

    navigate("/chat");
  } catch (error) {
    console.error("Error during profile submission:", error);
    toast.error("Something went wrong.");
  } finally {
    setIsSubmitting(false);
  }
};


  const currentQuestionData = personalityQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PersonaGen
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="border-blue-200 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {personalityQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestionData.question}
              </h2>
              <p className="text-gray-600">
                Be as detailed as you'd like - this helps create a more accurate personality twin.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={currentQuestionData.placeholder}
                  className="min-h-32 resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={`absolute bottom-3 right-3 ${
                    isRecording ? 'bg-red-50 border-red-200 text-red-600' : 'border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              {isRecording && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording... (Demo mode)</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!currentAnswer.trim() || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isSubmitting ? (
                  "Creating Twin..."
                ) : currentQuestion === personalityQuestions.length - 1 ? (
                  "Create My Twin"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> The more specific you are, the better your AI twin will understand and mimic your personality!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
