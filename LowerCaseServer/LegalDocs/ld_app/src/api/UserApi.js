import axios from "./../services/axios";

const UserApi = {
  fetchUser: async () => {
      return await axios.get("/api/user").then((r) => (r.data));
  },
  fetchSinglePerson: async (Person_id) => {
      return await axios.get(`/api/user/${Person_id}`).then((r) => (r.data));
  },

  fetchAllPersons: async () => {
      return await axios.get(`/api/users`).then((r) => (r.data));
  },

  fetchRoles: async () => {
    return await axios.get(`/api/user-roles`).then((r) => (r.data));
  },

  postPerson: async (personData) => {
    return await axios
      .post("/api/person", personData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  postUser: async (personData) => {
    return await axios
      .post("/api/user", personData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putUser: async (Person_id, personData) => {
    return await axios
      .put(`/api/user/${Person_id}`, personData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteUser: async (Person_id) => {
    return await axios
      .delete(`/api/user/${Person_id}`)
      .then((r) => r.data)
      .catch((e) => e);
  }
  
};

export default UserApi;