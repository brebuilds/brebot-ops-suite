import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Users, Plus, CheckCircle, AlertTriangle, Pause, Search } from "lucide-react";
import { BotSetupWizard } from "./BotSetupWizard";

interface BotEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  reportsTo?: string;
  status: "active" | "under-construction" | "overworked" | "hiring" | "paused";
  responsibilities: string[];
  tools: string[];
  description: string;
  level: number; // For hierarchy display
}

const mockEmployees: BotEmployee[] = [
  {
    id: "ceo-001",
    name: "BreBot Prime",
    role: "Chief Executive Bot",
    department: "Executive",
    status: "active",
    responsibilities: ["Strategic oversight", "Decision coordination", "Performance monitoring"],
    tools: ["Analytics Dashboard", "Meeting Scheduler", "Performance Tracker"],
    description: "The main orchestrating bot that manages and coordinates all other bots.",
    level: 0
  },
  {
    id: "des-001",
    name: "DesignBot Alpha",
    role: "Lead Designer",
    department: "Design",
    reportsTo: "ceo-001",
    status: "active",
    responsibilities: ["UI/UX Design", "Brand Guidelines", "Design System Management"],
    tools: ["Figma API", "Color Palette Generator", "Typography Manager"],
    description: "Handles all design-related tasks and maintains visual consistency.",
    level: 1
  },
  {
    id: "dev-001",
    name: "CodeBot Beta",
    role: "Senior Developer",
    department: "Engineering",
    reportsTo: "ceo-001",
    status: "under-construction",
    responsibilities: ["Code Generation", "Bug Fixes", "Code Reviews"],
    tools: ["GitHub API", "Code Analyzer", "Testing Framework"],
    description: "Handles development tasks and code quality assurance.",
    level: 1
  },
  {
    id: "con-001",
    name: "ContentBot Gamma",
    role: "Content Manager",
    department: "Marketing",
    reportsTo: "ceo-001",
    status: "overworked",
    responsibilities: ["Content Creation", "SEO Optimization", "Social Media"],
    tools: ["Content Generator", "SEO Analyzer", "Social Media API"],
    description: "Creates and manages all content across platforms.",
    level: 1
  },
  {
    id: "sup-001",
    name: "SupportBot Delta",
    role: "Customer Support",
    department: "Support",
    reportsTo: "ceo-001",
    status: "hiring",
    responsibilities: ["Customer Inquiries", "Issue Resolution", "Documentation"],
    tools: ["Ticket System", "Knowledge Base", "Chat Interface"],
    description: "Provides customer support and handles user inquiries.",
    level: 1
  },
  {
    id: "ana-001",
    name: "AnalyticsBot Epsilon",
    role: "Data Analyst",
    department: "Analytics",
    reportsTo: "ceo-001",
    status: "paused",
    responsibilities: ["Data Analysis", "Report Generation", "Insights"],
    tools: ["Data Processor", "Chart Generator", "Report Builder"],
    description: "Analyzes data and generates insights for decision making.",
    level: 1
  }
];

const getStatusIcon = (status: BotEmployee["status"]) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "under-construction":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "overworked":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "hiring":
      return <Search className="h-4 w-4 text-primary" />;
    case "paused":
      return <Pause className="h-4 w-4 text-muted-foreground" />;
    default:
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: BotEmployee["status"]) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20";
    case "under-construction":
      return "bg-warning/10 text-warning border-warning/20";
    case "overworked":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "hiring":
      return "bg-primary/10 text-primary border-primary/20";
    case "paused":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
};

export function BotsInterface() {
  const [selectedBot, setSelectedBot] = useState<BotEmployee | null>(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [setupBotType, setSetupBotType] = useState<"brebot" | "employee" | null>(null);

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));
  
  const getBotsByDepartment = (dept: string) => 
    mockEmployees.filter(emp => emp.department === dept);

  const getDirectReports = (botId: string) =>
    mockEmployees.filter(emp => emp.reportsTo === botId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            Your Employees
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your bot workforce and organizational structure
          </p>
        </div>
        <Button 
          className="bg-gradient-primary text-primary-foreground shadow-glow"
          onClick={() => {
            setSetupBotType("employee");
            setShowSetupWizard(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Hire New Bot
        </Button>
      </div>

      {/* Organizational Chart */}
      <div className="space-y-8">
        {/* CEO Level */}
        <div className="flex justify-center">
          {mockEmployees.filter(emp => emp.level === 0).map(bot => (
            <Card 
              key={bot.id}
              className="w-64 bg-card border-card-border shadow-card hover:shadow-hover transition-all cursor-pointer"
              onClick={() => setSelectedBot(bot)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-primary">
                    <Bot className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{bot.name}</h3>
                    <p className="text-sm text-muted-foreground">{bot.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(bot.status)}
                    <Badge className={getStatusColor(bot.status)}>
                      {bot.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(department => (
            <div key={department} className="space-y-4">
              <h3 className="text-lg font-medium text-foreground text-center">
                {department}
              </h3>
              <div className="space-y-3">
                {getBotsByDepartment(department).map(bot => (
                  <Card 
                    key={bot.id}
                    className="bg-card border-card-border shadow-card hover:shadow-hover transition-all cursor-pointer"
                    onClick={() => setSelectedBot(bot)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{bot.name}</h4>
                          <p className="text-xs text-muted-foreground">{bot.role}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusIcon(bot.status)}
                          <Badge 
                            className={`text-xs ${getStatusColor(bot.status)}`}
                          >
                            {bot.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bot Details Dialog */}
      <Dialog open={!!selectedBot} onOpenChange={() => setSelectedBot(null)}>
        <DialogContent className="max-w-2xl bg-card border-card-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl">{selectedBot?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {selectedBot?.role} • {selectedBot?.department}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBot && (
            <div className="space-y-6">
              {/* Status and Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedBot.status)}
                    <Badge className={getStatusColor(selectedBot.status)}>
                      {selectedBot.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">{selectedBot.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Responsibilities</h4>
                <div className="space-y-2">
                  {selectedBot.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Tools & Access</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBot.tools.map((tool, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-muted/50"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-card-border">
                <Button variant="outline">Edit Bot</Button>
                <Button 
                  className="bg-gradient-primary text-primary-foreground"
                  onClick={() => {
                    setSetupBotType(selectedBot?.id === "ceo-001" ? "brebot" : "employee");
                    setShowSetupWizard(true);
                    setSelectedBot(null);
                  }}
                >
                  {selectedBot?.id === "ceo-001" ? "Deep Configure" : "Configure"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bot Setup Wizard */}
      <BotSetupWizard
        isOpen={showSetupWizard}
        onClose={() => {
          setShowSetupWizard(false);
          setSetupBotType(null);
        }}
        botType={setupBotType}
      />
    </div>
  );
}