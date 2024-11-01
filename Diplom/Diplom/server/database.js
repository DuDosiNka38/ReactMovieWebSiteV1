const mongoose = require('mongoose');
require('dotenv').config();


 async function start(){
    console.log("Started")
await mongoose.
connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterforproject.gbydfg8.mongodb.net/?retryWrites=true&w=majority`)
.then(()=> console.log("Were are connecting to MOngoDB"))
.catch((e) => console.log(e))


}



module.exports = start;
