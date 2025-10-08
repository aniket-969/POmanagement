import * as React from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Button from "@mui/material/Button";

function App() {
  const darkTheme = createTheme({
  palette: {
    mode: "dark", 
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <Button variant="outlined">Dark Button</Button>
    </ThemeProvider>
  );
}

export default App;
