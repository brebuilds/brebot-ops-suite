import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupWizard } from "@/components/wizard/SetupWizard";
import { OperatorConsole } from "@/components/console/OperatorConsole";
import { SettingsPanel } from "@/components/console/panels/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Settings, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("wizard");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    setActiveTab("console");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">BreBot Operator</h1>
                <p className="text-sm text-muted-foreground">Privacy-first AI assistant platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>BreBot Settings</DialogTitle>
                  </DialogHeader>
                  <SettingsPanel />
                </DialogContent>
              </Dialog>
              {isSetupComplete && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success-foreground">Online</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="wizard" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup Wizard
            </TabsTrigger>
            <TabsTrigger 
              value="console" 
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isSetupComplete ? "Console" : "Console (Preview)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="space-y-6">
            <SetupWizard onComplete={handleSetupComplete} />
          </TabsContent>

          <TabsContent value="console" className="space-y-6">
            {!isSetupComplete && (
              <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  <strong>Preview Mode:</strong> Complete the setup wizard to unlock full functionality
                </p>
              </div>
            )}
            <OperatorConsole isPreviewMode={!isSetupComplete} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
