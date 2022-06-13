import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const themeLight = createTheme({
  palette: {
    primary: {
      main : "#cc0100"
    }
  }
});
root.render(
  <React.StrictMode>
            <ThemeProvider theme={themeLight}>

    <SnackbarProvider maxSnack={3}>
    <App />
    </SnackbarProvider>
    </ThemeProvider>

  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
