interface ButtonProps {
  kind: 'primary' | 'secondary';
  onLongTap?: () => void;
  padding?: number;
}

export function Button(props: ButtonProps) {
  return <button kind={props.kind} onLongTap={props.onLongTap} />;
}
