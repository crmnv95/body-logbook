import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogEntry, Profile, MEASUREMENT_FIELDS, calcBMR, calcTDEE, calcDailyCalories, calcFatMass, calcLeanMass } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props {
  logs: LogEntry[];
  profile: Profile;
}

export default function Dashboard({ logs, profile }: Props) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aún no hay registros. Agrega tu primer check-in para ver el panel.
        </CardContent>
      </Card>
    );
  }

  const current = logs[logs.length - 1];
  const prev = logs.length > 1 ? logs[logs.length - 2] : null;
  const first = logs[0];

  const bmr = calcBMR(current.weight, profile.height, profile.age, profile.sex);
  const tdee = calcTDEE(bmr, profile.activityLevel);
  const dailyCal = calcDailyCalories(tdee, profile.deficit);
  const fatMass = calcFatMass(current.weight, current.bodyFat);
  const leanMass = calcLeanMass(current.weight, fatMass);

  const totalWeightLost = first.weight - current.weight;

  let bestMetric = { label: "", change: 0 };
  if (prev) {
    const allMetrics = [
      { label: "Peso", change: prev.weight - current.weight },
      { label: "% Grasa", change: prev.bodyFat - current.bodyFat },
      ...MEASUREMENT_FIELDS.map((f) => ({
        label: f.label,
        change: (prev[f.key as keyof LogEntry] as number) - (current[f.key as keyof LogEntry] as number),
      })),
    ];
    bestMetric = allMetrics.reduce((best, m) => (m.change > best.change ? m : best), allMetrics[0]);
  }

  const delta = (curr: number, ref: number | undefined) => {
    if (ref === undefined) return null;
    return curr - ref;
  };

  const stats = [
    { label: "Peso", value: `${current.weight} kg`, prev: prev?.weight, first: first.weight, current: current.weight },
    { label: "% Grasa", value: `${current.bodyFat}%`, prev: prev?.bodyFat, first: first.bodyFat, current: current.bodyFat },
    { label: "Masa Grasa", value: `${fatMass.toFixed(1)} kg`, prev: prev ? calcFatMass(prev.weight, prev.bodyFat) : undefined, first: calcFatMass(first.weight, first.bodyFat), current: fatMass },
    { label: "Masa Magra", value: `${leanMass.toFixed(1)} kg`, prev: prev ? calcLeanMass(prev.weight, calcFatMass(prev.weight, prev.bodyFat)) : undefined, first: calcLeanMass(first.weight, calcFatMass(first.weight, first.bodyFat)), current: leanMass },
    { label: "TMB", value: `${bmr.toFixed(0)} kcal` },
    { label: "GDCE", value: `${tdee.toFixed(0)} kcal` },
    { label: "Objetivo Diario", value: `${dailyCal.toFixed(0)} kcal` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const dPrev = s.prev !== undefined ? delta(s.current!, s.prev) : null;
          const dFirst = s.first !== undefined ? delta(s.current!, s.first) : null;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                {dPrev !== null && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <DeltaIcon value={dPrev} />
                    <span className={dPrev < 0 ? "text-green-600" : dPrev > 0 ? "text-destructive" : "text-muted-foreground"}>
                      {dPrev > 0 ? "+" : ""}{dPrev.toFixed(1)} vs anterior
                    </span>
                  </div>
                )}
                {dFirst !== null && (
                  <div className="text-xs text-muted-foreground">
                    {(dFirst! > 0 ? "+" : "")}{dFirst!.toFixed(1)} vs inicio
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Peso Total Perdido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalWeightLost.toFixed(1)} kg</div>
            <div className="text-xs text-muted-foreground">en {logs.length} registros</div>
          </CardContent>
        </Card>

        {prev && bestMetric.change > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Mejor Mejora Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{bestMetric.label}</div>
              <div className="text-xs text-muted-foreground">−{bestMetric.change.toFixed(1)} desde la semana pasada</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Racha Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{logs.length} semanas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeltaIcon({ value }: { value: number }) {
  if (value < 0) return <TrendingDown className="h-3 w-3 text-green-600" />;
  if (value > 0) return <TrendingUp className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}
