
require('dotenv').config();
const ApiError = require("../error/ApiError")
const {User} = require("../models/models")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")


const generateJWT = (id, email, role) => {
    const token = jsonwebtoken.sign({id: id,email: email,role: role}, process.env.SECRET_KEY, {expiresIn: "24h"})
 return token

}

class UserController{




async registration(req, res, next) {
   const {name, email, password, role} = req.body
    if(!name || !email || !password){
        return next(ApiError.Badreqest("Вы ввели неправельно данные"))
    }

    const candidate = await User.find({email: email})
    if(candidate.length > 0){
        return next(ApiError.Badreqest("Этот пользователь уже есть"))
    }

   const HashPassword = await bcrypt.hash(password, 5)
   const user = await User.create({name: name, email: email, password: HashPassword, role: role})
   user.save()
   const token = generateJWT(user._id, user.email, user.role)
   console.log("Фхуеть работает")
    return res.json(token)

}




async login(req, res, next) {
const {email, password} = req.body
 
  const candidate = await User.findOne({email: email})
  if (!candidate) {
    return next(ApiError.Badreqest("Неправельный логин или пароль"))
}
 console.log(candidate.password)
 let comparePassword =  bcrypt.compareSync(password, candidate.password)
 console.log(2)
 if(!comparePassword){
    return next(ApiError.Badreqest("Неправельный логин или пароль"))
 }

 const token = generateJWT(candidate._id, candidate.email, candidate.role)

return res.json(token)

}




async auth(req, res) {

const token = generateJWT(req.user.id,req.user.email,req.user.role)
return res.json(token)


    }







}

module.exports = new UserController()