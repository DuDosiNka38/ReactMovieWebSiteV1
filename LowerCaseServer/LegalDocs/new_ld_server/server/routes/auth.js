const express = require("express");
const Auth = require("./../route-actions/Auth");
const DBManager = require("./../lib/DBManager");

const authRouter = express.Router();
const jsonParser = express.json();

let dbConn = null;

//DB Connection
authRouter.use(async (req, res, next) => {
  try {
    dbConn = DBManager(req.hostId);
    //check connection
    await dbConn
      .raw("SELECT VERSION()")
      .catch((err) => {
        console.log(err);
        throw err;
      });
    next();
  } catch (e) {
    res.send({
      result: false,
      data: {
        error_code: e.code,
        error_message: e.message || e.sqlMessage,
        error_data: req.hostId,
      },
    });
  }
});

// authRouter.post("/signup", jsonParser, async (req, res) => {
//     const auth = new Auth(req.hostId);

//   res.send(await Auth.signup(req.body));
// });

authRouter.post("/signin", jsonParser, Auth.signin);

// authRouter.post("/check-hash", jsonParser, async (req, res) => {
//   res.send(await Auth.isValidHash(req.body));
// });

module.exports = authRouter;
