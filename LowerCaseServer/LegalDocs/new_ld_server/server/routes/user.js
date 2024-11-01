const express = require("express"); 

const Functions = require("./../lib/Functions");
const { getAllUsers, getUserByAuthHash, getUserById, setNewPassword, getUser, insertUser, insertPerson, deleteUser, updateUser } = require("./../route-actions/User");

const userRouter = express.Router();
const jsonParser = express.json();

//Non Auth Listeners

userRouter.get("/user/:field/:value", getUser);
userRouter.post("/user/new-password", jsonParser, setNewPassword);
userRouter.get("/user/:Person_id", getUserById);

//Auth Listeners
userRouter.use(Functions.isValidSession);

userRouter.get("/user", getUserByAuthHash);
userRouter.post("/user", jsonParser, insertUser);
userRouter.put("/user/:Person_id", jsonParser, updateUser);
// userRouter.put("/person/:Person_id", jsonParser, insertUser);
userRouter.delete("/user/:Person_id", deleteUser);

userRouter.get("/users", getAllUsers);

userRouter.post("/person", jsonParser, insertPerson);


module.exports = userRouter;