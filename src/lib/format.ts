import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function formatDate(iso: string | null | undefined, pattern = "dd 'de' MMM',' yyyy"): string {
  if (!iso) return 'Sem data';
  try {
    // Quando o pattern só envolve data (sem hora), parseamos os dígitos yyyy-MM-dd
    // como data CIVIL local — assim '2026-05-08T00:00:00+00:00' não vira '07/05'
    // em UTC-3. Para patterns com hora (H/m/s) mantemos parseISO normal.
    const hasTime = /[HhmsKaA]/.test(pattern);
    if (!hasTime) {
      const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        return format(d, pattern, { locale: ptBR });
      }
    }
    return format(parseISO(iso), pattern, { locale: ptBR });
  } catch {
    return 'Sem data';
  }
}

/** Mostra "08 de mai, 2026 às 14:30" — null vira "Sem data". */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return 'Sem data';
  try {
    return format(parseISO(iso), "dd 'de' MMM',' yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return 'Sem data';
  }
}

/** Para `<input type="date">` — só os primeiros 10 chars, sem conversão de fuso. */
export function formatDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.slice(0, 10);
  try {
    return format(parseISO(iso), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

/**
 * Para `<input type="datetime-local">` — devolve "yyyy-MM-ddTHH:mm" no fuso LOCAL
 * do navegador. Ex.: timestamp "2026-05-08T17:30:00+00:00" em UTC-3 vira
 * "2026-05-08T14:30".
 */
export function formatDateTimeLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
}

/**
 * Converte o valor de um `<input type="datetime-local">` (que vem sem timezone,
 * ex.: "2026-05-08T14:30") em ISO UTC pra enviar ao Postgres. Retorna null se
 * vazio. Em UTC-3, "2026-05-08T14:30" vira "2026-05-08T17:30:00.000Z".
 */
export function toUtcIsoFromLocalInput(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function todayISODate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function initials(nome: string | null | undefined): string {
  if (!nome) return '?';
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#6366F1', '#1E27CC',
];

export function avatarColor(seed: string | null | undefined): string {
  if (!seed) return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
