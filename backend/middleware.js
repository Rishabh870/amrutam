const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const rawToken = req.headers.authorization;
  const token = rawToken.replace(/^Bearer\s+/, "");

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, "gfbjhfuyhfefuie", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = { verifyToken };
