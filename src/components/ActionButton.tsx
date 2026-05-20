import type { CSSProperties } from 'react';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  primary: { bg: '#007AFF', text: '#FFFFFF' },
  secondary: { bg: '#E5E5EA', text: '#000000' },
  danger: { bg: '#FF3B30', text: '#FFFFFF' },
};

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
}: Props) {
  const colors = variantStyles[variant];

  const style: CSSProperties = {
    flex: 1,
    minHeight: 56,
    padding: '16px 12px',
    borderRadius: 14,
    border: 'none',
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: 18,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontFamily: 'inherit',
  };

  return (
    <button style={style} onClick={onPress} disabled={disabled}>
      {title}
    </button>
  );
}
