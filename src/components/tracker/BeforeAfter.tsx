import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogEntry, MEASUREMENT_FIELDS } from "@/lib/types";
import { Label } from "@/components/ui/label";

interface Props {
  logs: LogEntry[];
}

export default function BeforeAfter({ logs }: Props) {
  const photosLogs = logs.filter((l) => l.photo);
  const [beforeId, setBeforeId] = useState<string>("");
  const [afterId, setAfterId] = useState<string>("");
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const before = photosLogs.find((l) => l.id === beforeId);
  const after = photosLogs.find((l) => l.id === afterId);

  if (photosLogs.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Necesitas al menos 2 registros con fotos para comparar.
        </CardContent>
      </Card>
    );
  }

  const handleSlider = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Seleccionar Fechas para Comparar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Antes</Label>
            <Select value={beforeId} onValueChange={setBeforeId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar fecha" /></SelectTrigger>
              <SelectContent>
                {photosLogs.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {new Date(l.date).toLocaleDateString("es-ES")} — {l.weight} kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Después</Label>
            <Select value={afterId} onValueChange={setAfterId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar fecha" /></SelectTrigger>
              <SelectContent>
                {photosLogs.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {new Date(l.date).toLocaleDateString("es-ES")} — {l.weight} kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {before && after && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Comparación con Deslizador</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={containerRef}
                className="relative w-full aspect-square overflow-hidden rounded-md cursor-col-resize select-none"
                onMouseMove={(e) => e.buttons === 1 && handleSlider(e)}
                onMouseDown={handleSlider}
                onTouchMove={handleSlider}
              >
                <img src={after.photo} alt="Después" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                  <img src={before.photo} alt="Antes" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-lg"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-foreground shadow-md">
                    ⟷
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <ComparisonCard label="Antes" entry={before} />
            <ComparisonCard label="Después" entry={after} />
          </div>
        </>
      )}
    </div>
  );
}

function ComparisonCard({ label, entry }: { label: string; entry: LogEntry }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="text-muted-foreground">{new Date(entry.date).toLocaleDateString("es-ES")}</div>
        <div><strong>Peso:</strong> {entry.weight} kg</div>
        <div><strong>% Grasa:</strong> {entry.bodyFat}%</div>
        {MEASUREMENT_FIELDS.map((f) => (
          <div key={f.key}>
            <strong>{f.label}:</strong> {entry[f.key as keyof LogEntry] as number} cm
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
