import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeSettings } from "@/components/settings/KnowledgeSettings";
import { ConnectionsSettings } from "@/components/settings/ConnectionsSettings";
import { Database, Plug } from "lucide-react";

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="knowledge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeSettings />
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <ConnectionsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}