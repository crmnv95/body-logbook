import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogEntry, MEASUREMENT_FIELDS } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  logs: LogEntry[];
}

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#0891b2", "#e11d48"];

export default function ProgressCharts({ logs }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    weight: true,
    bodyFat: true,
    chest: false,
    waist: true,
    hips: false,
    thigh: false,
    bicep: false,
    neck: false,
    waist2: false,
  });

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aún no hay datos para graficar.
        </CardContent>
      </Card>
    );
  }

  const data = logs.map((l) => ({
    date: new Date(l.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    weight: l.weight,
    bodyFat: l.bodyFat,
    chest: l.chest,
    waist: l.waist,
    hips: l.hips,
    thigh: l.thigh,
    bicep: l.bicep,
    neck: l.neck,
    waist2: l.waist2,
  }));

  const toggles = [
    { key: "weight", label: "Peso (kg)" },
    { key: "bodyFat", label: "% Grasa" },
    ...MEASUREMENT_FIELDS.map((f) => ({ key: f.key, label: `${f.label} (cm)` })),
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Alternar Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {toggles.map((t) => (
              <div key={t.key} className="flex items-center gap-2">
                <Switch
                  checked={visible[t.key]}
                  onCheckedChange={(checked) => setVisible((prev) => ({ ...prev, [t.key]: checked }))}
                />
                <Label className="text-xs cursor-pointer">{t.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {visible.weight && (
        <ChartCard title="Peso (kg)" data={data} dataKey="weight" color={COLORS[0]} />
      )}
      {visible.bodyFat && (
        <ChartCard title="% Grasa Corporal" data={data} dataKey="bodyFat" color={COLORS[1]} />
      )}

      {MEASUREMENT_FIELDS.filter((f) => visible[f.key]).map((f, i) => (
        <ChartCard key={f.key} title={`${f.label} (cm)`} data={data} dataKey={f.key} color={COLORS[(i + 2) % COLORS.length]} />
      ))}
    </div>
  );
}

function ChartCard({ title, data, dataKey, color }: { title: string; data: Record<string, any>[]; dataKey: string; color: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
