"use client";
import { Bot, Loader, MessageCircle, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui/PlaceholderAndVanishInput";


const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef: any = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const assistantMessage = data.message;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "system",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  

  const placeholders = [
    "What is my zodiac sign?",
    "What does my birth chart say about me?",
    "What are the personality traits of a Leo?",
    "When is Mercury retrograde this year?",
    "How do I read my natal chart?",
    "What are the meanings of my planets in my birth chart?",
    "How does the moon affect my mood?",
    "Which zodiac signs are most compatible with Pisces?",
    "What does it mean when a planet is in retrograde?",
    "Can astrology predict my future?",
    "What are the birthstone and lucky numbers for my sign?",
    "What does the position of Venus say about love and relationships?",
    "What is the significance of the rising sign?",
    "What do eclipses mean in astrology?",
    "How can astrology help with career guidance?",
  ];
  

  return (
    <div className="fixed bottom-5 right-5 z-50 scrollbar-hidden">
      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="absolute bottom-10 right-10 w-[80vh] bg-gray-900 text-white rounded-lg shadow-lg h-[85vh] flex flex-col animate-slide-in border border-gray-700">
          <div className="bg-[#03001427] text-white p-4 rounded-t-lg font-bold flex justify-between items-center">
            <span>Chat</span>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  msg.role === "user" ? "justify-end " : "justify-start"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-6 w-6 text-gray-500" />
                ) : (
                  <Bot className="h-6 w-6 text-gray-500" />
                )}
                <div
                  className={`p-3 rounded-lg max-w-xs text-sm ${
                    msg.role === "user"
                      ? "bg-[#03001427] text-white self-end"
                      : "bg-gray-800 text-gray-200 self-start"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg max-w-xs text-sm bg-gray-800 text-gray-200 self-start flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-700 flex">
            <PlaceholdersAndVanishInput
              // placeholders={["Ask me related to astralogy..."]}
              placeholders={placeholders}
              onChange={(e: any) => setUserInput(e.target.value)}
              onSubmit={sendMessage}
              disabled={isLoading}
              prompt={userInput}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;