import { supabase } from '@/lib/supabase';
import type { PerfilDto } from '@/types/dto';

// Espelha AuthRepository.kt do Android.

export async function signUp(args: {
  email: string;
  password: string;
  nomeCompleto: string;
  nomeUsuario: string;
}): Promise<string> {
  const { email, password, nomeCompleto, nomeUsuario } = args;

  // 1. Verifica se username já existe.
  const { data: usernameExists, error: usernameErr } = await supabase.rpc('verificar_username', {
    p_username: nomeUsuario,
  });
  if (usernameErr) throw usernameErr;
  if (usernameExists) throw new Error('Nome de usuário já está em uso');

  // 2. Tenta criar conta no Auth.
  let signUpFalhouPorJaExistir = false;
  const { error: signUpErr } = await supabase.auth.signUp({ email, password });
  if (signUpErr) {
    const m = signUpErr.message || '';
    if (
      /already registered/i.test(m) ||
      /already been registered/i.test(m) ||
      /user_already_exists/i.test(m)
    ) {
      signUpFalhouPorJaExistir = true;
    } else {
      throw signUpErr;
    }
  }

  let userId = (await supabase.auth.getUser()).data.user?.id ?? null;

  if (!userId) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      if (signUpFalhouPorJaExistir) {
        throw new Error(
          "Este e-mail já está cadastrado. Faça login com sua senha ou use 'Esqueci minha senha'."
        );
      }
      // Senão, signup ok mas autoconfirm desabilitado.
    }
    userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  }

  if (!userId) {
    throw new Error('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
  }

  // 3. Cria/migra perfil — RPC reaponta participantes/despesas/divisões/notificações de shadow para real.
  const { error: perfilErr } = await supabase.rpc('criar_ou_migrar_perfil', {
    p_email: email,
    p_nome_completo: nomeCompleto,
    p_nome_usuario: nomeUsuario,
  });
  if (perfilErr) throw perfilErr;

  return userId;
}

export async function signIn(emailOrUsername: string, password: string): Promise<string> {
  let email = emailOrUsername;
  if (!emailOrUsername.includes('@')) {
    const { data, error } = await supabase.rpc('obter_email_por_username', {
      p_username: emailOrUsername,
    });
    if (error) throw error;
    if (!data || data === 'null' || (typeof data === 'string' && data.trim() === '')) {
      throw new Error('Usuário não encontrado');
    }
    email = String(data).replace(/"/g, '');
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const m = error.message || '';
    if (/invalid login credentials/i.test(m)) throw new Error('E-mail ou senha incorretos');
    if (/email not confirmed/i.test(m)) throw new Error('E-mail ainda não confirmado');
    throw error;
  }
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Erro ao fazer login');
  return user.id;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function enviarCodigoRecuperacao(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function verificarCodigoRecuperacao(email: string, codigo: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({
    type: 'recovery',
    email,
    token: codigo,
  });
  if (error) throw error;
}

export async function atualizarSenha(novaSenha: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
}

export async function getCurrentProfile(): Promise<PerfilDto> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Usuário não autenticado');
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  return data as PerfilDto;
}
