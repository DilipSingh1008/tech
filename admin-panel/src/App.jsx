import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/dashboard/profile";
import ManageCategories from "./pages/dashboard/ManageCategories";
// import ThemeToggleButton from "./components/Button";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route
              path="/dashboard/categories"
              element={<ManageCategories />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
