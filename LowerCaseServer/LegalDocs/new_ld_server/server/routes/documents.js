const express = require("express"); 
const { getDocuments, getCaseDocuments, getDocument, insertDocument, deleteDocument, getFilteredDocuments, getDocumentsInfo, getDocumentsLocations, getDocumentsActiveLocations, getFilesHashes, updateDocument, getDocumentFiles, getAllDocKeywords, insertDocKeywords, deleteDocKeywords, getDocKeywords, getDocumentEvents, test, insertFileLocation, updateFileLocation, insertFileVersion, getLastCheckLocations, insertCheckLocations } = require("../route-actions/Documents");

const Functions = require("./../lib/Functions");

const docsRouter = express.Router();
const jsonParser = express.json();

//Auth Listeners
docsRouter.use(Functions.isValidSession);

docsRouter.get("/file-hashes", getFilesHashes);

docsRouter.get("/documents/test", test);

docsRouter.get("/documents", getDocuments);
docsRouter.get("/documents/info", getDocumentsInfo);
docsRouter.post("/documents/filtered", jsonParser, getFilteredDocuments);
docsRouter.get("/documents/:Case_NAME", getCaseDocuments);
docsRouter.get("/document/:DOC_ID", getDocument);
docsRouter.get("/document/:DOC_ID/files", getDocumentFiles);
docsRouter.get("/document/:DOC_ID/events", getDocumentEvents);

docsRouter.post("/document", jsonParser, insertDocument);
docsRouter.put("/document", jsonParser, updateDocument);

docsRouter.delete("/document/:DOC_ID", deleteDocument);

docsRouter.get("/documents/locations/computer/:Computer_id", getDocumentsLocations);
docsRouter.get("/documents/active-locations/computer/:Computer_id", getDocumentsActiveLocations);

docsRouter.get("/doc-keywords", getAllDocKeywords);
docsRouter.get("/document/:DOC_ID/keywords", getDocKeywords);
docsRouter.post("/document/keywords", jsonParser, insertDocKeywords);
docsRouter.delete("/document/:DOC_ID/keywords/:KEYWORDS", deleteDocKeywords);

docsRouter.post("/file/location", jsonParser, insertFileLocation)
docsRouter.put("/file/location", jsonParser, updateFileLocation)

docsRouter.post("/file/version", jsonParser, insertFileVersion)


docsRouter.get("/last-check-locations/person/:Person_id/computer/:Computer_id", getLastCheckLocations);
docsRouter.post("/last-check-locations", jsonParser, insertCheckLocations);


module.exports = docsRouter;