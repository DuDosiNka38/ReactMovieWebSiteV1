export const userSingleCaseRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  }
};

export const userSingleCaseSucceeded = (state, action) => {
  const { cases } = state;
  const recievedCase = action.payload;

  const ind = cases.findIndex((x) => x.Case_Short_NAME === recievedCase.Case_Short_NAME);
  if (ind >= 0) {
    cases[ind] = { ...cases[ind], ...recievedCase };
  } else {
    cases.push(recievedCase);
  }

  return {
    ...state,
    cases: cases,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const userSingleCaseFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
