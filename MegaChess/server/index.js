import express from 'express'
import cors from 'cors'
import events from 'events'
const PORT = 5000

const server = express()
const emitter = new events.EventEmitter();
server.use(cors())
server.use(express.json())

server.get('/new-messenge-get', ((req , res) => {

    console.log("Sending Server")
   emitter.once('NewMessenge', (messange) =>  res.json(messange),  res.status(200))
})
)


server.post('/new', ((req, res) => {

    const messange = req.body;
    console.log("Got a messange ")
    console.log(messange)
    emitter.emit( 'NewMessenge', messange)
    res.status(200)
 
}))

server.listen(PORT, () => console.log("SERVER Work on " + PORT))
console.log("Working.... ")