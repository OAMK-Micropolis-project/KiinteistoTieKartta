// Shared helper used by TalousTab (and anywhere a label/value row is needed)

interface Props {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
