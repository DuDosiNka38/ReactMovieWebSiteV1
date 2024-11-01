const DataChecker = require("./../services/DataChecker");
const DBManager = require("./../lib/DBManager");
const md5 = require("md5");
const IO = require("./../lib/Socket");


const Computer = {
    getComputer: async (hostId, computer) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Computers").where(computer).then((r) => (r));
    },

    getComputers: async (hostId) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Computers");
    },
    getUserComputers: async (hostId, params) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Computers").where(params);
    }, 

    insertComputer: async (hostId, computer) => {
        const db = DBManager(hostId);
        computer.Computer_id = computer.Computer_user;
        return await db("Computers").insert(computer).then(async (r) => {
          const compData = await db.select("*").from("Computers").where(computer).then((cp) => cp.length > 0 ? cp[0] : null);
          IO.emit("new-computer-request", compData);
          return (r);
        });
    },  

    updateComputer: async (hostId, compData, where) => {
      const db = DBManager(hostId);
      return await db("Computers").update(compData).where(where).then((r) => ({result:true, data: {...where, ...compData}})).catch((e) => ({result: false, data: {error_code: e.code, error_message: e.mesage || e.sqlMessage, error_data: {...where, ...compData}}}));
    },
    deleteComputer: async (hostId, where) => {
      const db = DBManager(hostId);
      return await db("Computers").delete().where(where).then((r) => ({result: true, data: where}));
    },

    checkComputer: async (hostId, computer) => {
        const computerInfo = await Computer.getComputer(hostId, computer);

        const response = {
            result: null,
            data: {}
        };

        const errorData = {
            error_code: "NOT_APPROVED_COMPUTER",
            error_message: "Your computer is not approved by administrator yet. Contact with him!"
        };
        
        //Add computer to DB
        if(computerInfo.length === 0){
            response.result = false;
            response.data = errorData;
            await Computer.insertComputer(hostId, computer);
        } else if(computerInfo[0].Approved_date === null){
            response.result = false;
            response.data = errorData;
        } else {
            response.result = true;
        }

        return response;
    },

}

module.exports = Computer;