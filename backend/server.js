const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
// const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const countryLocationRoute = require("./routes/countryLocationRoute");
const StateLocationRoute = require("./routes/stateLocation");
const cityLocationRoute = require("./routes/cityLocationRoute");
const siteRoute = require("./routes/settingRoute");
const bannerRoute = require("./routes/bannerRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productItemRoutes = require("./routes/productItemRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const cmsRoute = require("./routes/cmsRoute");
const roleRoutes = require("./routes/role");
const faqCategoryRoutes = require("./routes/faqCategoryRoutes");
const manageFaqRoutes = require("./routes/manageFaqRoutes");
const newsRoutes = require("./routes/newsRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const blogRoutes = require("./routes/blogRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/countrylocation", countryLocationRoute);
app.use("/api/statelocation", StateLocationRoute);
app.use("/api/citylocation", cityLocationRoute);
app.use("/api/setting", siteRoute);
app.use("/api/banner", bannerRoute);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/product-item", productItemRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/cms", cmsRoute);
app.use("/api/role", roleRoutes);
app.use("/api/faq-category", faqCategoryRoutes);
app.use("/api/manage-faq", manageFaqRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
