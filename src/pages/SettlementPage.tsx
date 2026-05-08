import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HandCoins, PartyPopper } from 'lucide-react';
import { acertoContas } from '@/api/despesas';
import { obterEvento } from '@/api/eventos';
import type { AcertoContasResult, EventoDto } from '@/types/dto';
import { formatBRL } from '@/lib/format';

export default function SettlementPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<EventoDto | null>(null);
  const [acertos, setAcertos] = useState<AcertoContasResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let active = true;
    (async () => {
      try {
        const [ev, ac] = await Promise.all([obterEvento(eventId), acertoContas(eventId)]);
        if (!active) return;
        setEvento(ev);
        setAcertos(ac);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [eventId]);

  if (loading) return <div className="card p-8 animate-pulse-soft h-64" />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="card p-6 bg-gradient-to-br from-lime-500 to-lime-600 text-brand-700 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <HandCoins className="w-5 h-5" />
          <span className="font-semibold uppercase tracking-wide text-xs">Acerto final</span>
        </div>
        <h1 className="font-display text-3xl font-bold">{evento?.nome ?? 'Evento'}</h1>
        <p className="mt-1">Esses são os Pix que zeram a conta de todo mundo. ✨</p>
      </div>

      {error && (
        <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {acertos.length === 0 ? (
        <div className="card p-10 text-center">
          <PartyPopper className="mx-auto w-12 h-12 text-lime-500" />
          <h3 className="font-display text-xl font-semibold mt-4">Tudo zerado!</h3>
          <p className="text-ink-600 mt-2">Ninguém deve nada pra ninguém. Pode brindar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {acertos.map((a, i) => (
            <div key={i} className="card p-5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 line-clamp-1">{a.devedor_nome}</p>
                <p className="text-xs text-ink-500">paga</p>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-500 shrink-0" />
              <div className="flex-1 min-w-0 text-right">
                <p className="font-semibold text-ink-900 line-clamp-1">{a.credor_nome}</p>
                <p className="text-xs text-ink-500">recebe</p>
              </div>
              <div className="ml-3 px-3 py-2 rounded-xl bg-lime-100 text-brand-700 font-display font-bold">
                {formatBRL(a.valor)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
