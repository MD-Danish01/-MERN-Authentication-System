import buildCookieOptions from "../lib/cookieOptions.js";

const logout = (req, res) => {
  const cookieOptions = buildCookieOptions();
  res.clearCookie("AccessToken", cookieOptions);
  res.clearCookie("RefreshToken", cookieOptions);
  res.status(200).send("Logged out successfully");
};

export default logout;
