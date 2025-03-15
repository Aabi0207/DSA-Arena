import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SheetPage from "./pages/SheetPage";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css"

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/sheet" : "/login"} />} />
        <Route path="/login" element={user ? <Navigate to="/sheet" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/sheet" /> : <RegisterPage />} />
        <Route path="/sheet" element={user ? <SheetPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
