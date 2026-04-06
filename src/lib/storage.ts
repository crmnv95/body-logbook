import { LogEntry, Profile, DEFAULT_PROFILE } from "./types";

const LOGS_KEY = "body-tracker-logs";
const PROFILE_KEY = "body-tracker-profile";

export function getLogs(): LogEntry[] {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs: LogEntry[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getProfile(): Profile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
