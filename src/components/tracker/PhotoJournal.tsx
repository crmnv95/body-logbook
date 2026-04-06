import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LogEntry } from "@/lib/types";

interface Props {
  logs: LogEntry[];
}

export default function PhotoJournal({ logs }: Props) {
  const [selected, setSelected] = useState<LogEntry | null>(null);
  const photosLogs = logs.filter((l) => l.photo);

  if (photosLogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aún no hay fotos. Adjunta fotos a tus registros para verlas aquí.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photosLogs.map((log) => (
          <Card key={log.id} className="cursor-pointer hover:ring-2 hover:ring-ring transition-all" onClick={() => setSelected(log)}>
            <CardContent className="p-2">
              <img src={log.photo} alt={`Progreso ${log.date}`} className="w-full aspect-square object-cover rounded-md" />
              <div className="mt-2 text-xs text-center">
                <div className="font-medium text-foreground">{new Date(log.date).toLocaleDateString("es-ES")}</div>
                <div className="text-muted-foreground">{log.weight} kg</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected?.photo && (
            <div>
              <img src={selected.photo} alt="Tamaño completo" className="w-full rounded-md" />
              <div className="mt-3 text-center text-sm">
                <span className="font-medium">{new Date(selected.date).toLocaleDateString("es-ES")}</span>
                {" — "}
                <span>{selected.weight} kg</span>
                {selected.bodyFat > 0 && <span> — {selected.bodyFat}% GC</span>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
