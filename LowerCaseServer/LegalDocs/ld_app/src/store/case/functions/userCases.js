export const userCasesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};

export const userCasesSucceeded = (state, action) => {
  const { cases } = state;
  const recievedCases = action.payload;  

  recievedCases.map((c) => {
    const ind = cases.findIndex((x) => x.Case_Short_NAME === c.Case_Short_NAME);
    if (ind >= 0) {
      cases[ind] = { ...cases[ind], ...c };
    } else {
      cases.push(c);
    }
  });

  return {
    ...state,
    cases: cases,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const userCasesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};

export const removeCase = (state, action) => {
  return {
    ...state,
    cases: state.cases.filter((x) => x.Case_Short_NAME !== action.payload)
  }
};

export const setCurrentCase = (state, action) => {
  return {
    ...state,
    currentCase: action.payload,
  }
}

export const removeCurrentCase = (state, action) => {
  return {
    ...state,
    currentCase: null,
  }
}
