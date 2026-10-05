import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "viewroom_jwt_secret_key";

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user payload ({ id, email, role, name }) to req.user.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please provide a valid Bearer token.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Invalid token.",
    });
  }
};

/**
 * Middleware to enforce role-based access control (RBAC).
 * Must be used after verifyToken.
 * Usage: requireRole("ADMIN") or requireRole("ADMIN", "CREATOR")
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    const userRole = (req.user.role || "").toUpperCase();
    const hasRole = allowedRoles.some((role) => role.toUpperCase() === userRole);

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of the following roles: [${allowedRoles.join(", ")}]. Current role: ${userRole || "NONE"}.`,
      });
    }

    next();
  };
};
