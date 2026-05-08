import { avatarColor, initials } from '@/lib/format';

interface AvatarProps {
  nome?: string | null;
  url?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ nome, url, size = 40, className = '' }: AvatarProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={nome ?? 'avatar'}
        width={size}
        height={size}
        className={`rounded-full object-cover ring-2 ring-white ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold ring-2 ring-white ${className}`}
      style={{
        width: size,
        height: size,
        background: avatarColor(nome),
        fontSize: size * 0.38,
      }}
      aria-label={nome ?? 'avatar'}
    >
      {initials(nome)}
    </span>
  );
}
