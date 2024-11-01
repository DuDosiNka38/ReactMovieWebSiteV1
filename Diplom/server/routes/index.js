const express = require("express")
const router = express.Router();
const UserRoutes = require("./userRotuter")
const Rooms_Routes = require("./roomsRouter");



router.use('/user', UserRoutes)
router.use('/rooms', Rooms_Routes)




module.exports = router
