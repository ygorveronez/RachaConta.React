import { supabase } from '@/lib/supabase';
import type { PerfilDto } from '@/types/dto';

export async function obterPerfil(userId: string): Promise<PerfilDto> {
  const { data, error } = await supabase.from('perfis').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as PerfilDto;
}

export async function atualizarPerfil(args: {
  userId: string;
  nomeCompleto?: string;
  nomeUsuario?: string;
  avatarUrl?: string | null;
}): Promise<void> {
  const update: Record<string, unknown> = {};
  if (args.nomeCompleto !== undefined) update.nome_completo = args.nomeCompleto;
  if (args.nomeUsuario !== undefined) update.nome_usuario = args.nomeUsuario;
  if (args.avatarUrl !== undefined) update.avatar_url = args.avatarUrl;
  const { error } = await supabase.from('perfis').update(update).eq('id', args.userId);
  if (error) throw error;
}
