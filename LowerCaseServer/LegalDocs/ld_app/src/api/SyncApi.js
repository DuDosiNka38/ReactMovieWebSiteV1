import axios from "./../services/axios";

const SyncApi = {
  fetchSyncShare: async (Person_id) => {
      return await axios.get(`/api/sync/share/${Person_id}`).then((r) => (r.data));
  },
  insertSyncSharePersons: async (persons) => {
    return await axios
      .post(`/api/sync/share/persons`, persons)
      .then((r) => r.data)
      .catch((e) => e);
  },
  deleteSyncSharePerson: async (Share_to_Person_id) => {
    return await axios
      .delete(`/api/sync/share/person/${Share_to_Person_id}`)
      .then((r) => r.data)
      .catch((e) => e);
  },


  fetchSyncSharedPersons: async (Person_id) => {
    return await axios.get(`/api/sync/shared-persons/${Person_id}`).then((r) => (r.data));
  },

  fetchParsingSteps: async () => {
    return await axios.get(`/api/parsing-steps`).then((r) => (r.data));
  },

  fetchSyncSchedule: async (Person_id) => {
    return await axios.get(`/api/sync/schedule/${Person_id}`).then((r) => (r.data));
  },

  insertSyncSchedule: async (data) => {
    return await axios
      .post(`/api/sync/schedule`, data)
      .then((r) => r.data)
      .catch((e) => e);
  },
  deleteSyncSchedule: async (Row_id) => {
    return await axios
      .delete(`/api/sync/schedule/${Row_id}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchSyncedFiles: async (Person_id) => {
    return await axios.get(`/api/sync/files/user/${Person_id}`).then((r) => (r.data));
  },
  fetchSyncedFiles: async (Person_id, Computer_id) => {
    return await axios.get(`/api/sync/files/user/${Person_id}/computer/${Computer_id}`).then((r) => (r.data));
  },
  fetchSyncedFiles: async (Person_id, Computer_id, {locations} = {locations: false}) => {
    return await axios.get(`/api/sync/files/user/${Person_id}/computer/${Computer_id}${locations ? '/locations' : ''}`).then((r) => (r.data));
  },

  fetchFilteredParsedFiles: async (Person_id, data) => {
    return await axios.post(`/api/sync/files/user/${Person_id}/filtered`, data).then((r) => r.data);
  },

  putParsedFiles: async (data) => {
    return await axios
      .put("/api/sync/files", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  saveSyncedFiles: async(data) => {
    return await axios
      .post("/api/sync/files/save", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  removeSyncedFiles: async(data) => {
    return await axios
      .post("/api/sync/files/remove", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteSyncFile: async({File_id, Person_id, Computer_id}) => {
    return await axios
      .delete(`/api/sync/file/${File_id}/user/${Person_id}/computer/${Computer_id}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  // insertSyncSchedule: async (data) => {
  //   return await axios
  //     .post(`/api/sync/schedule`, data)
  //     .then((r) => r.data)
  //     .catch((e) => e);
  // },
  // deleteSyncSchedule: async (Row_id) => {
  //   return await axios
  //     .delete(`/api/sync/schedule/${Row_id}`)
  //     .then((r) => r.data)
  //     .catch((e) => e);
  // },
  

  fetchUserSynchronizations: async (Person_id) => {
    return await axios.get(`/api/synchronizations/user/${Person_id}`).then((r) => r.data);
  },
  fetchUserSyncFolders: async (Person_id, Computer_id) => {
    return await axios.get(`/api/sync/folders/user/${Person_id}/computer/${Computer_id}`).then((r) => r.data);
  },
  fetchUserParseInfo: async (Person_id) => {
    return await axios.get(`/api/sync/parse-info/user/${Person_id}`).then((r) => r.data);
  },
  fetchFileParseInfo: async () => {
    return await axios.get(`/api/sync/file-parse-info`).then((r) => r.data);
  },

  
};

export default SyncApi;