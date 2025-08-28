import JWT from "jsonwebtoken";
import User from "../db/schemas/user-schema.js";
export const checkingAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token must be provided!" });
  }
  try {
    const validToken = JWT.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    const userRole = await User.findById(validToken.id, "role").lean();

    req.user = { userId: validToken.id, userRole: userRole.role };
    next();
  } catch (error) {
    console.log("CHECKING AUTH ERROR: ", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Expired token!" });
    }
    return res.status(401).json({ message: "Invalid token!" });
  }
};
export const checkingRole = (allowedRoles = []) => {
  return async function checkAllowedRole(req, res, next) {
    const { userRole } = req.user;
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to do this!" });
    }
    next();
  };
};

export const checkingRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token must be provided!" });
  }
  try {
    const validToken = JWT.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const userRole = await User.findById(validToken.id, "role").lean();
    req.user = { userId: validToken.id, userRole: userRole.role };
    next();
  } catch (error) {
    console.log("CHECKING REFRESH ERROR: ", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Expired token!" });
    }
    return res.status(401).json({ message: "Invalid token!" });
  }
};


