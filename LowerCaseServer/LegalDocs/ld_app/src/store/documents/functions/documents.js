const requested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};

const failed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};

export const documentsRequested = requested;
export const documentsFailed = failed;
export const documentsSucceeded = (state, action) => {  
  return {
    ...state,
    info: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const docFormsRequested = requested;
export const docFormsFailed = failed;
export const docFormsSucceeded = (state, action) => {  
  return {
    ...state,
    Doc_form: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const docFilesRequested = requested;
export const docFilesFailed = failed;
export const docFilesSucceeded = (state, action) => {  
  const { DOC_ID, Doc_files } = action.payload;
  const { documents } = this.state;

  const ind = documents.findIndex((x) => x.DOC_ID === DOC_ID);
  if(ind !== -1){
    documents[ind].Doc_files = Doc_files;
  }

  return {
    ...state,
    documents,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const docKeywordsRequested = requested;
export const docKeywordsFailed = failed;
export const docKeywordsSucceeded = (state, action) => {  
  return {
    ...state,
    Doc_Keywords: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};

