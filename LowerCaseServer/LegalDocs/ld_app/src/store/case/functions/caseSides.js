export const caseSidesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  }
};

export const caseSidesSucceeded = (state, action) => {
  return {
    ...state,
    caseSides: action.payload,
    loading: false,
    error: false,
  };
};

export const caseSidesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
