import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogEntry, Profile, calcBMR, calcTDEE, calcDailyCalories, calcFatMass, calcLeanMass } from "@/lib/types";
import { Camera, Plus } from "lucide-react";

interface Props {
  profile: Profile;
  onSubmit: (entry: LogEntry) => void;
}

const fields = [
  { key: "weight", label: "Weight (kg)" },
  { key: "chest", label: "Chest (cm)" },
  { key: "waist", label: "Waist (cm)" },
  { key: "hips", label: "Hips (cm)" },
  { key: "thigh", label: "Thigh (cm)" },
  { key: "bicep", label: "Bicep (cm)" },
  { key: "neck", label: "Neck (cm)" },
  { key: "waist2", label: "Waist 2 (cm)" },
  { key: "bodyFat", label: "Body Fat %" },
] as const;

export default function LogEntryForm({ profile, onSubmit }: Props) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    thigh: "",
    bicep: "",
    neck: "",
    waist2: "",
    bodyFat: "",
  });
  const [photo, setPhoto] = useState<string | undefined>();

  const w = parseFloat(form.weight) || 0;
  const bf = parseFloat(form.bodyFat) || 0;
  const bmr = w > 0 ? calcBMR(w, profile.height, profile.age, profile.sex) : 0;
  const tdee = calcTDEE(bmr, profile.activityLevel);
  const dailyCal = calcDailyCalories(tdee, profile.deficit);
  const fatMass = w > 0 && bf > 0 ? calcFatMass(w, bf) : 0;
  const leanMass = w > 0 && bf > 0 ? calcLeanMass(w, fatMass) : 0;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.date || w <= 0) return;
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      date: form.date,
      weight: w,
      chest: parseFloat(form.chest) || 0,
      waist: parseFloat(form.waist) || 0,
      hips: parseFloat(form.hips) || 0,
      thigh: parseFloat(form.thigh) || 0,
      bicep: parseFloat(form.bicep) || 0,
      neck: parseFloat(form.neck) || 0,
      waist2: parseFloat(form.waist2) || 0,
      bodyFat: bf,
      photo,
    };
    onSubmit(entry);
    setForm({
      date: new Date().toISOString().split("T")[0],
      weight: "", chest: "", waist: "", hips: "", thigh: "",
      bicep: "", neck: "", waist2: "", bodyFat: "",
    });
    setPhoto(undefined);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> New Weekly Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <Label className="text-xs">{f.label}</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div>
            <Label className="flex items-center gap-1 cursor-pointer">
              <Camera className="h-4 w-4" /> Attach Photo
            </Label>
            <Input type="file" accept="image/*" onChange={handlePhoto} className="mt-1" />
            {photo && (
              <img src={photo} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md border border-border" />
            )}
          </div>

          <Button onClick={handleSubmit} disabled={w <= 0} className="w-full">
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {w > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Live Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Metric label="BMR" value={`${bmr.toFixed(1)} kcal`} />
              <Metric label="TDEE" value={`${tdee.toFixed(1)} kcal`} />
              <Metric label="Daily Target" value={`${dailyCal.toFixed(1)} kcal`} />
              {bf > 0 && (
                <>
                  <Metric label="Fat Mass" value={`${fatMass.toFixed(1)} kg`} />
                  <Metric label="Lean Mass" value={`${leanMass.toFixed(1)} kg`} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted p-2">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="font-semibold text-foreground">{value}</div>
    </div>
  );
}
