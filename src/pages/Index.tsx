import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrackerData } from "@/hooks/useTrackerData";
import LogEntryForm from "@/components/tracker/LogEntryForm";
import Dashboard from "@/components/tracker/Dashboard";
import ProgressCharts from "@/components/tracker/ProgressCharts";
import PhotoJournal from "@/components/tracker/PhotoJournal";
import BeforeAfter from "@/components/tracker/BeforeAfter";
import Settings from "@/components/tracker/Settings";
import { ClipboardList, LayoutDashboard, LineChart, Image, GitCompare, Settings as SettingsIcon } from "lucide-react";

export default function Index() {
  const { logs, profile, addLog, deleteLog, updateProfile } = useTrackerData();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Body Progress Tracker</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="log" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="log" className="gap-1 text-xs"><ClipboardList className="h-3.5 w-3.5" /> Log</TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-1 text-xs"><LayoutDashboard className="h-3.5 w-3.5" /> Dashboard</TabsTrigger>
            <TabsTrigger value="charts" className="gap-1 text-xs"><LineChart className="h-3.5 w-3.5" /> Charts</TabsTrigger>
            <TabsTrigger value="photos" className="gap-1 text-xs"><Image className="h-3.5 w-3.5" /> Photos</TabsTrigger>
            <TabsTrigger value="compare" className="gap-1 text-xs"><GitCompare className="h-3.5 w-3.5" /> Before & After</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs"><SettingsIcon className="h-3.5 w-3.5" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            <LogEntryForm profile={profile} onSubmit={addLog} />
          </TabsContent>
          <TabsContent value="dashboard">
            <Dashboard logs={logs} profile={profile} />
          </TabsContent>
          <TabsContent value="charts">
            <ProgressCharts logs={logs} />
          </TabsContent>
          <TabsContent value="photos">
            <PhotoJournal logs={logs} />
          </TabsContent>
          <TabsContent value="compare">
            <BeforeAfter logs={logs} />
          </TabsContent>
          <TabsContent value="settings">
            <Settings profile={profile} onUpdate={updateProfile} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
