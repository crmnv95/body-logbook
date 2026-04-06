export interface Profile {
  height: number;
  age: number;
  sex: "male" | "female";
  activityLevel: number;
  deficit: number;
}

export interface LogEntry {
  id: string;
  date: string;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  thigh: number;
  bicep: number;
  neck: number;
  waist2: number;
  bodyFat: number;
  photo?: string;
}

export const ACTIVITY_LEVELS = [
  { label: "Sedentary", factor: 1.2 },
  { label: "Lightly active", factor: 1.375 },
  { label: "Moderately active", factor: 1.55 },
  { label: "Very active", factor: 1.725 },
] as const;

export const MEASUREMENT_FIELDS = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "thigh", label: "Thigh" },
  { key: "bicep", label: "Bicep" },
  { key: "neck", label: "Neck" },
  { key: "waist2", label: "Waist 2" },
] as const;

export function calcBMR(weight: number, height: number, age: number, sex: "male" | "female") {
  const base = weight * 10 + 6.25 * height - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calcTDEE(bmr: number, activityLevel: number) {
  return bmr * activityLevel;
}

export function calcDailyCalories(tdee: number, deficit: number) {
  return tdee + deficit;
}

export function calcFatMass(weight: number, bodyFat: number) {
  return weight * (bodyFat / 100);
}

export function calcLeanMass(weight: number, fatMass: number) {
  return weight - fatMass;
}

export const DEFAULT_PROFILE: Profile = {
  height: 185,
  age: 29,
  sex: "male",
  activityLevel: 1.2,
  deficit: -500,
};
