const DataChecker = require("../services/DataChecker");
const UserService = require("./../services/User");

const User = {
  getUser: async (req, res) => {
    const result = await UserService.getUser(req.hostId, { [req.params.field]: req.params.value });
    res.send(result);
  },
  getAllUsers: async (req, res) => {
    const result = await UserService.getAllUsers(req.hostId);
    res.send(result);
  },
  getUserByAuthHash: async (req, res) => {
    const result = await UserService.getUserByAuthHash(req.hostId, req.headers.user_auth_hash);
    res.send(result);
  },
  getUserById: async (req, res) => {
    const result = await UserService.getUser(req.hostId, req.params);
    res.send(result);
  },

  insertUser: async (req, res) => {
    req.body.Password = UserService.generateUserHash({user_email: req.body.Email_address, user_password: req.body.Password});
    const result = await UserService.insertUser(req.hostId, req.body);
    res.send(result);
  },

  insertPerson: async (req, res) => {
    const result = await UserService.insertPerson(req.hostId, req.body);
    res.send(result);
  },

  setNewPassword: async (req, res) => {
    req.body.Password = UserService.generateUserHash({user_email: req.body.Email_address, user_password: req.body.Password});
    const result = await UserService.setNewPassword(req.hostId, req.body);
    res.send(result);
  },

  updateUser: async (req, res) => {
    const result = await UserService.updateUser(req.hostId, req.params.Person_id, req.body);
    res.send(result);
  },

  updatePerson: async (req, res) => {
    
  },

  deleteUser: async (req, res) => {
    const result = await UserService.deleteUser(req.hostId, req.params.Person_id);
    res.send(result);
  }
};

module.exports = User;
