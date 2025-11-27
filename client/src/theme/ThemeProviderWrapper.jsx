import { ThemeProvider } from "@mui/material/styles";
import theme from "./index";

export default function ThemeProviderWrapper({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
