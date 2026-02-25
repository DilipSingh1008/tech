import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Location from "../pages/dashboard/Location/Location";
import ManageCategories from "../pages/dashboard/ManageCategories/ManageCategories";
import Profile from "../pages/dashboard/profile";

import NotFound from "../pages/NotFound";
import StateLocation from "../pages/dashboard/Location/StateLocation";
import CityLocation from "../pages/dashboard/Location/CityLocation";
import Subcategory from "../pages/dashboard/ManageCategories/Subcategory";
import SiteSetting from "../pages/dashboard/setting/SiteSetting";
import BannerPage from "../pages/dashboard/Banner/BannerPage";
// import ProductCategory from "../pages/dashboard/product/ProductCategory";
import ProductCategoryItems from "../pages/dashboard/product/ProductCategoryItems";
import ServicePage from "../pages/dashboard/Manage Services/ServicePage.jsx";
import AddServicePage from "../pages/dashboard/Manage Services/AddServicePage.jsx";
import ProductCategory from "../pages/dashboard/product/ProductCategory.jsx";
import UserPage from "../pages/dashboard/UserPage/UserPage.jsx";
// import ProductManagement from "../pages/dashboard/product/ProductCategory";

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
              <Route
                path="/dashboard/location/:id"
                element={<StateLocation />}
              />
              <Route
                path="/dashboard/citylocation/:id"
                element={<CityLocation />}
              />
              <Route
                path="/dashboard/categories"
                element={<ManageCategories />}
              />
              <Route path="/dashboard/category/:id" element={<Subcategory />} />
              <Route path="/dashboard/settings" element={<SiteSetting />} />
              <Route path="/dashboard/banner" element={<BannerPage />} />
              <Route path="/dashboard/products" element={<ProductCategory />} />
              <Route path="/dashboard/service" element={<ServicePage />} />
              <Route
                path="/dashboard/product-items"
                element={<ProductCategoryItems />}
              />
              <Route
                path="/dashboard/service/edit/:id"
                element={<AddServicePage />}
              />
              <Route
                path="/dashboard/service/add"
                element={<AddServicePage />}
              />
              <Route path="/dashboard/user" element={<UserPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppRouter;
