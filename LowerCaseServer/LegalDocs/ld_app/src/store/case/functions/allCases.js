export const allCasesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};

export const allCasesSucceeded = (state, action) => {
  const { allCases } = state;
  const recievedCases = action.payload;

  recievedCases.map((c) => {
    const ind = allCases.findIndex((x) => x.Case_Short_NAME === c.Case_Short_NAME);
    if (ind >= 0) {
      allCases[ind] = { ...allCases[ind], ...c };
    } else {
      allCases.push(c);
    }
  });

  return {
    ...state,
    allCases: allCases,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const allCasesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
