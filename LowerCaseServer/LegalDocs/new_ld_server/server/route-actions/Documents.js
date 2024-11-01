const DataChecker = require("../services/DataChecker");
const DocumentsService = require("../services/Documents");

const Documents = {

  getFilesHashes: async (req, res) => {        
    const FilesHashes = await DocumentsService.getFilesHashes(req.hostId);
    res.send(FilesHashes);
  },

  getDocument: async (req, res) => {        
    const Documents = await DocumentsService.getDocument(req.hostId, req.params);
    res.send(Documents);
  },
  getDocuments: async (req, res) => {        
    const Documents = await DocumentsService.getDocuments(req.hostId);
    res.send(Documents);
  },
  getDocumentsInfo: async (req, res) => {        
    const Documents = await DocumentsService.getDocumentsInfo(req.hostId);
    res.send(Documents);
  },
  getDocumentFiles: async (req, res) => {        
    const DocumentFiles = await DocumentsService.getDocumentFiles(req.hostId, req.params);
    res.send(DocumentFiles);
  },
  getDocumentEvents: async (req, res) => {        
    const DocumentFiles = await DocumentsService.getDocumentEvents(req.hostId, req.params);
    res.send(DocumentFiles);
  },
  getFilteredDocuments: async (req, res) => {        
    const Documents = await DocumentsService.getFilteredDocuments(req.hostId, req.body);
    res.send(Documents);
  },
  getCaseDocuments: async (req, res) => {        
    const Documents = await DocumentsService.getCaseDocuments(req.hostId, req.params);
    res.send(Documents);
  },

  insertDocument: async (req, res) => {
    const result = await DocumentsService.insertDocument(req.hostId, req.body);
    res.send(result);
  },

  updateDocument: async (req, res) => {
    const result = await DocumentsService.updateDocument(req.hostId, req.body, req.body.DOC_ID);
    res.send(result);
  },

  deleteDocument: async (req, res) => {
    const result = await DocumentsService.deleteDocument(req.hostId, req.params);
    res.send(result);
  },

  getDocumentsLocations: async (req, res) => {  
    const DocumentsLocations = await DocumentsService.getDocumentsLocations(req.hostId, req.params);
    res.send(DocumentsLocations);
  },

  getDocumentsActiveLocations: async (req, res) => {  
    const DocumentsLocations = await DocumentsService.getDocumentsActiveLocations(req.hostId, req.params);
    res.send(DocumentsLocations);
  },

  getDocForms: async (req, res) => {
    const DocForms = await DocumentsService.getDocForms(req.hostId);
    res.send(DocForms);
  },

  insertDocForm: async (req, res) => {
    const DocForms = await DocumentsService.insertDocForm(req.hostId, req.body);
    res.send(DocForms);
  },

  insertDocFormText: async (req, res) => {
    const DocForms = await DocumentsService.insertDocFormText(req.hostId, req.body);
    res.send(DocForms);
  },

  ///DOC KEYWORDS
  getAllDocKeywords: async (req, res) => {        
    const response = await DocumentsService.getAllDocKeywords(req.hostId);
    res.send(response);
  },

  getDocKeywords: async (req, res) => {        
    const response = await DocumentsService.getDocKeywords(req.hostId, req.params);
    res.send(response);
  },

  insertDocKeywords: async (req, res) => {
    const response = await DocumentsService.insertDocKeywords(req.hostId, req.body);
    res.send(response);
  },

  deleteDocKeywords: async (req, res) => {
    const response = await DocumentsService.deleteDocKeywords(req.hostId, req.params);
    res.send(response);
  },

  insertFileLocation: async (req, res) => {
    const response = await DocumentsService.insertFileLocation(req.hostId, req.body);
    res.send(response);
  },

  updateFileLocation: async (req, res) => {
    const response = await DocumentsService.updateFileLocation(req.hostId, req.body);
    res.send(response);
  },



  insertFileVersion: async (req, res) => {
    const response = await DocumentsService.insertFileVersion(req.hostId, req.body);
    res.send(response);
  },

  getLastCheckLocations: async (req, res) => {        
    const response = await DocumentsService.getLastCheckLocations(req.hostId, req.params);
    res.send(response);
  },
  
  insertCheckLocations: async (req, res) => {
    const response = await DocumentsService.insertCheckLocations(req.hostId, req.body);
    res.send(response);
  },

  test: async (req, res) => {
    const response = await DocumentsService.test(req.hostId, req.params);
    res.send(response);
  },
};

module.exports = Documents;