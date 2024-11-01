import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as DocumentsActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import { DOCUMENTS_INFO_FETCH_REQUESTED, DOCUMENT_FILES_FETCH_REQUESTED, DOC_FORMS_FETCH_REQUESTED, DOC_KEYWORDS_FETCH_REQUESTED } from "./actionTypes";
import DocsApi from "../../api/DocsApi";

function* fetchDocuments(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchDocuments"));
    const docsInfo = yield call(DocsApi.fetchDocumentsInfo);
    yield put(DocumentsActions.documentsInfoFetchSucceeded(docsInfo));
  } catch (e) {
    yield put(DocumentsActions.documentsInfoFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchDocuments"));
  }
}

function* fetchDocForms(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchDocForms"));
    const docsInfo = yield call(DocsApi.fetchDocForms);
    yield put(DocumentsActions.docFormsFetchSucceeded(docsInfo));
  } catch (e) {
    yield put(DocumentsActions.docFormsFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchDocForms"));
  }
}

function* fetchDocFiles(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchDocFiles"));
    const docsInfo = yield call(DocsApi.fetchDocFiles, action.payload);
    yield put(DocumentsActions.docFilesFetchSucceeded(docsInfo));
  } catch (e) {
    yield put(DocumentsActions.docFilesFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchDocFiles"));
  }
}

function* fetchDocKeywords(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchDocKeywords"));
    const docsInfo = yield call(DocsApi.fetchAllDocKeywords);
    yield put(DocumentsActions.docKeywordsFetchSucceeded(docsInfo));
  } catch (e) {
    yield put(DocumentsActions.docKeywordsFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchDocKeywords"));
  }
}

function* DocumentsSaga() {
  yield takeEvery(DOCUMENTS_INFO_FETCH_REQUESTED, fetchDocuments);
  yield takeEvery(DOC_FORMS_FETCH_REQUESTED, fetchDocForms);
  yield takeEvery(DOCUMENT_FILES_FETCH_REQUESTED, fetchDocFiles);
  yield takeEvery(DOC_KEYWORDS_FETCH_REQUESTED, fetchDocKeywords);
}

export default DocumentsSaga;
