import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, History as HistoryIcon } from 'lucide-react';
import { listarEventos } from '@/api/eventos';
import type { EventoDto } from '@/types/dto';
import { formatDate } from '@/lib/format';

export default function HistoryPage() {
  const [eventos, setEventos] = useState<EventoDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarEventos()
      .then((evs) => setEventos(evs.filter((e) => e.arquivado)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Histórico</h1>
      <p className="text-ink-600 mb-6">Eventos finalizados — pra matar a saudade dos rolês passados.</p>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse-soft" />
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <div className="card p-10 text-center">
          <HistoryIcon className="mx-auto w-12 h-12 text-ink-300" />
          <p className="mt-4 text-ink-600">
            Nenhum evento finalizado ainda. Quando você marcar um evento como finalizado, ele
            aparece aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {eventos.map((e) => (
            <Link
              key={e.id}
              to={`/app/eventos/${e.id}`}
              className="card p-5 flex items-center gap-4 hover:shadow-soft transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-ink-100 text-ink-600 flex items-center justify-center">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 line-clamp-1">{e.nome}</p>
                <p className="text-sm text-ink-500 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(e.data_evento ?? e.criado_em ?? null)}
                </p>
              </div>
              <span className="chip-ink">Finalizado</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
