import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupWizard } from "@/components/wizard/SetupWizard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { StatusTab } from "@/components/tabs/StatusTab";
import { HistoryTab } from "@/components/tabs/HistoryTab";
import { SettingsTab } from "@/components/tabs/SettingsTab";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Activity, Clock, Settings, Bot as BotIcon } from "lucide-react";
import { BotsInterface } from "@/components/bots/BotsInterface";
const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    setIsSetupWizardOpen(false);
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-card-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">BreBot</h1>
                <p className="text-sm text-muted-foreground">Privacy-first AI assistant platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              {isSetupComplete && <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success-foreground">Online</span>
                </div>}
              
              {/* Main Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="status" className="flex items-center gap-2 text-xs">
                    <Activity className="h-3 w-3" />
                    Status
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="setup" className="flex items-center gap-2 text-xs">
                    <BotIcon className="h-3 w-3" />
                    Bots
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2 text-xs">
                    <Settings className="h-3 w-3" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {activeTab === "chat" || !["status", "history", "settings", "setup"].includes(activeTab) ? <div className="h-full">
            <ChatInterface isSetupComplete={isSetupComplete} />
          </div> : <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsContent value="status" className="mt-0 h-full">
              <StatusTab />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0 h-full">
              <HistoryTab />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 h-full">
              <SettingsTab />
            </TabsContent>
            
            <TabsContent value="setup" className="mt-0 h-full">
              <div className="space-y-6">
                <BotsInterface />
                
                {!isSetupComplete && (
                  <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-foreground">Build Your First Bot</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Complete the setup wizard to create and configure your initial bot
                    </p>
                    <SetupWizard onComplete={handleSetupComplete} />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>}
      </main>
    </div>;
};
export default Index;