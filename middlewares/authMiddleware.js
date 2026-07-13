const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token Format",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
}
module.exports = {
  verifyToken,
};
