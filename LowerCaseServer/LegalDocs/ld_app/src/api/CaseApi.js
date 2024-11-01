import axios from "./../services/axios";

const CaseApi = {
  fetchCasesByPersonId: async (Person_id) => {
    return await axios.get(`/api/cases/user/${Person_id}`).then((r) => r.data);
  },

  fetchUserCases: async () => {
    return await axios.get("/api/cases/user").then((r) => r.data);
  },

  fetchAllCases: async () => {
    return await axios.get("/api/cases/all").then((r) => r.data);
  },

  fetchSingleCase: async (Case_Short_NAME) => {
    return await axios.get(`/api/case/${Case_Short_NAME}`).then((r) => r.data);
  },

  fetchCaseTypes: async () => {
    return await axios.get("/api/case-types").then((r) => r.data);
  },

  fetchCaseRoles: async () => {
    return await axios.get("/api/case-roles").then((r) => r.data);
  },

  fetchCaseSides: async () => {
    return await axios.get("/api/case-sides").then((r) => r.data);
  },

  fetchDepartments: async () => {
    return await axios.get("/api/departments").then((r) => r.data);
  },

  fetchCaseParticipants: async (Case_Short_NAME) => {
    return await axios.get(`/api/case/case-participants/${Case_Short_NAME}`).then((r) => r.data);
  },

  fetchCaseLog: async (Case_Short_NAME) => {
    return await axios.get(`/api/case/${Case_Short_NAME}/log`).then((r) => r.data);
  },

  postDepartment: async (depData) => {
    return await axios
    .post("/api/department", depData)
    .then((r) => r.data)
    .catch((e) => e);
  },

  putDepartment: async (Department_id, depData) => {
    return await axios
    .put(`/api/department/${Department_id}`, depData)
    .then((r) => r.data)
    .catch((e) => e);
  },

  deleteDepartment: async (Department_id) => {
    return await axios
    .delete(`/api/department/${Department_id}`)
    .then((r) => r.data)
    .catch((e) => e);
  },

  postCase: async (caseData) => {
    return await axios
      .post("/api/case", caseData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putCase: async (Case_Short_NAME, caseData) => {
    return await axios
      .put(`/api/case/${Case_Short_NAME}`, caseData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteCase: async (Case_Short_NAME) => {
    return await axios
      .delete(`/api/case/${Case_Short_NAME}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  postCaseParticipant: async (caseParticipant) => {
    return await axios
      .post("/api/case/case-participant", caseParticipant)
      .then((r) => r.data)
      .catch((e) => e);
  },

  postCaseParticipants: async (caseParticipants) => {
    return await axios
      .post("/api/case/case-participants", caseParticipants)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteCaseParticipant: async ({Person_id, Case_NAME}) => {
    return await axios
      .delete(`/api/case/${Case_NAME}/case-participant/${Person_id}`)
      .then((r) => r.data)
      .catch((e) => e);
  },
};

export default CaseApi;
