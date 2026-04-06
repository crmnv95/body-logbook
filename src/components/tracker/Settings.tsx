import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile, ACTIVITY_LEVELS } from "@/lib/types";
import { Settings as SettingsIcon } from "lucide-react";

interface Props {
  profile: Profile;
  onUpdate: (p: Profile) => void;
}

export default function Settings({ profile, onUpdate }: Props) {
  const update = (key: keyof Profile, value: any) => {
    onUpdate({ ...profile, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" /> Configuración del Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Altura (cm)</Label>
            <Input type="number" value={profile.height} onChange={(e) => update("height", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Edad (años)</Label>
            <Input type="number" value={profile.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div>
          <Label>Sexo</Label>
          <Select value={profile.sex} onValueChange={(v) => update("sex", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nivel de Actividad</Label>
          <Select value={String(profile.activityLevel)} onValueChange={(v) => update("activityLevel", parseFloat(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVELS.map((a) => (
                <SelectItem key={a.factor} value={String(a.factor)}>
                  {a.label} (×{a.factor})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Déficit Calórico (kcal/día)</Label>
          <Input type="number" value={profile.deficit} onChange={(e) => update("deficit", parseInt(e.target.value) || 0)} />
          <p className="text-xs text-muted-foreground mt-1">Usa un valor negativo (ej. −500) para perder peso</p>
        </div>
      </CardContent>
    </Card>
  );
}
