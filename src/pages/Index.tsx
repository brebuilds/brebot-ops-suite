import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatPage } from "./ChatPage";
import { SkillsPage } from "./SkillsPage";
import { JobsPage } from "./JobsPage";
import { ArtifactsPage } from "./ArtifactsPage";
import { SettingsPage } from "./SettingsPage";
import { MessageCircle, Brain, Briefcase, Package, Settings } from "lucide-react";
const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-card-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <img src="/lovable-uploads/342b8f4d-eded-4f67-adff-0d943bdc3dea.png" alt="BreBot Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">BreBot</h1>
                <p className="text-sm text-muted-foreground">Privacy-first AI assistant platform</p>
              </div>
            </div>
            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted">
                <TabsTrigger value="chat" className="flex items-center gap-2 text-xs">
                  <MessageCircle className="h-3 w-3" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2 text-xs">
                  <Brain className="h-3 w-3" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center gap-2 text-xs">
                  <Briefcase className="h-3 w-3" />
                  Jobs
                </TabsTrigger>
                <TabsTrigger value="artifacts" className="flex items-center gap-2 text-xs">
                  <Package className="h-3 w-3" />
                  Artifacts
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 text-xs">
                  <Settings className="h-3 w-3" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="chat" className="mt-0 h-full">
            <ChatPage />
          </TabsContent>
          
          <TabsContent value="skills" className="mt-0 h-full">
            <SkillsPage />
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-0 h-full">
            <JobsPage />
          </TabsContent>
          
          <TabsContent value="artifacts" className="mt-0 h-full">
            <ArtifactsPage />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 h-full">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default Index;