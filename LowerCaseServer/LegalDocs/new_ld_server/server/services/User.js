const DataChecker = require("./../services/DataChecker");
const DBManager = require("./../lib/DBManager");
const md5 = require("md5");

const queries = {
  Not_Approved_Computers: "LEFT JOIN (SELECT IFNULL(COUNT(*), 0) as `Not_Approved_Computers`, `Computers`.`Person_id` FROM `Computers` WHERE `Computers`.`Approved_date` IS NULL GROUP BY `Computers`.`Person_id`) as `Computers_Count`  ON `Computers_Count`.`Person_id` = `Personnel`.`Person_id`"
};

const User = {
  getUser: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db
      .select(["Personnel.*", "Computers_Count.Not_Approved_Computers"])
      .from("Personnel")
      .joinRaw(queries.Not_Approved_Computers)
      .where("Personnel.Person_id", where.Person_id)
      .then((r) => (r.length === 1 ? r[0] : null));
  },

  getAllUsers: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select(["Personnel.*","Computers_Count.Not_Approved_Computers"]).from("Personnel").joinRaw(queries.Not_Approved_Computers);
  },

  getUserByHash: async (hostId, hash) => {
    const db = DBManager(hostId);
    const userData = await db
      .select(["Personnel.*","Computers_Count.Not_Approved_Computers"])
      .from("Personnel")
      .joinRaw(queries.Not_Approved_Computers)
      .where("Password", "=", hash)
      .then((r) => (r.length === 1 ? r[0] : null));
    if (userData) {
      return { result: true, data: userData };
    } else {
      return {
        result: false,
        data: {
          error_code: "USER_IS_NOT_EXISTS",
          error_message: "User with recieved Session Token is not exists!",
          error_data: user_auth_hash,
        },
      };
    }
  },

  getUserByAuthHash: async (hostId, user_auth_hash) => {
    const db = DBManager(hostId);

    const userData = await db
      .select(["Personnel.*","Computers_Count.Not_Approved_Computers"])
      .from("Personnel")
      .join("user_auth", "user_auth.user_id", "Personnel.Person_id")
      .joinRaw(queries.Not_Approved_Computers)
      .where({ user_auth_hash })
      .then((r) => (r.length === 1 ? r[0] : null));
    if (userData) {
      return { result: true, data: userData };
    } else {
      return {
        result: false,
        data: {
          error_code: "USER_IS_NOT_EXISTS",
          error_message: "User with recieved Session Token is not exists!",
          error_data: user_auth_hash,
        },
      };
    }
  },

  insertPerson: async (hostId, userData) => {
    try {
      const db = DBManager(hostId);
      return await db("Personnel")
        .insert(userData)
        .then((r) => {
          return { result: true, data: userData };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  insertUser: async (hostId, userData) => {
    try {
      const db = DBManager(hostId);
      return await db("Personnel")
        .insert(userData)
        .then((r) => {
          return { result: true, data: userData };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  updateUser: async (hostId, Person_id, set) => {
    const db = DBManager(hostId);
    return await db("Personnel").update(set).where({ Person_id: Person_id }).then((r) => ({result: true, data: Person_id}));
  },

  deleteUser: async (hostId, Person_id) => {
    const db = DBManager(hostId);
    return await db("Personnel").delete().where({ Person_id: Person_id }).then((r) => ({result: true, data: Person_id}));
  },

  setNewPassword: async (hostId, data) => {
    const db = DBManager(hostId);
    const { Password, Email_address } = data;
    return {
      result: Boolean(
        await db("Personnel")
          .update({ Password: Password })
          .where({ Email_address: Email_address })
          .then((r) => r)
      ),
    };
  },

  //Checkers
  isEmailExists: async (hostId, Email_address) => {
    const db = DBManager(hostId);
    const result = await db.select("Person_id").from("Personnel").where("Email_address", "=", Email_address);
    return result.length === 0 ? false : true;
  },
  isUserHashExists: async (hostId, user_hash) => {
    const db = DBManager(hostId);
    const result = await db.select("Person_id").from("Personnel").where("Password", "=", user_hash);
    return result.length === 0 ? false : true;
  },

  //Generators
  generateUserHash: (data) => {
    let hashStr = "";

    const emailLen = data.user_email.length;
    const passLen = data.user_password.length;

    const blockLen = parseInt((emailLen * passLen) / (emailLen + passLen));

    const emailParts = parseInt(Math.ceil(emailLen / blockLen));
    const passParts = parseInt(Math.ceil(passLen / blockLen));

    const divider = Math.min(emailParts, passParts);

    const emailArr = User._splitStrByBlocks(data.user_email, Math.ceil(emailLen / divider));
    const passArr = User._splitStrByBlocks(data.user_password, Math.ceil(passLen / divider));

    for (let i = 0; i < divider; ++i) {
      hashStr += emailArr[i] + passArr[i];
    }

    return md5(hashStr);
  },
  generateAuthHash: (hash) => {
    return md5(hash + Math.random());
  },

  //Service functions
  _splitStrByBlocks: (str, blockLen) => {
    let strArr = [];

    const numBlocks = Math.ceil(str.length / blockLen);

    for (let i = 0; i < numBlocks; ++i) {
      strArr.push(str.substr(i * blockLen, blockLen));
    }

    return strArr;
  },
};

module.exports = User;
