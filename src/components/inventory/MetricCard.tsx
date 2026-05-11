interface Props {
  label: string;
  value: string;
  icon: string;
  color: "primary" | "green" | "red" | "amber";
  subtitle?: string;
}

const colorMap = {
  primary: "text-primary",
  green: "text-emerald-400",
  red: "text-error",
  amber: "text-amber-400",
};

export default function MetricCard({
  label,
  value,
  icon,
  color,
  subtitle,
}: Props) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/20 p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`material-symbols-outlined text-xl ${colorMap[color]}`}
        >
          {icon}
        </span>
      </div>
      <p className={`font-serif text-xl font-medium ${colorMap[color]} leading-none mb-1`}>
        {value}
      </p>
      <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
        {label}
      </p>
      {subtitle && (
        <p className="font-sans text-[9px] text-on-surface-variant/60 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
