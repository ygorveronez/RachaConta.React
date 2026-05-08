import { supabase } from '@/lib/supabase';
import type {
  BuscaUsuarioResult,
  EventoDto,
  ParticipanteEventoComPerfilDto,
} from '@/types/dto';

// Espelha EventoRepository.kt.

export async function listarEventos(): Promise<EventoDto[]> {
  // RLS já filtra eventos onde o usuário é participante.
  const { data, error } = await supabase.from('eventos').select('*').order('criado_em', { ascending: false });
  if (error) throw error;
  return (data ?? []) as EventoDto[];
}

export async function obterEvento(eventoId: string): Promise<EventoDto> {
  const { data, error } = await supabase.from('eventos').select('*').eq('id', eventoId).single();
  if (error) throw error;
  return data as EventoDto;
}

export async function criarEvento(args: {
  nome: string;
  descricao?: string | null;
  dataEvento?: string | null;
}): Promise<string> {
  const params: Record<string, unknown> = { p_nome: args.nome };
  if (args.descricao) params.p_descricao = args.descricao;
  if (args.dataEvento) params.p_data_evento = args.dataEvento;
  const { data, error } = await supabase.rpc('criar_evento_com_admin', params);
  if (error) throw error;
  return String(data).replace(/"/g, '');
}

export async function listarParticipantes(eventoId: string): Promise<ParticipanteEventoComPerfilDto[]> {
  // hint !usuario_id desambigua (perfis tem 2 FKs: usuario_id e convidado_por).
  const { data, error } = await supabase
    .from('participantes_evento')
    .select('*, perfis!usuario_id(*)')
    .eq('evento_id', eventoId)
    .eq('status', 'aceito');
  if (error) throw error;
  return (data ?? []) as ParticipanteEventoComPerfilDto[];
}

export async function contarParticipantes(eventoId: string): Promise<number> {
  const { count, error } = await supabase
    .from('participantes_evento')
    .select('id', { count: 'exact', head: true })
    .eq('evento_id', eventoId)
    .eq('status', 'aceito');
  if (error) throw error;
  return count ?? 0;
}

export async function convidarParticipante(eventoId: string, usuarioId: string): Promise<void> {
  const me = (await supabase.auth.getUser()).data.user;
  if (!me) throw new Error('Usuário não autenticado');
  const { error } = await supabase.from('participantes_evento').insert({
    evento_id: eventoId,
    usuario_id: usuarioId,
    status: 'aceito',
    convidado_por: me.id,
  });
  if (error) throw error;
}

export async function adicionarParticipanteExterno(args: {
  eventoId: string;
  email: string;
  nomeCompleto: string;
}): Promise<string> {
  const { data, error } = await supabase.rpc('adicionar_participante_externo', {
    p_evento_id: args.eventoId,
    p_email: args.email,
    p_nome_completo: args.nomeCompleto,
  });
  if (error) throw error;
  return String(data).replace(/"/g, '');
}

export async function buscarUsuarios(termo: string): Promise<BuscaUsuarioResult[]> {
  const { data, error } = await supabase.rpc('buscar_usuarios', { termo });
  if (error) throw error;
  return (data ?? []) as BuscaUsuarioResult[];
}

export async function arquivarEvento(eventoId: string): Promise<void> {
  const { error } = await supabase.rpc('arquivar_evento', { p_evento_id: eventoId });
  if (error) throw error;
}
