const express = require("express");
const livreController = require("../controllers/livreController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const { livreCreateSchema, livreUpdateSchema } = require("../validators/livreValidator");

const router = express.Router();

/**
 * @swagger
 * /api/livres:
 *   get:
 *     summary: Lister tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres
 *
 *   post:
 *     summary: Créer un livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Livre créé
 *       401:
 *         description: Non authentifié
 */
router.get("/", livreController.index);
router.post("/", authenticate, validate(livreCreateSchema), livreController.create);

/**
 * @swagger
 * /api/livres/{id}:
 *   get:
 *     summary: Récupérer un livre par id
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre trouvé
 *       404:
 *         description: Livre introuvable
 *
 *   put:
 *     summary: Modifier un livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre modifié
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Livre introuvable
 *
 *   delete:
 *     summary: Supprimer un livre (admin)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Livre introuvable
 */
router.get("/:id", livreController.show);
router.put("/:id", authenticate, validate(livreUpdateSchema), livreController.update);
router.delete("/:id", authenticate, authorize("admin"), livreController.destroy);

router.post("/:id/emprunter", authenticate, livreController.emprunter);
router.post("/:id/retourner", authenticate, livreController.retourner);

module.exports = router;
