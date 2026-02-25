const jwt = require("jsonwebtoken");



module.exports = (roles = []) => {
  return (req, res, next) => {
    try {

      console.log(req.headers);
      
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secretkey123"
      );

      // ⭐ role check
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: "Access denied" });

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};