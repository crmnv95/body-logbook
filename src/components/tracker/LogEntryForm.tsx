import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogEntry, Profile, calcBMR, calcTDEE, calcDailyCalories, calcFatMass, calcLeanMass, calcBodyFatNavy } from "@/lib/types";
import { Camera, Plus } from "lucide-react";

interface Props {
  profile: Profile;
  onSubmit: (entry: LogEntry) => void;
}

const fields = [
  { key: "weight", label: "Peso (kg)", placeholder: "0" },
  { key: "chest", label: "Pecho (cm)", placeholder: "0" },
  { key: "waist", label: "Cintura (cm)", placeholder: "A la altura del ombligo" },
  { key: "hips", label: "Cadera (cm)", placeholder: "0" },
  { key: "thigh", label: "Muslo (cm)", placeholder: "0" },
  { key: "bicep", label: "Bícep (cm)", placeholder: "0" },
  { key: "neck", label: "Cuello (cm)", placeholder: "0" },
  { key: "waist2", label: "Cintura 2 (cm)", placeholder: "Parte más estrecha del torso" },
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
    bodyFatManual: "",
  });
  const [photo, setPhoto] = useState<string | undefined>();

  const w = parseFloat(form.weight) || 0;
  const waist = parseFloat(form.waist) || 0;
  const neck = parseFloat(form.neck) || 0;
  const hips = parseFloat(form.hips) || 0;

  const autoBodyFat = useMemo(
    () => calcBodyFatNavy(profile.sex, waist, neck, profile.height, hips),
    [profile.sex, waist, neck, profile.height, hips]
  );

  const bf = parseFloat(form.bodyFatManual) || (autoBodyFat > 0 ? autoBodyFat : 0);
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
      waist: waist,
      hips: hips,
      thigh: parseFloat(form.thigh) || 0,
      bicep: parseFloat(form.bicep) || 0,
      neck: neck,
      waist2: parseFloat(form.waist2) || 0,
      bodyFat: parseFloat(bf.toFixed(1)),
      photo,
    };
    onSubmit(entry);
    setForm({
      date: new Date().toISOString().split("T")[0],
      weight: "", chest: "", waist: "", hips: "", thigh: "",
      bicep: "", neck: "", waist2: "", bodyFatManual: "",
    });
    setPhoto(undefined);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nuevo Registro Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <Label className="text-xs">{f.label}</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Body fat: auto-calculated + manual override */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">% Grasa Corporal (auto)</Label>
              <Input
                type="text"
                readOnly
                value={autoBodyFat > 0 ? autoBodyFat.toFixed(1) + "%" : "—"}
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">Método US Navy</p>
            </div>
            <div>
              <Label className="text-xs">% Grasa Corporal (manual)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Dejar vacío para usar auto"
                value={form.bodyFatManual}
                onChange={(e) => handleChange("bodyFatManual", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-1 cursor-pointer">
              <Camera className="h-4 w-4" /> Adjuntar Foto
            </Label>
            <Input type="file" accept="image/*" onChange={handlePhoto} className="mt-1" />
            {photo && (
              <img src={photo} alt="Vista previa" className="mt-2 h-32 w-32 object-cover rounded-md border border-border" />
            )}
          </div>

          <Button onClick={handleSubmit} disabled={w <= 0} className="w-full">
            Guardar Registro
          </Button>
        </CardContent>
      </Card>

      {w > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cálculos en Tiempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Metric label="TMB" value={`${bmr.toFixed(1)} kcal`} />
              <Metric label="GDCE" value={`${tdee.toFixed(1)} kcal`} />
              <Metric label="Objetivo Diario" value={`${dailyCal.toFixed(1)} kcal`} />
              {bf > 0 && (
                <>
                  <Metric label="Masa Grasa" value={`${fatMass.toFixed(1)} kg`} />
                  <Metric label="Masa Magra" value={`${leanMass.toFixed(1)} kg`} />
                  <Metric label="% Grasa" value={`${bf.toFixed(1)}%`} />
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
