import { BrowserRouter } from "react-router-dom";
import { GlobalStyles } from "./styles/global-styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes } from "./routes/routes";
import { ErrorModal, ErrorModalProvider } from "./components/shared/ErrorModal";

function App() {
  return (
    <BrowserRouter>
      <ErrorModalProvider>
        <ToastContainer />
        <GlobalStyles />
        <Routes />
        <ErrorModal />
      </ErrorModalProvider>
    </BrowserRouter>
  );
}

export { App };

