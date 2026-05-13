interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function Button({ label, onClick, style }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        marginRight: "8px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        ...style,
      }}
    >
      {label}
    </button>
  );
}