const jwt = require("jsonwebtoken");



module.exports = (roles = []) => {
  return (req, res, next) => {
    try {

      console.log("hii");
      

      console.log(req.headers);
      
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

      const token = authHeader.split(" ")[1];

      console.log(token);

      console.log("VERIFY SECRET:", process.env.JWT_SECRET);
      

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
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