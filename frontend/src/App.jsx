import { useState } from "react";
import "./App.css";
import AlertPopup from "./components/AlertPopup/AlertPopup";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <>
      <Login />
      <Register />
    </>
  );
}

export default App;
