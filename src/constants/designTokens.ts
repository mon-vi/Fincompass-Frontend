export const designTokens = {
  colors: {
    primary: 'var(--fc-color-primary)',
    primarySoft: 'var(--fc-color-primary-soft)',
    accent: 'var(--fc-color-accent)',
    background: 'var(--fc-color-background)',
    cardBorder: 'var(--fc-color-card-border)',
    text: 'var(--fc-color-text)',
    mutedText: 'var(--fc-color-text-muted)',
    success: 'var(--fc-color-success)',
    warning: 'var(--fc-color-warning)',
    error: 'var(--fc-color-error)',
  },
  classes: {
    logoMark: 'bg-[var(--fc-color-primary)] text-white shadow-sm shadow-slate-900/20',
    primaryButton: 'bg-[var(--fc-color-primary)] text-white hover:bg-[var(--fc-color-primary-strong)]',
    accentButton: 'bg-[var(--fc-color-accent)] text-white hover:bg-[var(--fc-color-accent-strong)]',
    primaryText: 'text-[var(--fc-color-primary)]',
    pageGradient: 'bg-[var(--fc-color-background)]',
    card: 'border-[var(--fc-color-card-border)] bg-white/95',
  },
} as const;
