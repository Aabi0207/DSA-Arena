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
      <div>
        {showAlert && (
          <AlertPopup
            message="Something went wrong!"
            type="error"
            onClose={() => setShowAlert(false)}
            duration={4000}
          />
        )}
      </div>
    </>
  );
}

export default App;
