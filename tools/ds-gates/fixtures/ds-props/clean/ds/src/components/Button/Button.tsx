interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  tone?: 'neutral';
  onPress?: () => void;
  onLongPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  return <button variant={undefined} />;
}
