const livreService = require("../services/livreService");

async function index(req, res, next) {
  try {
    const livres = await livreService.findAll();
    return res.status(200).json(livres);
  } catch (error) {
    next(error);
  }
}

async function show(req, res, next) {
  try {
    const livre = await livreService.findById(req.params.id);
    return res.status(200).json(livre);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const livre = await livreService.create(req.body);
    return res.status(201).json(livre);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const livre = await livreService.update(req.params.id, req.body);
    return res.status(200).json(livre);
  } catch (error) {
    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    const result = await livreService.remove(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function emprunter(req, res, next) {
  try {
    const result = await livreService.emprunter(req.params.id, req.user.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function retourner(req, res, next) {
  try {
    const result = await livreService.retourner(req.params.id, req.user.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  emprunter,
  retourner
};
