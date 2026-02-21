import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import  Login  from "../pages/auth/Login";

import  Register  from "../pages/auth/Register";
import  ForgotPassword  from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Location from "../pages/dashboard/Location";
import ManageCategories from "../pages/dashboard/ManageCategories";
import Profile from "../pages/dashboard/profile";

import NotFound from "../pages/NotFound";
import StateLocation from "../pages/dashboard/StateLocation";
import CityLocation from "../pages/dashboard/CityLocation";

// import ThemeToggleButton from "./components/Button";

function AppRouter() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />}>
            <Route path="profile" element={<Profile />} />
            {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
            <Route path="/dashboard/location" element={<Location />} />
            <Route path="/dashboard/location/:id" element={<StateLocation />} />
            <Route path="/dashboard/citylocation/:id" element={<CityLocation />} />

            <Route
              path="/dashboard/categories"
              element={<ManageCategories />}
            />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppRouter;
