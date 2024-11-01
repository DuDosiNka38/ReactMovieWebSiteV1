const mongoose = require('mongoose');

const UserShema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
   email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
      },
      password: {
        type: String,
        require: true
      },
      role:{
        type: String,
        require: true,
        default: "USER"
      }

})



const DeviceShema = mongoose.Schema({
  name: {
    type: String,
    require: true
    
},
price: {
    type:String,
    require: true,
  },
  discountPrecentage: {
    type: String,
    require: true,
    default: "0"

  },
  img:{
    type: String,
    require: true,
  },
  typeId:{
   type: mongoose.Schema.Types.ObjectId,
   ref: "Type"
  },
  brandId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand"
   },
   discription: [{ type: mongoose.Types.ObjectId, ref: "Discription" }]
   

})


const DiscriptionShema = mongoose.Schema({
title:{
  type:String,
  require:true
},
 
discription:{
  type:String,
  require:true
}
})

const TypeShema = mongoose.Schema({
name:{
  type: String,
  require: true
}
})

const BrandShema = mongoose.Schema({

  name:{
    type: String,
    require: true
  }
  })



const User = mongoose.model("User", UserShema)
const Device = mongoose.model("Device", DeviceShema)
const Discription = mongoose.model("Discription", DiscriptionShema)
const Type = mongoose.model("Type", TypeShema)
const Brand = mongoose.model("Brand", BrandShema)



User.createCollection();
Device.createCollection();
Discription.createCollection();
Type.createCollection();
Brand.createCollection();


module.exports = {
  User,
  Device,
  Discription,
  Type,
  Brand
};
  

