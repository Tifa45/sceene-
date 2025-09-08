import JWT from "jsonwebtoken";

export const handleGenerateToken = async (
  payload,
  accessSecret,
  refreshSecret,
  res
) => {
  try {
    const accessToken = JWT.sign(payload, accessSecret, {
      subject: "access-token",
      expiresIn: "10s",
    });
    const refreshToken = JWT.sign(payload, refreshSecret, {
      subject: "refresh-token",
      expiresIn: "1d",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return accessToken;
  } catch (error) {
    console.log("GENERATING TOKEN ERROR: ", error);
    throw new Error("Something went wrong while tryin to genetate tokens!");
  }
};
