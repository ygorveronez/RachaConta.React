import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Users, Wallet } from 'lucide-react';
import {
  contarParticipantes,
  listarEventos,
} from '@/api/eventos';
import { resumoFinanceiro } from '@/api/despesas';
import { useAuth } from '@/lib/auth-context';
import type { EventoDto } from '@/types/dto';
import { formatBRL, formatDate } from '@/lib/format';

type Filtro = 'ativos' | 'finalizados' | 'todos';

interface EventoCard {
  evento: EventoDto;
  participantes: number;
  saldoUsuario: number;
}

export default function HomePage() {
  const { perfil, user } = useAuth();
  const [eventos, setEventos] = useState<EventoCard[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('ativos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const lista = await listarEventos();
        // Para cada evento: contagem + saldo do usuário (mantém paridade com Android, ainda que N+1).
        const enriquecidos = await Promise.all(
          lista.map(async (e) => {
            const [participantes, resumo] = await Promise.all([
              contarParticipantes(e.id).catch(() => 0),
              resumoFinanceiro(e.id).catch(() => []),
            ]);
            const meu = resumo.find((r) => r.usuario_id === user.id);
            return {
              evento: e,
              participantes,
              saldoUsuario: meu?.saldo ?? 0,
            };
          })
        );
        if (active) setEventos(enriquecidos);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const filtrados = useMemo(() => {
    return eventos.filter((e) => {
      if (filtro === 'ativos') return !e.evento.arquivado;
      if (filtro === 'finalizados') return e.evento.arquivado;
      return true;
    });
  }, [eventos, filtro]);

  const totalRecebe = eventos.reduce((s, e) => s + Math.max(0, e.saldoUsuario), 0);
  const totalDeve = eventos.reduce((s, e) => s + Math.min(0, e.saldoUsuario), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-ink-500 text-sm">Olá,</p>
        <h1 className="font-display text-3xl font-bold">{perfil?.nome_completo ?? 'bem-vindo'} 👋</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-ink-500">Você recebe</p>
          <p className="font-display text-2xl font-bold text-lime-600">{formatBRL(totalRecebe)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-ink-500">Você deve</p>
          <p className="font-display text-2xl font-bold text-danger-500">{formatBRL(Math.abs(totalDeve))}</p>
        </div>
        <div className="card p-4 hidden md:block">
          <p className="text-xs uppercase tracking-wide text-ink-500">Eventos</p>
          <p className="font-display text-2xl font-bold text-brand-600">{eventos.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['ativos', 'finalizados', 'todos'] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filtro === f
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-100'
              }`}
            >
              {f === 'ativos' && 'Ativos'}
              {f === 'finalizados' && 'Finalizados'}
              {f === 'todos' && 'Todos'}
            </button>
          ))}
        </div>
        <Link to="/app/eventos/novo" className="btn-primary">
          <Plus className="w-4 h-4" /> Novo evento
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse-soft">
              <div className="h-5 w-1/3 bg-ink-100 rounded mb-3" />
              <div className="h-4 w-1/2 bg-ink-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrados.map((card) => (
            <EventoCardItem key={card.evento.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventoCardItem({ card }: { card: EventoCard }) {
  const { evento, participantes, saldoUsuario } = card;
  const positivo = saldoUsuario > 0.005;
  const negativo = saldoUsuario < -0.005;

  return (
    <Link
      to={`/app/eventos/${evento.id}`}
      className="card p-5 hover:shadow-soft hover:-translate-y-0.5 transition relative overflow-hidden block"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-900 line-clamp-1">{evento.nome}</h3>
          {evento.descricao && (
            <p className="text-sm text-ink-600 line-clamp-1">{evento.descricao}</p>
          )}
        </div>
        {evento.arquivado ? (
          <span className="chip-ink">Finalizado</span>
        ) : (
          <span className="chip-lime">Ativo</span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-ink-600">
        <span className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" /> {formatDate(evento.data_evento ?? evento.criado_em ?? null)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> {participantes}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="w-4 h-4 text-ink-400" />
          {positivo && <span className="text-lime-600 font-semibold">Te devem {formatBRL(saldoUsuario)}</span>}
          {negativo && <span className="text-danger-500 font-semibold">Você deve {formatBRL(Math.abs(saldoUsuario))}</span>}
          {!positivo && !negativo && <span className="text-ink-500">Quitado</span>}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-lime-100 text-brand-700 flex items-center justify-center mb-4">
        <Plus className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-semibold">Sem rolê por aqui ainda</h3>
      <p className="text-ink-600 mt-2 max-w-md mx-auto">
        Crie seu primeiro evento e convide a galera. Em 1 minuto você já tá rachando a primeira despesa.
      </p>
      <Link to="/app/eventos/novo" className="btn-primary mt-6 inline-flex">
        <Plus className="w-4 h-4" /> Criar primeiro evento
      </Link>
    </div>
  );
}
