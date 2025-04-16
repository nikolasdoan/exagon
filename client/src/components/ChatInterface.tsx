import { useState, useRef, useEffect } from "react";
import { responses } from "@/lib/responses";

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

interface ChatInterfaceProps {
  updateUI: (uiType: string | null) => void;
}

const ChatInterface = ({ updateUI }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "What can I help you build today? 3D asset, scene, or something else?",
      sender: "bot"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const conversationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation when messages change
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, "user");
    
    // Process input against response patterns
    const input = inputValue.trim();
    setInputValue("");
    
    // Simulate typing delay
    setTimeout(() => {
      // Find matching response pattern
      const matchedResponse = responses.find(r => 
        r.triggers.some(regex => regex.test(input))
      );
      
      if (matchedResponse) {
        addMessage(matchedResponse.reply, "bot");
        if (matchedResponse.ui) {
          updateUI(matchedResponse.ui);
        }
      } else {
        addMessage("I'll help with that. What else would you like to configure?", "bot");
      }
    }, 700);
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">smart_toy</span>
            <h2 className="font-medium text-gray-800">Assistant Chat</h2>
          </div>
        </div>
        
        {/* Conversation Area */}
        <div 
          ref={conversationRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]"
        >
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message-container flex ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              <div 
                className={`message max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-[#e3f2fd]' 
                    : 'bg-[#f5f5f5]'
                } rounded-lg p-3 text-gray-800`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeypress}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type your message..."
            />
            <button 
              onClick={handleSend}
              className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              <span className="material-icons">send</span>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Try: "Object, textures, animation" to see the project setup
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
