import axios from "../services/axios";

const ComputersApi = {
  fetchComputers: async () => {
    return await axios.get("/api/computers").then((r) => r.data);
  },
  fetchUserComputers: async (Person_id) => {
    return await axios.get(`/api/computers/${Person_id}`).then((r) => r.data);
  },

  postComputer: async (compData) => {
    return await axios
    .post("/api/computer", compData)
    .then((r) => r.data)
    .catch((e) => e);
  },

  putComputer: async (Person_id, Mac_Address, compData) => {
    return await axios
    .put(`/api/computer/${Person_id}/${Mac_Address}`, compData)
    .then((r) => r.data)
    .catch((e) => e);
  },

  deleteComputer: async (Person_id, Mac_Address) => {
    return await axios
    .delete(`/api/computer/${Person_id}/${Mac_Address}`)
    .then((r) => r.data)
    .catch((e) => e);
  }

};

export default ComputersApi;
