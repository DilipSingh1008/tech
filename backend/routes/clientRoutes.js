const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientcontroller");

router.post("/", clientController.addClient);
router.get("/", clientController.getClients);
router.patch("/toggle-status/:id", clientController.toggleClientStatus);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;
