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
  { label: "Sedentario", factor: 1.2 },
  { label: "Ligeramente activo", factor: 1.375 },
  { label: "Moderadamente activo", factor: 1.55 },
  { label: "Muy activo", factor: 1.725 },
] as const;

export const MEASUREMENT_FIELDS = [
  { key: "chest", label: "Pecho" },
  { key: "waist", label: "Cintura" },
  { key: "hips", label: "Cadera" },
  { key: "thigh", label: "Muslo" },
  { key: "bicep", label: "Bícep" },
  { key: "neck", label: "Cuello" },
  { key: "waist2", label: "Cintura 2" },
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

// US Navy method body fat % calculation
export function calcBodyFatNavy(
  sex: "male" | "female",
  waist: number,
  neck: number,
  height: number,
  hips: number
): number {
  if (waist <= 0 || neck <= 0 || height <= 0) return 0;
  if (sex === "male") {
    const diff = waist - neck;
    if (diff <= 0) return 0;
    return 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(height)) - 450;
  } else {
    if (hips <= 0) return 0;
    const diff = waist + hips - neck;
    if (diff <= 0) return 0;
    return 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(height)) - 450;
  }
}

export const DEFAULT_PROFILE: Profile = {
  height: 185,
  age: 29,
  sex: "male",
  activityLevel: 1.2,
  deficit: -500,
};
