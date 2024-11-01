const {Device, Discription} = require("../models/models")
const ApiError = require("../error/ApiError")
const uuid = require('uuid')
const path = require('path')
const { title } = require("process")

class DeviceController{

  async create(req, res) {
    try {
      let { name, price, discount, typeId, brandId, info } = req.body;
  
      const { img } = req.files;
      let filename = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "staticFoto", filename));
      console.log(1);
  
      const device = await Device.create({
        name: name,
        price: price,
        discountPrecentage: discount,
        img: filename,
        typeId: typeId,
        brandId: brandId,
        discription: []
      });
      console.log(2);
  
      let dev;
      if (info) {
        info = JSON.parse(info);
        for (const i of info) {
          const discription = await Discription.create({
            title: i.title,
            discription: i.discription
          });
          console.log(3);
          console.log(discription);
  
          dev = await Device.updateOne(
            { _id: device._id },
            { $addToSet: { discription: discription._id } }
          );
          console.log(4);
          console.log(dev);
        }
      }
  
      console.log(5);
      console.log(device);
      return res.json(device);
    } catch (err) {
      console.error(err);
      return ApiError.Badreqest("Ваш Device не сохранен");
    }
  }



    async getAll(req, res) {
       const {brandId, typeId, limit, page} = req.query
        let currentPage = page ? parseInt(page) : 1;
        let currentLimit = limit ? parseInt(limit) : 10;
        let offset = (currentPage - 1) * currentLimit;
       let devices;
       let totalCount;
       if(!brandId && !typeId){
           devices = await Device.find().limit(currentLimit).skip(offset).sort('-createdOn' )
           totalCount =  await Device.countDocuments();
       }
       if(brandId && !typeId){
           devices = await Device.find({brandId: brandId}).limit(currentLimit).skip(offset).sort('-createdOn' )
           totalCount =  await Device.countDocuments({brandId: brandId});
      }

      if(!brandId && typeId){
          devices = await Device.find({typeId: typeId}).limit(currentLimit).skip(offset).sort('-createdOn' )
          totalCount =  await Device.countDocuments({typeId: typeId});

      }
      if(brandId && typeId){
          devices = await Device.find({typeId: typeId,brandId: brandId}).limit(currentLimit).skip(offset).sort('-createdOn' )
          totalCount =  await Device.countDocuments({typeId: typeId,brandId: brandId});

      }


        return res.json({ devices, totalCount });

    }

    
    
    async getOne(req, res){
      const {id} = req.params
      
     try { 
      console.log(req.params)
       const oneDevice = await Device.findById(id).populate('discription');
      console.log("EEEEEEEE")
       console.log(oneDevice);
       return res.json(oneDevice);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }



    }
    
    }
    
    module.exports = new DeviceController()