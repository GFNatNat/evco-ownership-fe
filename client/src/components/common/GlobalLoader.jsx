import { useLoading } from "../../contexts/LoadingContext";
import LinearProgress from "@mui/material/LinearProgress";

export default function GlobalLoader() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <LinearProgress />
    </div>
  );
}
