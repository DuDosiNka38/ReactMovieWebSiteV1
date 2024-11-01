const {Rooms, Message, User} = require("../models/models")
const ApiError = require("../error/ApiError")


class RoomsController{

  async create(req, res) {
    try {
      let { title, description, members } = req.body;
  
      console.log(title, description, members);
  
      // Создаем новую комнату
      const room = await Rooms.create({
        title: title,
        description: description,
        Date_of_creation: Date.now(),
        members: [],
        room: []
      });
  
      console.log("Room created:", room);
  
      if (members) {
        let membersArray = JSON.parse(members);
        const users = await User.find({ _id: { $in: membersArray.map(member => member._id) }});
        const userIds = users.map(user => user._id);
        console.log("User IDs:", userIds);
  
      
        await Rooms.updateOne(
          { _id: room._id },
          { $push: { members: { $each: userIds } } }
        );
  
        for (const member of membersArray) {
          await User.updateOne(
            { _id: member._id },
            { $push: { rooms: room._id } }
          );
        }
      }
  
      return res.json(room);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

    async getAll(req, res) {
        let  rooms = await Rooms.find();
        console.log(rooms)
        return res.json(rooms);
    }


    
    async getOne(req, res){
      const {id} = req.params
      
     try { 
      console.log(req.params)
       const oneRoom = await Rooms.findById(id).populate('message').populate('members');
       console.log(oneRoom);
       return res.json(oneRoom);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }



    }



    

    async postMessange(req, res){
     
 
        const {message ,id_user } = req.body
   
       try { 

        let {id} = req.params;
       
         const lrt = await Message.create({
            message: message,
            user_id: id_user,
            Date_of_creation: Date.now()
          });
         
         let dev = await Rooms.updateOne(
            { _id: id },
            { $addToSet: { message: lrt._id } }
          );

     
        
        
      
  
       return res.status(200).json(lrt)

        
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        
      }
  







      

    
    }
    
    module.exports = new  RoomsController()