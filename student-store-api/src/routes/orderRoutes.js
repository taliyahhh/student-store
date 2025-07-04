const express = require("express");
const router = express.Router();
const controller = require("../models/order.js");

// import CORS middleware
app = express();
const cors = require("cors");
app.use(cors());

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/total", controller.calculate);
router.post("/", controller.create);
router.post("/:id/items", controller.createItem);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
