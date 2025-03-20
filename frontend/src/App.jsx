import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SheetPage from "./pages/SheetPage";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import "./App.css";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // Wait for a short moment to ensure user is read from localStorage
    const timer = setTimeout(() => {
      setIsAuthLoaded(true);
    }, 100); // can adjust delay if needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthLoaded) {
      const loader = document.getElementById("initial-loader");
      if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.remove();
        }, 500); // matches the CSS transition duration
      }
    }
  }, [isAuthLoaded]);

  if (!isAuthLoaded) return null; // don't render anything until ready

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/sheet" : "/login"} />} />
        <Route path="/login" element={user ? <Navigate to="/sheet" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/sheet" /> : <RegisterPage />} />
        <Route path="/sheet" element={user ? <SheetPage /> : <Navigate to="/login" />} />
        <Route path="/saved" element={user ? <SavedPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
