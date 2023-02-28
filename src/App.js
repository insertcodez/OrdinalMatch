import "./App.css";
import CollapsibleTable from "./CollapsibleTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Disclaimermodal from "./Disclaimermodal";

const font = "Chakra Petch, sans-serif";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 620,
      md: 900,
      lg: 990,
      xl: 1060,
    },
  },
  typography: {
    fontFamily: font,
    fontWeightRegular: 500,
    fontWeightBold: 700,
    letterSpacing: '1rem',
    },
  palette: {
    primary: {
      main: '#FF7611',
      light: '#4db6ac',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#000000',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffeb3b',
      light: '#ffff72',
      dark: '#c8b900',
      contrastText: '#000000',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#BCBFC3',
      secondary: 'orange',
      disabled: '#bdbdbd',
      hint: '#9e9e9e',
    },
    background: {
      paper: '#1e1e1e',
      default: '#1A2027',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        
        <header className="App-header">
        <Disclaimermodal/>
          

          <CollapsibleTable />
          
        </header>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
