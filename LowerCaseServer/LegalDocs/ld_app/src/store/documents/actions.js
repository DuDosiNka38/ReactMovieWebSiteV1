import { DOCUMENTS_INFO_FETCH_FAILED, DOCUMENTS_INFO_FETCH_REQUESTED, DOCUMENTS_INFO_FETCH_SUCCEEDED, DOCUMENT_FILES_FETCH_FAILED, DOCUMENT_FILES_FETCH_REQUESTED, DOCUMENT_FILES_FETCH_SUCCEEDED, DOC_FORMS_FETCH_FAILED, DOC_FORMS_FETCH_REQUESTED, DOC_FORMS_FETCH_SUCCEEDED, DOC_KEYWORDS_FETCH_FAILED, DOC_KEYWORDS_FETCH_REQUESTED, DOC_KEYWORDS_FETCH_SUCCEEDED } from "./actionTypes";

//DOCUMENTS INFO
export const documentsInfoFetchRequested = () => ({
	type: DOCUMENTS_INFO_FETCH_REQUESTED,
	payload:  null
});
export const documentsInfoFetchSucceeded = (data) => ({
	type: DOCUMENTS_INFO_FETCH_SUCCEEDED,
	payload:  data
});
export const documentsInfoFetchFailed = (eMessage) => ({
	type: DOCUMENTS_INFO_FETCH_FAILED,
	payload:  eMessage
});

//DOC FORMS
export const docFormsFetchRequested = () => ({
	type: DOC_FORMS_FETCH_REQUESTED,
	payload:  null
});
export const docFormsFetchSucceeded = (data) => ({
	type: DOC_FORMS_FETCH_SUCCEEDED,
	payload:  data
});
export const docFormsFetchFailed = (eMessage) => ({
	type: DOC_FORMS_FETCH_FAILED,
	payload:  eMessage
});

//DOC FILES
export const docFilesFetchRequested = (DOC_ID) => ({
	type: DOCUMENT_FILES_FETCH_REQUESTED,
	payload:  DOC_ID
});
export const docFilesFetchSucceeded = (data) => ({
	type: DOCUMENT_FILES_FETCH_SUCCEEDED,
	payload:  data
});
export const docFilesFetchFailed = (eMessage) => ({
	type: DOCUMENT_FILES_FETCH_FAILED,
	payload:  eMessage
});

//DOC KEYWORDS
export const docKeywordsFetchRequested = () => ({
	type: DOC_KEYWORDS_FETCH_REQUESTED,
	payload:  null
});
export const docKeywordsFetchSucceeded = (data) => ({
	type: DOC_KEYWORDS_FETCH_SUCCEEDED,
	payload:  data
});
export const docKeywordsFetchFailed = (eMessage) => ({
	type: DOC_KEYWORDS_FETCH_FAILED,
	payload:  eMessage
});
