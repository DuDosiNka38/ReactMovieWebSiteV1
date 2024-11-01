const express = require("express")
const router = express.Router();
const DeviceRoutes = require("./deviceRouter")
const UserRoutes = require("./userRotutes")
const BrandRoutes = require("./brandRouter")
const TypeRoutes = require("./typeRouter")



router.use('/user', UserRoutes)
router.use('/device', DeviceRoutes)
router.use('/brand', BrandRoutes)
router.use('/type', TypeRoutes)



module.exports = router
