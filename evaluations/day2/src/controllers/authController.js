const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
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

module.exports = {
  register,
  login,
  me
};
