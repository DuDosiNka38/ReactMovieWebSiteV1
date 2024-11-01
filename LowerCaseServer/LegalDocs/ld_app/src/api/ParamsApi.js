import axios from "../services/axios";

const ParamsApi = {
  fetchUserParams: async (Person_id) => {
    return await axios.get(`/api/parameters/user/${Person_id}`).then((r) => r.data);
  },

  fetchUserParam: async (Person_id, Parameter_name) => {
    return await axios.get(`/api/parameter/${Parameter_name}/user/${Person_id}`).then((r) => r.data.length ? r.data[0] : null );
  },

  postUserParam: async (data = {Parameter_name:String, Person_id:String, Value:String}) => {
    return await axios.post("/api/parameter", data);
  },

  putUserParam: async (data = {Parameter_name:String, Person_id:String, Value:String}) => {
    return await axios.put("/api/parameter", data);
  }

};

export default ParamsApi;
