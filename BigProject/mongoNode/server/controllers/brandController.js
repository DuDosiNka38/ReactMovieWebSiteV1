const ApiError = require("../error/ApiError");
const { Brand } = require("../models/models");



class BrandController{

    async create(req, res) {
        const {name, price} = req.body

        const brand = await Brand.create({name: name})
        try{brand.save()}catch(err){
            console.log(err)
             return ApiError.Badreqest("Ваш Брэнд не сохранен")
            }
         
         return res.json(brand)

    }
    
    async getAll(req, res) {
        const brands = await Brand.find()

        return res.json(brands)
    }
    
    
    
    
    
    }
    
    module.exports = new BrandController()