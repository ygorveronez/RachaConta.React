import { supabase } from '@/lib/supabase';
import type {
  AcertoContasResult,
  CriarDespesaDivisao,
  DespesaDto,
  DivisaoDespesaDto,
  ResumoFinanceiroResult,
} from '@/types/dto';

// Espelha DespesaRepository.kt.

export async function listarDespesas(eventoId: string): Promise<DespesaDto[]> {
  // Mais recente primeiro; despesas sem data ficam por último (NULLS LAST).
  // Critério de desempate: criado_em desc, pra estabilidade.
  const { data, error } = await supabase
    .from('despesas')
    .select('*')
    .eq('evento_id', eventoId)
    .order('data_despesa', { ascending: false, nullsFirst: false })
    .order('criado_em', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DespesaDto[];
}

export async function obterDespesa(despesaId: string): Promise<DespesaDto> {
  const { data, error } = await supabase.from('despesas').select('*').eq('id', despesaId).single();
  if (error) throw error;
  return data as DespesaDto;
}

export async function listarDivisoes(despesaId: string): Promise<DivisaoDespesaDto[]> {
  const { data, error } = await supabase
    .from('divisoes_despesa')
    .select('*')
    .eq('despesa_id', despesaId);
  if (error) throw error;
  return (data ?? []) as DivisaoDespesaDto[];
}

export async function criarDespesa(args: {
  eventoId: string;
  descricao: string;
  valorTotal: number;
  pagoPor: string;
  /** ISO 8601 UTC ('YYYY-MM-DDTHH:mm:ss.sssZ') ou null quando o usuário não preencheu. */
  dataDespesa: string | null;
  tipoDivisao: 'igual' | 'manual';
  reciboUrl?: string | null;
  divisoes: CriarDespesaDivisao[];
  categoria?: string;
}): Promise<string> {
  const { data, error } = await supabase.rpc('criar_despesa_com_divisoes', {
    p_evento_id: args.eventoId,
    p_descricao: args.descricao,
    p_valor_total: args.valorTotal,
    p_pago_por: args.pagoPor,
    p_data_despesa: args.dataDespesa,
    p_tipo_divisao: args.tipoDivisao,
    p_recibo_url: args.reciboUrl ?? null,
    p_divisoes: args.divisoes,
    p_categoria: args.categoria ?? 'OTHERS',
  });
  if (error) throw error;
  return String(data).replace(/"/g, '');
}

export async function atualizarDespesa(args: {
  despesaId: string;
  descricao: string;
  valorTotal: number;
  pagoPor: string;
  /** ISO 8601 UTC ou null quando o usuário não preencheu. */
  dataDespesa: string | null;
  tipoDivisao: 'igual' | 'manual';
  reciboUrl?: string | null;
  divisoes: CriarDespesaDivisao[];
  categoria?: string;
}): Promise<void> {
  const { error } = await supabase.rpc('atualizar_despesa_com_divisoes', {
    p_despesa_id: args.despesaId,
    p_descricao: args.descricao,
    p_valor_total: args.valorTotal,
    p_pago_por: args.pagoPor,
    p_data_despesa: args.dataDespesa,
    p_tipo_divisao: args.tipoDivisao,
    p_recibo_url: args.reciboUrl ?? null,
    p_divisoes: args.divisoes,
    p_categoria: args.categoria ?? 'OTHERS',
  });
  if (error) throw error;
}

export async function deletarDespesa(despesaId: string): Promise<void> {
  const { error } = await supabase.rpc('deletar_despesa', { p_despesa_id: despesaId });
  if (error) throw error;
}

export async function resumoFinanceiro(eventoId: string): Promise<ResumoFinanceiroResult[]> {
  const { data, error } = await supabase.rpc('resumo_financeiro_evento', { p_evento_id: eventoId });
  if (error) throw error;
  return (data ?? []) as ResumoFinanceiroResult[];
}

export async function acertoContas(eventoId: string): Promise<AcertoContasResult[]> {
  const { data, error } = await supabase.rpc('calcular_acerto_contas', { p_evento_id: eventoId });
  if (error) throw error;
  return (data ?? []) as AcertoContasResult[];
}
