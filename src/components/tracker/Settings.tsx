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
          <SettingsIcon className="h-5 w-5" /> Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Height (cm)</Label>
            <Input type="number" value={profile.height} onChange={(e) => update("height", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Age (years)</Label>
            <Input type="number" value={profile.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div>
          <Label>Sex</Label>
          <Select value={profile.sex} onValueChange={(v) => update("sex", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Activity Level</Label>
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
          <Label>Calorie Deficit (kcal/day)</Label>
          <Input type="number" value={profile.deficit} onChange={(e) => update("deficit", parseInt(e.target.value) || 0)} />
          <p className="text-xs text-muted-foreground mt-1">Use negative value (e.g. −500) to lose weight</p>
        </div>
      </CardContent>
    </Card>
  );
}
