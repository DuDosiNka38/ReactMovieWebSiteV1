import { DOCUMENTS_INFO_FETCH_FAILED, DOCUMENTS_INFO_FETCH_REQUESTED, DOCUMENTS_INFO_FETCH_SUCCEEDED, DOCUMENT_FILES_FETCH_FAILED, DOCUMENT_FILES_FETCH_REQUESTED, DOCUMENT_FILES_FETCH_SUCCEEDED, DOC_FORMS_FETCH_FAILED, DOC_FORMS_FETCH_REQUESTED, DOC_FORMS_FETCH_SUCCEEDED, DOC_KEYWORDS_FETCH_FAILED, DOC_KEYWORDS_FETCH_REQUESTED, DOC_KEYWORDS_FETCH_SUCCEEDED } from "./actionTypes";
import { docFilesFailed, docFilesRequested, docFilesSucceeded, docFormsFailed, docFormsRequested, docFormsSucceeded, docKeywordsFailed, docKeywordsRequested, docKeywordsSucceeded, documentsFailed, documentsRequested, documentsSucceeded } from "./functions/documents";

const INIT_STATE = {
  documents: [],
  info: {},
  Doc_form: [],
  Doc_Keywords: [],
  loading: false,
  isInit: false,
  error: false,
  message: null,
};

const Documents = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DOCUMENTS_INFO_FETCH_REQUESTED: return documentsRequested(state, action);
    case DOCUMENTS_INFO_FETCH_SUCCEEDED: return documentsSucceeded(state, action); 
    case DOCUMENTS_INFO_FETCH_FAILED: return documentsFailed(state, action); 

    case DOC_FORMS_FETCH_REQUESTED: return docFormsRequested(state, action);
    case DOC_FORMS_FETCH_SUCCEEDED: return docFormsSucceeded(state, action); 
    case DOC_FORMS_FETCH_FAILED: return docFormsFailed(state, action); 

    case DOCUMENT_FILES_FETCH_REQUESTED: return docFilesRequested(state, action);
    case DOCUMENT_FILES_FETCH_SUCCEEDED: return docFilesSucceeded(state, action); 
    case DOCUMENT_FILES_FETCH_FAILED: return docFilesFailed(state, action); 

    case DOC_KEYWORDS_FETCH_REQUESTED: return docKeywordsRequested(state, action);
    case DOC_KEYWORDS_FETCH_SUCCEEDED: return docKeywordsSucceeded(state, action); 
    case DOC_KEYWORDS_FETCH_FAILED: return docKeywordsFailed(state, action); 
      
    default:
      return state;
  }
};

export default Documents;
