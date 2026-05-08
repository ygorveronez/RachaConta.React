import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CalendarDays,
  HandCoins,
  Plus,
  Receipt,
  UserPlus,
  Users,
} from 'lucide-react';
import { arquivarEvento, listarParticipantes, obterEvento } from '@/api/eventos';
import { listarDespesas, resumoFinanceiro } from '@/api/despesas';
import { useAuth } from '@/lib/auth-context';
import type {
  DespesaDto,
  EventoDto,
  ParticipanteEventoComPerfilDto,
  ResumoFinanceiroResult,
} from '@/types/dto';
import { formatBRL, formatDate, formatDateTime } from '@/lib/format';
import { Avatar } from '@/components/Avatar';

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evento, setEvento] = useState<EventoDto | null>(null);
  const [participantes, setParticipantes] = useState<ParticipanteEventoComPerfilDto[]>([]);
  const [despesas, setDespesas] = useState<DespesaDto[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiroResult[]>([]);
  const [tab, setTab] = useState<'despesas' | 'participantes' | 'resumo'>('despesas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const [ev, parts, desps, res] = await Promise.all([
        obterEvento(eventId),
        listarParticipantes(eventId),
        listarDespesas(eventId),
        resumoFinanceiro(eventId).catch(() => [] as ResumoFinanceiroResult[]),
      ]);
      setEvento(ev);
      setParticipantes(parts);
      setDespesas(desps);
      setResumo(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleArquivar() {
    if (!eventId || !evento) return;
    if (!confirm(evento.arquivado ? 'Reativar evento?' : 'Marcar evento como finalizado?')) return;
    try {
      await arquivarEvento(eventId);
      await carregar();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao arquivar');
    }
  }

  if (loading) {
    return (
      <div className="card p-8 animate-pulse-soft">
        <div className="h-7 w-1/2 bg-ink-100 rounded mb-3" />
        <div className="h-4 w-1/3 bg-ink-100 rounded" />
      </div>
    );
  }
  if (error || !evento) {
    return (
      <div className="card p-8 text-center">
        <p className="text-danger-500">{error ?? 'Evento não encontrado'}</p>
        <button onClick={() => navigate('/app')} className="btn-primary mt-6 inline-flex">
          Voltar para Início
        </button>
      </div>
    );
  }

  const meuResumo = resumo.find((r) => r.usuario_id === user?.id);
  const totalEvento = despesas.reduce((s, d) => s + Number(d.valor_total), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="card p-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-lime-500/30 blur-2xl" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            {evento.arquivado ? (
              <span className="chip-ink !bg-white/15 !text-white">Finalizado</span>
            ) : (
              <span className="chip-lime !bg-lime-400 !text-brand-700">Ativo</span>
            )}
            <span className="text-sm text-brand-100 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> {formatDate(evento.data_evento ?? evento.criado_em ?? null)}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold">{evento.nome}</h1>
          {evento.descricao && <p className="text-brand-100 mt-2">{evento.descricao}</p>}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-100">Total do rolê</p>
            <p className="font-display text-2xl font-bold">{formatBRL(totalEvento)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-100">Você pagou</p>
            <p className="font-display text-2xl font-bold">{formatBRL(meuResumo?.total_pago ?? 0)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-100">Seu saldo</p>
            <p className={`font-display text-2xl font-bold ${
              (meuResumo?.saldo ?? 0) > 0 ? 'text-lime-400' : (meuResumo?.saldo ?? 0) < 0 ? 'text-danger-100' : ''
            }`}>
              {formatBRL(meuResumo?.saldo ?? 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/app/eventos/${evento.id}/despesa`} className="btn-primary">
          <Plus className="w-4 h-4" /> Adicionar despesa
        </Link>
        <Link to={`/app/eventos/${evento.id}/convidar`} className="btn-secondary">
          <UserPlus className="w-4 h-4" /> Convidar
        </Link>
        <Link to={`/app/eventos/${evento.id}/acerto`} className="btn-lime">
          <HandCoins className="w-4 h-4" /> Ver acerto final
        </Link>
        {evento.arquivado ? (
          <button onClick={handleArquivar} className="btn-secondary">
            <ArchiveRestore className="w-4 h-4" /> Reativar evento
          </button>
        ) : (
          <button
            onClick={handleArquivar}
            className="btn-ghost text-ink-700 border border-ink-200 hover:bg-ink-100 ml-auto"
          >
            <Archive className="w-4 h-4" /> Finalizar evento
          </button>
        )}
      </div>

      <div className="border-b border-ink-200 flex gap-1 overflow-x-auto no-scrollbar">
        {(
          [
            { k: 'despesas', l: 'Despesas', i: <Receipt className="w-4 h-4" /> },
            { k: 'participantes', l: `Participantes (${participantes.length})`, i: <Users className="w-4 h-4" /> },
            { k: 'resumo', l: 'Resumo', i: <HandCoins className="w-4 h-4" /> },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition ${
              tab === t.k ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            {t.i} {t.l}
          </button>
        ))}
      </div>

      {tab === 'despesas' && (
        <DespesasTab despesas={despesas} participantes={participantes} eventoId={evento.id} />
      )}
      {tab === 'participantes' && (
        <ParticipantesTab participantes={participantes} eventoId={evento.id} />
      )}
      {tab === 'resumo' && <ResumoTab resumo={resumo} />}
    </div>
  );
}

function DespesasTab({
  despesas,
  participantes,
  eventoId,
}: {
  despesas: DespesaDto[];
  participantes: ParticipanteEventoComPerfilDto[];
  eventoId: string;
}) {
  if (despesas.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-lime-100 text-brand-700 flex items-center justify-center mb-4">
          <Receipt className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl font-semibold">Sem despesas ainda</h3>
        <p className="text-ink-600 mt-2 max-w-md mx-auto">
          Conforme alguém pagar algo, lance aqui. A divisão sai sozinha no fim.
        </p>
        <Link to={`/app/eventos/${eventoId}/despesa`} className="btn-primary mt-6 inline-flex">
          <Plus className="w-4 h-4" /> Lançar primeira despesa
        </Link>
      </div>
    );
  }
  const nomePor = new Map(participantes.map((p) => [p.usuario_id, p.perfis?.nome_completo ?? '—']));
  return (
    <div className="grid gap-3">
      {despesas.map((d) => (
        <Link
          key={d.id}
          to={`/app/eventos/${eventoId}/despesa/${d.id}`}
          className="card p-4 flex items-center gap-4 hover:shadow-soft transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-900 line-clamp-1">{d.descricao}</p>
            <p className="text-sm text-ink-500">
              {nomePor.get(d.pago_por) ?? '—'} · {formatDateTime(d.data_despesa)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-ink-900">{formatBRL(Number(d.valor_total))}</p>
            <p className="text-xs text-ink-500">{d.tipo_divisao === 'igual' ? 'Igual' : 'Manual'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ParticipantesTab({
  participantes,
  eventoId,
}: {
  participantes: ParticipanteEventoComPerfilDto[];
  eventoId: string;
}) {
  return (
    <div className="space-y-3">
      <Link to={`/app/eventos/${eventoId}/convidar`} className="btn-secondary inline-flex">
        <UserPlus className="w-4 h-4" /> Convidar mais gente
      </Link>
      <div className="grid gap-3 md:grid-cols-2">
        {participantes.map((p) => (
          <div key={p.id} className="card p-4 flex items-center gap-3">
            <Avatar nome={p.perfis?.nome_completo} url={p.perfis?.avatar_url} size={42} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink-900 line-clamp-1">{p.perfis?.nome_completo ?? '—'}</p>
              <p className="text-sm text-ink-500 line-clamp-1">@{p.perfis?.nome_usuario ?? '—'}</p>
            </div>
            {p.papel === 'admin' && <span className="chip-brand">Admin</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumoTab({ resumo }: { resumo: ResumoFinanceiroResult[] }) {
  if (resumo.length === 0) {
    return (
      <div className="card p-8 text-center text-ink-600">
        Ainda não tem nada pra resumir. Lança uma despesa primeiro 😉
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {resumo.map((r) => {
        const positivo = r.saldo > 0.005;
        const negativo = r.saldo < -0.005;
        return (
          <div key={r.usuario_id} className="card p-4 flex items-center gap-4">
            <Avatar nome={r.nome_completo} url={r.avatar_url} size={44} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink-900 line-clamp-1">{r.nome_completo}</p>
              <p className="text-sm text-ink-500">
                Pagou {formatBRL(r.total_pago)} · Deve {formatBRL(r.total_deve)}
              </p>
            </div>
            <div className="text-right">
              {positivo && <span className="font-display font-bold text-lime-600">+{formatBRL(r.saldo)}</span>}
              {negativo && <span className="font-display font-bold text-danger-500">{formatBRL(r.saldo)}</span>}
              {!positivo && !negativo && <span className="font-display font-bold text-ink-500">Quitado</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
