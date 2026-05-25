import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { listarParticipantes } from '@/api/eventos';
import {
  atualizarDespesa,
  criarDespesa,
  deletarDespesa,
  listarDivisoes,
  obterDespesa,
} from '@/api/despesas';
import {
  CATEGORIAS,
  type CategoriaKey,
  type DespesaDto,
  type DivisaoDespesaDto,
  type ParticipanteEventoComPerfilDto,
} from '@/types/dto';
import { formatBRL, formatDateTimeLocalInput, toUtcIsoFromLocalInput } from '@/lib/format';
import { Avatar } from '@/components/Avatar';

export default function AddExpensePage() {
  const { eventId, expenseId } = useParams<{ eventId: string; expenseId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(expenseId);

  const [participantes, setParticipantes] = useState<ParticipanteEventoComPerfilDto[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<string>('');
  // Data é OPCIONAL — começa vazia. Se ficar vazia ao salvar, vai null pro banco.
  const [data, setData] = useState<string>('');
  const [pagoPor, setPagoPor] = useState<string>('');
  const [categoria, setCategoria] = useState<CategoriaKey>('OTHERS');
  const [tipo, setTipo] = useState<'igual' | 'manual'>('igual');
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [valoresManuais, setValoresManuais] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Guarda criado_por e pago_por originais da despesa (em edição) pra checar permissão.
  // Regra do RPC atualizar_despesa_com_divisoes: só criador ou pagador original podem editar.
  const [donoOriginal, setDonoOriginal] = useState<{ criado_por: string; pago_por: string } | null>(null);
  const podeEditar =
    !isEdit || !donoOriginal || !user
      ? true
      : user.id === donoOriginal.criado_por || user.id === donoOriginal.pago_por;

  useEffect(() => {
    if (!eventId) return;
    let active = true;
    (async () => {
      try {
        const parts = await listarParticipantes(eventId);
        if (!active) return;
        setParticipantes(parts);
        // Default: todos selecionados.
        setSelecionados(new Set(parts.map((p) => p.usuario_id)));
        if (parts[0]) setPagoPor(parts[0].usuario_id);

        if (expenseId) {
          const [despesa, divisoes] = await Promise.all([
            obterDespesa(expenseId),
            listarDivisoes(expenseId),
          ]);
          if (!active) return;
          fillFromDespesa(despesa, divisoes);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar');
      } finally {
        if (active) setBootstrapping(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [eventId, expenseId]);

  function fillFromDespesa(d: DespesaDto, divisoes: DivisaoDespesaDto[]) {
    setDonoOriginal({ criado_por: d.criado_por, pago_por: d.pago_por });
    setDescricao(d.descricao);
    setValor(formatCurrencyFromNumber(Number(d.valor_total)));
    // Despesa pode ter data null — input fica vazio nesse caso.
    setData(formatDateTimeLocalInput(d.data_despesa));
    setPagoPor(d.pago_por);
    setCategoria((d.categoria as CategoriaKey) || 'OTHERS');
    setTipo(d.tipo_divisao === 'manual' ? 'manual' : 'igual');
    const ids = new Set(divisoes.map((dv) => dv.participante_id));
    setSelecionados(ids);
    const map: Record<string, string> = {};
    divisoes.forEach((dv) => {
      map[dv.participante_id] = formatCurrencyFromNumber(Number(dv.valor));
    });
    setValoresManuais(map);
  }

  const valorNumber = useMemo(() => parseValor(valor), [valor]);

  function toggleParticipante(id: string) {
    const next = new Set(selecionados);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelecionados(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!eventId) return;
    if (!descricao.trim()) return setError('Descrição é obrigatória');
    if (!valorNumber || valorNumber <= 0) return setError('Valor inválido');
    if (!pagoPor) return setError('Selecione quem pagou');
    if (selecionados.size === 0) return setError('Selecione pelo menos um participante');

    let divisoes: { participante_id: string; valor: number }[] = [];
    if (tipo === 'igual') {
      const perPerson = round2(valorNumber / selecionados.size);
      divisoes = Array.from(selecionados).map((id) => ({ participante_id: id, valor: perPerson }));
      // Ajusta a sobra/falta na última divisão para fechar o total exato.
      const soma = perPerson * selecionados.size;
      const diff = round2(valorNumber - soma);
      if (Math.abs(diff) > 0 && divisoes.length > 0) {
        divisoes[divisoes.length - 1].valor = round2(divisoes[divisoes.length - 1].valor + diff);
      }
    } else {
      divisoes = Array.from(selecionados).map((id) => ({
        participante_id: id,
        valor: parseValor(valoresManuais[id] ?? '') ?? 0,
      }));
      const soma = divisoes.reduce((s, d) => s + d.valor, 0);
      if (Math.abs(soma - valorNumber) > 0.01) {
        return setError(
          `A soma das divisões (${formatBRL(soma)}) tem que bater com o total (${formatBRL(valorNumber)})`
        );
      }
    }

    // Vazio → null. Preenchido → ISO 8601 UTC com hora (datetime-local sai sem TZ).
    const dataISO = data ? toUtcIsoFromLocalInput(data) : null;

    setLoading(true);
    try {
      if (isEdit && expenseId) {
        await atualizarDespesa({
          despesaId: expenseId,
          descricao: descricao.trim(),
          valorTotal: valorNumber,
          pagoPor,
          dataDespesa: dataISO,
          tipoDivisao: tipo,
          divisoes,
          categoria,
        });
      } else {
        await criarDespesa({
          eventoId: eventId,
          descricao: descricao.trim(),
          valorTotal: valorNumber,
          pagoPor,
          dataDespesa: dataISO,
          tipoDivisao: tipo,
          divisoes,
          categoria,
        });
      }
      navigate(`/app/eventos/${eventId}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao salvar despesa'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!expenseId || !eventId) return;
    if (!confirm('Apagar essa despesa? Não tem como desfazer.')) return;
    setLoading(true);
    try {
      await deletarDespesa(expenseId);
      navigate(`/app/eventos/${eventId}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao apagar'));
    } finally {
      setLoading(false);
    }
  }

  if (bootstrapping) {
    return <div className="card p-8 animate-pulse-soft h-64" />;
  }

  const somaManual = Array.from(selecionados).reduce(
    (s, id) => s + (parseValor(valoresManuais[id] ?? '') ?? 0),
    0
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">{isEdit ? 'Editar despesa' : 'Nova despesa'}</h1>
          <p className="text-ink-600">Quem pagou? Quanto? Quem racha?</p>
        </div>
        {isEdit && podeEditar && (
          <button onClick={handleDelete} className="btn-danger" type="button">
            <Trash2 className="w-4 h-4" /> Apagar
          </button>
        )}
      </div>

      {!podeEditar && (
        <div className="card p-4 mb-4 bg-amber-50 border-amber-200 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Só dá pra editar quem criou ou quem pagou.</p>
            <p className="text-amber-800 mt-1">
              Como você não foi nem o autor nem o pagador desta despesa, ela aparece só pra consulta.
              Peça pra quem cadastrou (ou quem pagou) fazer a alteração.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Descrição *</label>
          <input
            className="input"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Almoço, hospedagem, Uber pra balada…"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Valor (R$) *</label>
            <input
              className="input"
              inputMode="numeric"
              value={valor}
              onChange={(e) => setValor(maskCurrency(e.target.value))}
              placeholder="0,00"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Data e hora <span className="text-ink-400 font-normal">(opcional)</span></label>
              {data && (
                <button
                  type="button"
                  onClick={() => setData('')}
                  className="text-xs text-brand-600 hover:underline mb-1"
                >
                  Limpar
                </button>
              )}
            </div>
            <input
              type="datetime-local"
              className="input"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Categoria</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIAS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategoria(c.key)}
                className={`shrink-0 px-3 py-2 rounded-full text-sm font-medium transition ${
                  categoria === c.key
                    ? 'bg-brand-500 text-white shadow-soft'
                    : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Pago por *</label>
          <select className="input" value={pagoPor} onChange={(e) => setPagoPor(e.target.value)} required>
            {participantes.map((p) => (
              <option key={p.usuario_id} value={p.usuario_id}>
                {p.perfis?.nome_completo ?? p.perfis?.nome_usuario ?? '—'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Modo de divisão *</label>
          <div className="grid grid-cols-2 gap-2">
            {(['igual', 'manual'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`px-4 py-3 rounded-xl text-sm font-medium border transition ${
                  tipo === t
                    ? 'bg-brand-500 text-white border-brand-500 shadow-soft'
                    : 'bg-white text-ink-700 border-ink-200 hover:bg-ink-100'
                }`}
              >
                {t === 'igual' ? 'Dividir igualmente' : 'Editar manualmente'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Quem racha *</label>
          <div className="space-y-2">
            {participantes.map((p) => {
              const checked = selecionados.has(p.usuario_id);
              const igualValor = checked && valorNumber && selecionados.size > 0
                ? valorNumber / selecionados.size
                : 0;
              return (
                <div
                  key={p.usuario_id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    checked ? 'border-brand-300 bg-brand-50' : 'border-ink-200 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-brand-500"
                    checked={checked}
                    onChange={() => toggleParticipante(p.usuario_id)}
                  />
                  <Avatar nome={p.perfis?.nome_completo} url={p.perfis?.avatar_url} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 line-clamp-1">{p.perfis?.nome_completo ?? '—'}</p>
                    <p className="text-xs text-ink-500">@{p.perfis?.nome_usuario ?? '—'}</p>
                  </div>
                  {checked && tipo === 'igual' && (
                    <span className="text-sm font-semibold text-brand-600">{formatBRL(igualValor || 0)}</span>
                  )}
                  {checked && tipo === 'manual' && (
                    <input
                      className="w-28 input !py-2 !text-sm"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={valoresManuais[p.usuario_id] ?? ''}
                      onChange={(e) =>
                        setValoresManuais({
                          ...valoresManuais,
                          [p.usuario_id]: maskCurrency(e.target.value),
                        })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          {tipo === 'manual' && valorNumber && (
            <p className={`text-sm mt-2 ${
              Math.abs(somaManual - valorNumber) > 0.01 ? 'text-danger-500' : 'text-lime-600'
            }`}>
              Soma: {formatBRL(somaManual)} de {formatBRL(valorNumber)}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !podeEditar}
          className="btn-primary w-full text-base py-4"
        >
          {loading ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Lançar despesa'}
        </button>
      </form>
    </div>
  );
}

// Supabase PostgrestError não estende Error, então `err instanceof Error` falha.
// Tentamos extrair .message de qualquer objeto antes de cair no fallback.
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  if (typeof err === 'string' && err.trim()) return err;
  return fallback;
}

function parseValor(s: string): number | null {
  if (!s) return null;
  const cleaned = s.replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Máscara estilo "caixa de loja": dígitos vão preenchendo do centavo pra cima.
// "1" → "0,01"; "12313" → "123,13"; "1231300" → "12.313,00".
function maskCurrency(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrencyFromNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
