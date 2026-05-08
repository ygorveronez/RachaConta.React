import { supabase } from '@/lib/supabase';
import type { NotificacaoDto } from '@/types/dto';

export async function listarNotificacoes(): Promise<NotificacaoDto[]> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];
  const { data, error } = await supabase
    .from('notificacoes')
    .select('*, perfis!remetente_id(*)')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false });
  if (error) throw error;
  return (data ?? []) as NotificacaoDto[];
}

export async function contarNaoLidas(): Promise<number> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return 0;
  const { data, error } = await supabase.rpc('contar_notificacoes_nao_lidas');
  if (error) throw error;
  return Number(data ?? 0);
}

export async function marcarComoLida(notificacaoId: string): Promise<void> {
  const { error } = await supabase
    .from('notificacoes')
    .update({ lida: true })
    .eq('id', notificacaoId);
  if (error) throw error;
}

export async function marcarTodasComoLidas(): Promise<void> {
  const { error } = await supabase.rpc('marcar_todas_notificacoes_lidas');
  if (error) throw error;
}

export async function apagarLidas(): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;
  const { error } = await supabase
    .from('notificacoes')
    .delete()
    .eq('usuario_id', user.id)
    .eq('lida', true);
  if (error) throw error;
}
