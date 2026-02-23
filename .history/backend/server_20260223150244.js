const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const countryLocationRoute = require("./routes/countryLocationRoute");
const StateLocationRoute = require("./routes/stateLocation");
const cityLocationRoute = require("./routes/cityLocationRoute");
const siteRoute = require("./routes/settingRoute");
const bannerRoute = require("./routes/bannerRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
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
app.use("/api/setting", siteRoute)
app.use("/api/banner", bannerRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));