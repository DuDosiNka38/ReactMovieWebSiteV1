const DBManager = require("./../lib/DBManager");

const Departments = {
  getDepartments: async (hostId) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Departments");
  },
  insertDepartment: async (hostId, department) => {
      const db = DBManager(hostId);
      return await db("Departments").insert(department).then(async (r) => {
        return await db.select("*").from("Departments").where("Department_id", department.Department_id).then((res) => res.length ? res[0] : null );
      });
  },
  updateDepartment: async (hostId, Department_id, department) => {
      const db = DBManager(hostId);
      return await db("Departments").update(department).where({Department_id: Department_id}).then(async (r) => {
        return await db.select("*").from("Departments").where("Department_id", department.Department_id).then((res) => res.length ? res[0] : null );
      });
  },
  deleteDepartment: async (hostId, Department_id) => {
      const db = DBManager(hostId);
      return await db("Departments").delete().where({Department_id: Department_id}).then((r) => ({result: Boolean(r), data: Department_id}));
  },
};

module.exports = Departments;