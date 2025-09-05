import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupWizard } from "@/components/wizard/SetupWizard";
import { OperatorConsole } from "@/components/console/OperatorConsole";
import { Button } from "@/components/ui/button";
import { Bot, Settings, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("wizard");
  const [isSetupComplete, setIsSetupComplete] = useState(false);

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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
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
              disabled={!isSetupComplete}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Console
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="space-y-6">
            <SetupWizard onComplete={handleSetupComplete} />
          </TabsContent>

          <TabsContent value="console" className="space-y-6">
            {isSetupComplete ? (
              <OperatorConsole />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Complete the setup wizard first</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
