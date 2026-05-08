// DTOs em snake_case (espelhando o schema do Postgres / supabase-js retorna assim).
// Mantemos os mesmos nomes do banco — coerente com a CLAUDE.md ("domínio em português").

export interface PerfilDto {
  id: string;
  nome_completo: string;
  nome_usuario: string;
  email: string;
  avatar_url: string | null;
  pendente?: boolean;
  criado_em?: string | null;
  atualizado_em?: string | null;
}

export interface EventoDto {
  id: string;
  nome: string;
  descricao: string | null;
  data_evento: string | null;
  criado_por: string;
  arquivado: boolean;
  criado_em?: string | null;
  atualizado_em?: string | null;
}

export interface ParticipanteEventoComPerfilDto {
  id: string;
  evento_id: string;
  usuario_id: string;
  papel: string;
  status: string;
  perfis?: PerfilDto | null;
}

export interface DespesaDto {
  id: string;
  evento_id: string;
  descricao: string;
  valor_total: number;
  pago_por: string;
  data_despesa: string | null;
  tipo_divisao: 'igual' | 'manual' | string;
  recibo_url: string | null;
  categoria?: string;
  criado_por: string;
  criado_em?: string | null;
}

export interface DivisaoDespesaDto {
  id: string;
  despesa_id: string;
  participante_id: string;
  valor: number;
}

export interface CriarDespesaDivisao {
  participante_id: string;
  valor: number;
}

export interface ResumoFinanceiroResult {
  usuario_id: string;
  nome_completo: string;
  nome_usuario: string;
  avatar_url: string | null;
  pendente?: boolean;
  total_pago: number;
  total_deve: number;
  saldo: number;
}

export interface AcertoContasResult {
  devedor_id: string;
  devedor_nome: string;
  credor_id: string;
  credor_nome: string;
  valor: number;
}

export interface BuscaUsuarioResult {
  id: string;
  nome_completo: string;
  nome_usuario: string;
  avatar_url: string | null;
}

export interface NotificacaoDto {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  evento_id: string | null;
  remetente_id: string | null;
  lida: boolean;
  criado_em: string;
  perfis?: PerfilDto | null;
}

// Categorias da despesa — espelha enum ExpenseCategory do app Android.
export const CATEGORIAS = [
  { key: 'FOOD', label: 'Alimentação', icon: 'Utensils' },
  { key: 'DRINKS', label: 'Bebidas', icon: 'Wine' },
  { key: 'COFFEE', label: 'Café', icon: 'Coffee' },
  { key: 'SHOPPING', label: 'Compras', icon: 'ShoppingCart' },
  { key: 'ACCOMMODATION', label: 'Hospedagem', icon: 'BedDouble' },
  { key: 'TRANSPORT', label: 'Transporte', icon: 'Car' },
  { key: 'FUEL', label: 'Combustível', icon: 'Fuel' },
  { key: 'ENTERTAINMENT', label: 'Entretenimento', icon: 'Ticket' },
  { key: 'HEALTH', label: 'Saúde', icon: 'Heart' },
  { key: 'EDUCATION', label: 'Educação', icon: 'GraduationCap' },
  { key: 'GIFT', label: 'Presente', icon: 'Gift' },
  { key: 'BILLS', label: 'Contas', icon: 'Receipt' },
  { key: 'OTHERS', label: 'Outros', icon: 'MoreHorizontal' },
] as const;

export type CategoriaKey = (typeof CATEGORIAS)[number]['key'];
