import { useState, useCallback } from "react";
import { LogEntry, Profile } from "@/lib/types";
import { getLogs, saveLogs, getProfile, saveProfile } from "@/lib/storage";

export function useTrackerData() {
  const [logs, setLogs] = useState<LogEntry[]>(() => getLogs());
  const [profile, setProfile] = useState<Profile>(() => getProfile());

  const addLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => {
      const updated = [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      saveLogs(updated);
      return updated;
    });
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLogs(updated);
      return updated;
    });
  }, []);

  const updateProfile = useCallback((p: Profile) => {
    setProfile(p);
    saveProfile(p);
  }, []);

  return { logs, profile, addLog, deleteLog, updateProfile };
}
