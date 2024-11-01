export const caseTypesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  }
};

export const caseTypesSucceeded = (state, action) => {
  return {
    ...state,
    caseTypes: action.payload,
    loading: false,
    error: false,
  };
};

export const caseTypesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
