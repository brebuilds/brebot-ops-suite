import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, CheckCircle, XCircle, Command } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actor?: string;
  actions?: Array<{
    title: string;
    critical: boolean;
    pending?: boolean;
  }>;
}

export function ChatCommand() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'BreBot online and ready! I can help you plan, execute workflows, and manage your tasks. Try commands like /plan, /run, or /status.',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      type: 'user',
      content: '/plan Create a comprehensive marketing strategy for Q1',
      timestamp: new Date(Date.now() - 240000),
      actor: 'ceo',
    },
    {
      id: '3',
      type: 'bot',
      content: 'I\'ve analyzed your request for a Q1 marketing strategy. Here\'s my recommended approach:\n\n**Market Research & Analysis**\n- Competitor analysis and positioning review\n- Customer segmentation update\n- Performance metrics from Q4 review\n\n**Strategy Development**\n- Content calendar planning\n- Campaign themes and messaging\n- Budget allocation recommendations\n\n**Execution Planning**\n- Timeline with key milestones\n- Resource allocation\n- Success metrics definition',
      timestamp: new Date(Date.now() - 230000),
      actions: [
        { title: 'Generate detailed competitor analysis', critical: false },
        { title: 'Create Q1 content calendar', critical: false },
        { title: 'Send budget proposal to finance team', critical: true, pending: true },
      ],
    },
  ]);
  
  const [input, setInput] = useState('');
  const [actor, setActor] = useState<'ceo' | 'designer' | 'content' | 'manager'>('ceo');

  const actors = [
    { value: 'ceo', label: 'CEO', color: 'bg-red-500' },
    { value: 'designer', label: 'Designer', color: 'bg-blue-500' },
    { value: 'content', label: 'Content', color: 'bg-green-500' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-500' },
  ];

  const commands = [
    '/plan - Create a detailed action plan',
    '/run - Execute a workflow or plan',
    '/delegate - Assign tasks to team members',
    '/status - Get current system status',
    '/approve - Quick approve pending actions',
    '/help - Show all available commands',
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      actor,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Mock bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(input),
        timestamp: new Date(),
        actions: generateActions(input),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (input: string): string => {
    if (input.startsWith('/plan')) {
      return `I'll create a comprehensive plan for your request. Let me break this down into actionable steps with clear timelines and dependencies.`;
    } else if (input.startsWith('/run')) {
      return `Executing workflow... I'll coordinate the necessary actions and keep you updated on progress.`;
    } else if (input.startsWith('/status')) {
      return `System Status:\n• 3 workflows running\n• 4 tasks in progress\n• 2 approvals pending\n• All systems operational`;
    } else if (input.startsWith('/delegate')) {
      return `I'll assign this task to the appropriate team member based on their role and current workload.`;
    } else {
      return `I understand you'd like me to help with "${input}". Let me provide some guidance and suggested actions.`;
    }
  };

  const generateActions = (input: string) => {
    if (input.startsWith('/plan')) {
      return [
        { title: 'Research and gather requirements', critical: false },
        { title: 'Create detailed timeline', critical: false },
        { title: 'Submit plan for approval', critical: true },
      ];
    } else if (input.startsWith('/run')) {
      return [
        { title: 'Initialize workflow execution', critical: false },
        { title: 'Monitor progress and dependencies', critical: false },
        { title: 'Send completion notification', critical: true },
      ];
    }
    return [];
  };

  const handleAction = async (messageId: string, actionIndex: number, approve: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.actions) {
        const updatedActions = [...msg.actions];
        updatedActions[actionIndex] = {
          ...updatedActions[actionIndex],
          pending: false,
        };
        return { ...msg, actions: updatedActions };
      }
      return msg;
    }));

    // Mock API call
    console.log(`Action ${approve ? 'approved' : 'denied'} for message ${messageId}, action ${actionIndex}`);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[600px]">
      {/* Chat Area */}
      <div className="col-span-8">
        <Card className="bg-card border-card-border h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                BreBot Console
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-[80%] ${
                      message.type === 'user' ? 'order-2' : 'order-1'
                    }`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {message.type === 'user' 
                              ? actors.find(a => a.value === message.actor)?.label || 'User'
                              : 'BreBot'
                            }
                          </span>
                          {message.actor && (
                            <Badge 
                              className={`text-xs ${
                                actors.find(a => a.value === message.actor)?.color
                              } text-white`}
                            >
                              {message.actor.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* Actions */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h4 className="text-sm font-medium">Next 3 Actions:</h4>
                          <div className="space-y-2">
                            {message.actions.map((action, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between p-2 rounded border border-card-border bg-card/50"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  <span className="text-sm">{action.title}</span>
                                  {action.critical && (
                                    <Badge variant="outline" className="text-xs text-warning border-warning/50">
                                      Critical
                                    </Badge>
                                  )}
                                </div>
                                
                                {action.critical && action.pending !== false && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAction(message.id, index, true)}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAction(message.id, index, false)}
                                    >
                                      <XCircle className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Select value={actor} onValueChange={(value: any) => setActor(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actors.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${a.color}`} />
                        {a.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or use /command..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              
              <Button onClick={sendMessage} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commands Panel */}
      <div className="col-span-4">
        <Card className="bg-card border-card-border h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Command className="h-5 w-5" />
              Quick Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commands.map((command, index) => {
              const [cmd, desc] = command.split(' - ');
              return (
                <div 
                  key={index}
                  className="p-3 rounded-lg border border-card-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setInput(cmd)}
                >
                  <div className="font-mono text-sm text-primary">{cmd}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}