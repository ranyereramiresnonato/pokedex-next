type PokeballIconProps = {
  className?: string;
  title?: string;
};

export function PokeballIcon({ className, title }: PokeballIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#1d2333" strokeWidth="7" />
      <path d="M6 50a44 44 0 0 1 88 0H6Z" fill="#d62828" />
      <rect x="6" y="46" width="88" height="8" fill="#1d2333" />
      <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#1d2333" strokeWidth="7" />
      <circle cx="50" cy="50" r="7" fill="#f4f5f9" />
    </svg>
  );
}
