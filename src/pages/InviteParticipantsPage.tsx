import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';
import {
  adicionarParticipanteExterno,
  buscarUsuarios,
  convidarParticipante,
  listarParticipantes,
} from '@/api/eventos';
import type { BuscaUsuarioResult, ParticipanteEventoComPerfilDto } from '@/types/dto';
import { Avatar } from '@/components/Avatar';

export default function InviteParticipantsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<BuscaUsuarioResult[]>([]);
  const [participantes, setParticipantes] = useState<ParticipanteEventoComPerfilDto[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [externoNome, setExternoNome] = useState('');
  const [externoEmail, setExternoEmail] = useState('');
  const [externoLoading, setExternoLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    listarParticipantes(eventId).then(setParticipantes).catch(() => undefined);
  }, [eventId]);

  useEffect(() => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await buscarUsuarios(termo.trim());
        setResultados(r);
      } catch {
        setResultados([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [termo]);

  async function convidar(usuarioId: string) {
    if (!eventId) return;
    setError(null);
    try {
      await convidarParticipante(eventId, usuarioId);
      const novos = await listarParticipantes(eventId);
      setParticipantes(novos);
      setTermo('');
      setResultados([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao convidar');
    }
  }

  async function adicionarExterno(e: FormEvent) {
    e.preventDefault();
    if (!eventId || !externoEmail || !externoNome) return;
    setExternoLoading(true);
    setError(null);
    try {
      await adicionarParticipanteExterno({
        eventoId: eventId,
        email: externoEmail.trim(),
        nomeCompleto: externoNome.trim(),
      });
      setExternoEmail('');
      setExternoNome('');
      const novos = await listarParticipantes(eventId);
      setParticipantes(novos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar');
    } finally {
      setExternoLoading(false);
    }
  }

  const jaParticipanteIds = new Set(participantes.map((p) => p.usuario_id));

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-display text-3xl font-bold mb-2">Convidar pessoas</h1>
      <p className="text-ink-600 mb-6">Busque por nome ou usuário. Se não tiver conta, adicione pelo e-mail.</p>

      <div className="card p-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            className="input pl-10"
            placeholder="Buscar pelo nome ou @usuario"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {searching && <p className="text-sm text-ink-500 mt-3">Procurando…</p>}

        {resultados.length > 0 && (
          <ul className="mt-4 space-y-2">
            {resultados.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:bg-ink-50"
              >
                <Avatar nome={u.nome_completo} url={u.avatar_url} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-900 line-clamp-1">{u.nome_completo}</p>
                  <p className="text-xs text-ink-500">@{u.nome_usuario}</p>
                </div>
                {jaParticipanteIds.has(u.id) ? (
                  <span className="chip-ink">Já está</span>
                ) : (
                  <button onClick={() => convidar(u.id)} className="btn-primary !py-2 !text-sm">
                    <UserPlus className="w-4 h-4" /> Convidar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-5">
        <h3 className="font-display text-xl font-semibold mb-3">Não tem conta no app?</h3>
        <p className="text-sm text-ink-600 mb-4">
          Adicione direto pelo e-mail. Quando ela criar uma conta com esse e-mail, o histórico migra automático.
        </p>
        <form onSubmit={adicionarExterno} className="grid sm:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Nome"
            value={externoNome}
            onChange={(e) => setExternoNome(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={externoEmail}
            onChange={(e) => setExternoEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={externoLoading} className="btn-secondary sm:col-span-2">
            <UserPlus className="w-4 h-4" /> {externoLoading ? 'Adicionando…' : 'Adicionar participante externo'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
      )}

      <h3 className="font-display text-xl font-semibold mt-8 mb-3">No evento ({participantes.length})</h3>
      <div className="space-y-2">
        {participantes.map((p) => (
          <div key={p.id} className="card p-3 flex items-center gap-3">
            <Avatar nome={p.perfis?.nome_completo} url={p.perfis?.avatar_url} size={36} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink-900 line-clamp-1">{p.perfis?.nome_completo ?? '—'}</p>
              <p className="text-xs text-ink-500">@{p.perfis?.nome_usuario ?? '—'}</p>
            </div>
            {p.papel === 'admin' && <span className="chip-brand">Admin</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
