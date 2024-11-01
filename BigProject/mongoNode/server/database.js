const mongoose = require('mongoose');
require('dotenv').config();


 async function start(){
await mongoose.
connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.4eeblwp.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`)
.then(()=> console.log("Were are connecting to MOngoDB"))
.catch((e) => console.log(e))


}



module.exports = start;
