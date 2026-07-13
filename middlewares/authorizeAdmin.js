function authorizeAdmin(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
}

module.exports = {
  authorizeAdmin,
};
