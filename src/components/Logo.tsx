interface LogoProps {
  size?: number;
  className?: string;
  /** 'icon' = só o símbolo (ic_launcher_logo); 'full' = logo completo com texto (logo_abertura). */
  variant?: 'icon' | 'full';
  /** Quando true e variant === 'icon', desenha o texto "RachaConta" ao lado em fonte normal. */
  withWordmark?: boolean;
}

export function Logo({ size = 40, className = '', variant = 'icon', withWordmark = false }: LogoProps) {
  if (variant === 'full') {
    return (
      <img
        src="/rachaconta-logo.png"
        alt="RachaConta"
        height={size}
        className={className}
        style={{ height: size, width: 'auto' }}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/rachaconta-icon.png"
        alt="RachaConta"
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-brand-600">RachaConta</span>
      )}
    </span>
  );
}
