const jwt = require("jsonwebtoken")

module.exports = function(req, res, next){

    if (req.method === "OPTIONS") {
        next()
    }
    try {
        console.log(req.headers.authorithation)
        const token = req.headers.authorithation.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token) {
            return res.status(401).json({message: "Not authorized"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: e.message})
    }


}