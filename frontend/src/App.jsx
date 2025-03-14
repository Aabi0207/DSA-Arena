import { useState } from "react";
import "./App.css";
import AlertPopup from "./components/AlertPopup/AlertPopup";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <>
      <Navbar Rank={1}/>
      <Login />
      <Register />
    </>
  );
}

export default App;
