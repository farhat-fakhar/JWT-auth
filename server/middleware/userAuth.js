import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // safer token access: either cookie or Authorization header (Bearer ...)
    const tokenFromCookie = req.cookies ? req.cookies.token : undefined;
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token!" });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    // optional: console.error("Auth error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export default userAuth;
