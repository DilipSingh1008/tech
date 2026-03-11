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
import ProductCategory from "../pages/dashboard/product/ProductCategory";
// import ProductCategoryItems from "../pages/dashboard/product/ProductCategoryItems";
import ServicePage from "../pages/dashboard/Manage Services/ServicePage.jsx";
import AddServicePage from "../pages/dashboard/Manage Services/AddServicePage.jsx";
// import ProductCategory from "../pages/dashboard/product/ProductCategory.jsx";
import UserPage from "../pages/dashboard/UserPage/UserPage.jsx";
import ProductForm from "../pages/dashboard/product/ProductForm.jsx";
import ManageRole from "../pages/dashboard/UserPage/ManageRole.jsx";
import Cms from "../pages/dashboard/cms/Cms.jsx";
import AddCmsForm from "../pages/dashboard/cms/AddCmsForm.jsx";
import DashboardShow from "../pages/dashboard/DashboardShow.jsx";
import ManageFaqCategory from "../pages/dashboard/faq-category/ManageFaqCategory.jsx";
import ManageFaq from "../pages/dashboard/faq-category/ManageFaq.jsx";
import ManagePermissions from "../pages/dashboard/UserPage/ManagePermissions.jsx";
import ManageModules from "../pages/dashboard/UserPage/ManageModules.jsx";
import ManageUserPermissions from "../pages/dashboard/UserPage/ManageUserPermissions.jsx";
import ManageNews from "../pages/dashboard/MangeNews/ManageNews.jsx";
import NewsForm from "../pages/dashboard/MangeNews/NewsForm.jsx";
import ManageBlogCategory from "../pages/dashboard/Blog/ManageBlogCategory.jsx";
import ManageBlog from "../pages/dashboard/Blog/ManageBlog.jsx";
import BlogAdd from "../pages/dashboard/Blog/BlogAdd.jsx";
import ClientPage from "../pages/dashboard/client/ClientPage.jsx";
import Enquires from "../pages/enquiry/Enquires.jsx";
import Vendor from "../pages/vendor/Vendor.jsx";
import ManageCareer from "../pages/dashboard/Career/ManageCareer.jsx";
import ManageMediaPost from "../pages/dashboard/MediaPost/ManageMediaPost.jsx";
import ManageMedia from "../pages/dashboard/ManageMedia/ManageMedia.jsx";
import MediaItemsList from "../pages/dashboard/ManageMedia/MediaItemsList.jsx";
import MediaAddEdit from "../pages/dashboard/ManageMedia/AddEditMediaItem.jsx";
import ModulePlaceholder from "../pages/dashboard/ModulePlaceholder.jsx";

import ProtectedRoute from "../pages/auth/ProtectedRoute.jsx";
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
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardShow />} />{" "}
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
                <Route
                  path="/dashboard/category/:id"
                  element={<Subcategory />}
                />
                <Route path="/dashboard/settings" element={<SiteSetting />} />
                <Route path="/dashboard/banner" element={<BannerPage />} />
                <Route
                  path="/dashboard/products"
                  element={<ProductCategory />}
                />
                <Route
                  path="/dashboard/products/add"
                  element={<ProductForm />}
                />
                <Route
                  path="/dashboard/products/edit/:id"
                  element={<ProductForm />}
                />
                <Route path="/dashboard/service" element={<ServicePage />} />
                {/* <Route
                path="/dashboard/product-items"
                element={<ProductCategoryItems />}
              /> */}
                <Route
                  path="/dashboard/service/edit/:id"
                  element={<AddServicePage />}
                />
                <Route
                  path="/dashboard/service/add"
                  element={<AddServicePage />}
                />
                <Route path="/dashboard/cms" element={<Cms />} />
                <Route path="/dashboard/add-cms" element={<AddCmsForm />} />
                <Route
                  path="/dashboard/edit-cms/:id"
                  element={<AddCmsForm />}
                />
                <Route path="/dashboard/user" element={<UserPage />} />
                <Route path="/dashboard/managerole" element={<ManageRole />} />
                <Route
                  path="/dashboard/manage-modules"
                  element={<ManageModules />}
                />
                <Route
                  path="/dashboard/manage-permission/:id"
                  element={<ManagePermissions />}
                />
                <Route
                  path="/dashboard/user-permission/:id"
                  element={<ManageUserPermissions />}
                />
                <Route
                  path="/dashboard/faq-category"
                  element={<ManageFaqCategory />}
                />
                <Route path="/dashboard/manage-faq" element={<ManageFaq />} />
                <Route path="/dashboard/manage-news" element={<ManageNews />} />
                <Route
                  path="/dashboard/manage-news/add"
                  element={<NewsForm />}
                />
                <Route
                  path="/dashboard/manage-news/edit/:id"
                  element={<NewsForm />}
                />
                <Route
                  path="/dashboard/Manage-Blog-Categor"
                  element={<ManageBlogCategory />}
                />
                <Route path="/dashboard/Manage-Blog" element={<ManageBlog />} />
                <Route
                  path="/dashboard/Manage-Blog/add"
                  element={<BlogAdd />}
                />
                <Route
                  path="/dashboard/Manage-Blog/edit/:id"
                  element={<BlogAdd />}
                />
                <Route path="/dashboard/Client" element={<ClientPage />} />
                <Route path="/dashboard/enquiry" element={<Enquires />} />
                <Route path="/dashboard/vendor" element={<Vendor />} />
                <Route path="/dashboard/career" element={<ManageCareer />} />
                <Route
                  path="/dashboard/Media-Post"
                  element={<ManageMediaPost />}
                />
                <Route
                  path="/dashboard/Manage-media"
                  element={<ManageMedia />}
                />
                <Route
                  path="/dashboard/Manage-media-items"
                  element={<MediaItemsList />}
                />
                <Route
                  path="/dashboard/Manage-media-items/add"
                  element={<MediaAddEdit />}
                />
                <Route
                  path="/dashboard/Manage-media-items/edit/:id"
                  element={<MediaAddEdit />}
                />
                <Route
                path="/dashboard/module/:name"
                element={<ModulePlaceholder />}
              />

              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppRouter;
