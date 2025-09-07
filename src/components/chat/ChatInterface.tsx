import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send, ChevronDown, Bot, User, FileText, Database, Mail, Calendar, Image, Code } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  tool?: string;
  attachments?: Array<{ name: string; type: string; }>;
}

interface ChatInterfaceProps {
  isSetupComplete?: boolean;
}

const tools = [
  { id: 'file-search', name: 'File Search', icon: FileText, description: 'Search through uploaded documents' },
  { id: 'database', name: 'Database Query', icon: Database, description: 'Query structured data' },
  { id: 'email', name: 'Email Search', icon: Mail, description: 'Search email content' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Access calendar information' },
  { id: 'image-analysis', name: 'Image Analysis', icon: Image, description: 'Analyze uploaded images' },
  { id: 'code-review', name: 'Code Review', icon: Code, description: 'Review and analyze code' },
];

export function ChatInterface({ isSetupComplete = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: isSetupComplete 
        ? "Hello! I'm your BreBot assistant. I can help you search through your data, analyze files, and much more. What would you like to do today?"
        : "Welcome to BreBot! I'm running in preview mode. Complete the setup to unlock full functionality.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      tool: selectedTool || undefined,
      attachments: attachments.map(file => ({ name: file.name, type: file.type }))
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: isSetupComplete 
          ? `I received your message${selectedTool ? ` with the ${tools.find(t => t.id === selectedTool)?.name} tool` : ''}${attachments.length > 0 ? ` and ${attachments.length} attachment(s)` : ''}. Let me help you with that.`
          : "I'm in preview mode, so I can't fully process your request yet. Please complete the setup to enable full functionality.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    // Reset form
    setInputValue("");
    setSelectedTool(null);
    setAttachments([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="flex flex-col h-full bg-card border border-card-border rounded-lg">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <Card className={`p-4 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted'
                }`}>
                  <div className="space-y-2">
                    {message.tool && (
                      <Badge variant="secondary" className="text-xs">
                        {tools.find(t => t.id === message.tool)?.name}
                      </Badge>
                    )}
                    <p className="text-sm">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {message.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-card-border">
        {/* Tool Selection */}
        {selectedTool && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedToolData && <selectedToolData.icon className="h-4 w-4 text-primary" />}
                <span className="text-sm font-medium">{selectedToolData?.name}</span>
                <span className="text-xs text-muted-foreground">{selectedToolData?.description}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTool(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {file.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-4 w-4 p-0 ml-1"
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex gap-2">
          {/* Tool Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="shrink-0"
                disabled={!isSetupComplete}
              >
                <ChevronDown className="h-4 w-4" />
                Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {tools.map((tool) => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="flex items-start gap-3 p-3"
                >
                  <tool.icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.description}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* File Attachment */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            disabled={!isSetupComplete}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <div className="flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isSetupComplete ? "Ask me anything..." : "Complete setup to start chatting..."}
              className="min-h-[60px] resize-none"
              disabled={!isSetupComplete}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && attachments.length === 0) || !isSetupComplete}
            className="shrink-0 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {!isSetupComplete && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Complete the setup to unlock full chat functionality
          </p>
        )}
      </div>
    </div>
  );
}