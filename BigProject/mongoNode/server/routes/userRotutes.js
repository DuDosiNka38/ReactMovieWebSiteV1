const express = require("express")
const router = express.Router();
const UserController = require("../controllers/userController");
const authMid = require("../middleware/authMid");


router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMid ,UserController.auth)


module.exports = router