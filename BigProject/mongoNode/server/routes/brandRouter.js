const express = require("express")
const router = express.Router();
const brandController = require("../controllers/brandController");



router.post('/', brandController.create)
router.get('/', brandController.getAll)



module.exports = router