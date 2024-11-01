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
      },
      rooms: [{ type: mongoose.Types.ObjectId, ref: "Rooms" }]

})



const RoomsShema = mongoose.Schema({

    title: {
    type: String,
    require: true
    
},

discription: {
    type:String,
    require: false,
  },


members:  [{ type: mongoose.Types.ObjectId, ref: "User"}],
  
message: [{type: mongoose.Types.ObjectId, ref: "Message" }],

Date_of_creation: {
    type : Date,
    require: true
}


})


const MessageShema = mongoose.Schema({
message: {
    type: String,
    require: true
},

user_id :{ type: mongoose.Types.ObjectId, ref: "User" },


Date_of_creation: {
    type : Date,
    require: true
}


})


const User = mongoose.model("User", UserShema)
const Rooms = mongoose.model("Rooms", RoomsShema)
const Message = mongoose.model("Message", MessageShema)




User.createCollection();
Rooms.createCollection();
Message.createCollection();



module.exports = {
  User,
  Rooms,
  Message
};
  

