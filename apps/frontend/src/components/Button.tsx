
import { useNavigate } from "react-router-dom";

type Props = {
  label: string;
  url: string;
};

export default function Button({label, url}: Props) {

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(url)}
      style={{
        padding: "10px 20px",
        fontSize: "10px",
        marginRight: "18px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      { label }
    </button>
  );
}