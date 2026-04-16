const buildCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: "/account",
  };
};

export default buildCookieOptions;
