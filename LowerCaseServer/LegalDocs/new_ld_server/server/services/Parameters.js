const DBManager = require("./../lib/DBManager");

const Parameters = {
  getAllUserParameters: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Param_values").where(where);
  },

  getUserParameter: async (hostId, where) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Param_values").where(where);
  },

  inserUserParameter: async (hostId, parameter) => {
    const db = DBManager(hostId);
    return await db("Param_values")
      .insert(parameter)
      .then((r) => ({result: true, parameter}));
  },

  updateUserParameter: async (hostId, parameter) => {
      const db = DBManager(hostId);
      return await db("Param_values")
        .update({Value: parameter.Value})
        .where({Parameter_name: parameter.Parameter_name, Person_id: parameter.Person_id })
        .then(async (r) => ({result:true, parameter}));
  },
  
  // deleteDepartment: async (hostId, Department_id) => {
  //     const db = DBManager(hostId);
  //     return await db("Departments").delete().where({Department_id: Department_id}).then((r) => ({result: Boolean(r), data: Department_id}));
  // },
};

module.exports = Parameters;
