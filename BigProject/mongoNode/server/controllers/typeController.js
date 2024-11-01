const {Type} = require("../models/models")
const ApiError = require("../error/ApiError")



class TypeController{

    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name: name});
        
        try{type.save()}catch(err){
            console.log(err)
             return ApiError.Badreqest("Ваш Брэнд не сохранен")
            }
        
         
         return res.json(type)

    }
    
    async getAll(req, res) {
     const types = await Type.find()

     return res.json(types)


    }
    
    
    
    
    
    }
    
    module.exports = new TypeController()