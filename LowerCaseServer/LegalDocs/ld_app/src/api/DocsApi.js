import axios from "./../services/axios";

const DocsApi = {
  fetchDocForms: async () => {
    return await axios.get(`/api/doc-forms`).then((r) => r.data);
  },

  fetchDocument: async (DOC_ID) => {
    return await axios.get(`/api/document/${DOC_ID}`).then((r) => r.data);
  },
  // 1 po id

  fetchDocuments: async () => {
    return await axios.get("/api/documents").then((r) => r.data);
  },

  fetchDocumentsInfo: async () => {
    return await axios.get("/api/documents/info").then((r) => r.data);
  },

  fetchFilteredDocuments: async (data) => {
    return await axios.post("/api/documents/filtered", data).then((r) => r.data);
  },
// vse 
  fetchCaseDocuments: async (Case_NAME) => {
    return await axios.get(`/api/documents/${Case_NAME}`).then((r) => r.data);
  },

  fetchDocFiles: async (DOC_ID) => {
    return await axios.get(`/api/document/${DOC_ID}/files`).then((r) => r.data);
  },

  fetchDocumentEvents: async (DOC_ID) => {
    return await axios.get(`/api/document/${DOC_ID}/events`).then((r) => r.data);
  },
  // po ceysu

  postDocument: async (docData) => {
    return await axios
      .post("/api/document", docData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putDocument: async (docData) => {
    return await axios
      .put("/api/document", docData)
      .then((r) => r.data)
      .catch((e) => e);
  },
  //poslaj 

  deleteDocument: async (DOC_ID) => {
    return await axios
      .delete(`/api/document/${DOC_ID}`)
      .then((r) => r.data)
      .catch((e) => e);
  },


  fetchAllDocKeywords: async () => {
    return await axios.get(`/api/doc-keywords`).then((r) => r.data);
  },
  fetchDocKeywords: async (DOC_ID) => {
    return await axios.get(`/api/document/${DOC_ID}/keywords`).then((r) => r.data);
  },
  postDocKeywords: async (keywords) => {
    return await axios
      .post("/api/document/keywords", keywords)
      .then((r) => r.data)
      .catch((e) => e);
  },
  deleteDocKeywords: async (data) => {
    return await data.map(async ({DOC_ID, KEYWORDS}) => {
      return await axios
      .delete(`/api/document/${DOC_ID}/keywords/${KEYWORDS}`)
      .then((r) => r.data)
      .catch((e) => e);
    }); 
  },

  postFileLocation: async (data) => {
    return await axios
      .post("/api/file/location", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchLastCheckLocations: async (data) => {
    return await axios
      .get(`/api/last-check-locations/person/${data.Person_id}/computer/${data.Computer_id}`, data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchFilesLocations: async (data) => {
    return await axios
      .get(`/api/documents/locations/computer/${data.Computer_id}`, data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  postCheckLocations: async (data) => {
    return await axios
      .post("/api/last-check-locations/", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  test: async (data) => {
    return await axios
    .get(`/api/documents/test`)
    .then((r) => r.data)
    .catch((e) => e);
  },

};

export default DocsApi;
