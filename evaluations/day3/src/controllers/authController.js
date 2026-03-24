const authService = require("../services/authService");
const config = require("../config/env");

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    return res.status(201).json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.userId);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.cookies.refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const result = await authService.logout(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me,
  refresh,
  logout
};
