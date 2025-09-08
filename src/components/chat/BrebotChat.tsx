import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Mic, Paperclip, Settings } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "brebot";
  timestamp: Date;
  type?: "text" | "image" | "file";
}

export function BrebotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm BreBot, your AI assistant and organizational coordinator. I have full access to your project knowledge, team structure, and workflows. How can I help you today?",
      sender: "brebot",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateBrebotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = "";
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("team") || lowerMessage.includes("employees")) {
      response = "I currently manage 6 team members across different departments: DesignBot Alpha (Design), CodeBot Beta (Engineering - under construction), ContentBot Gamma (Marketing - currently overworked), SupportBot Delta (Support - hiring in progress), and AnalyticsBot Epsilon (Analytics - paused). Would you like me to show you detailed status reports or help optimize the team structure?";
    } else if (lowerMessage.includes("workflow") || lowerMessage.includes("n8n")) {
      response = "I can create and manage n8n workflows for your team. I have API access to your n8n instance and can dynamically generate workflows based on your needs. Would you like me to create a new workflow, modify an existing one, or show you the current workflow status?";
    } else if (lowerMessage.includes("create") || lowerMessage.includes("new bot")) {
      response = "I can help you create new employee or manager bots! I'll handle the entire process - from defining their role and responsibilities to setting up their n8n workflows and tool access. What type of bot would you like to create and for which department?";
    } else if (lowerMessage.includes("status") || lowerMessage.includes("report")) {
      response = "Here's a quick status update: DesignBot Alpha is performing well, CodeBot Beta needs attention (under construction), ContentBot Gamma is overwhelmed and may need support or workflow optimization. SupportBot Delta position is open for hiring, and AnalyticsBot Epsilon is temporarily paused. Would you like detailed analytics on any specific area?";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      response = "I can help you with: 🤖 Managing your bot workforce, 📊 Creating detailed performance reports, ⚡ Building and modifying n8n workflows, 🔧 Optimizing team productivity, 💬 Answering questions about your projects, 📈 Providing strategic insights, and much more! I have access to all your project data and can coordinate between all systems. What would you like to focus on?";
    } else {
      response = "I understand your request and I'm processing it with my full knowledge of your projects and team structure. Based on my analysis, I can provide personalized recommendations and take action on your behalf. Is there a specific aspect of your organization or projects you'd like me to focus on?";
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: "brebot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate BreBot response
    await simulateBrebotResponse(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <CardHeader className="border-b border-card-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">BreBot Prime</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success mr-1"></div>
                  Online
                </Badge>
                <span className="text-xs text-muted-foreground">AI Assistant & CEO</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.sender === "brebot"
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-muted"
                    }
                  >
                    {message.sender === "brebot" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      "U"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="border-t border-card-border p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-end gap-2 bg-muted rounded-lg p-2">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chat with BreBot about your projects, team, or workflows..."
              className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          BreBot has access to all your project data, team status, and workflows
        </p>
      </div>
    </div>
  );
}