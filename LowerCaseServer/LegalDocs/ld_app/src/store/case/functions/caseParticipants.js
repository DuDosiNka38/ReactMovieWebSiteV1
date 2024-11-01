
export const caseParticipantsRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};
export const caseParticipantsSucceeded = (state, action) => {
  const CASE_PARTICIPANTS_cases = [...state.cases];
  const { caseParticipants, Case_NAME } = action.payload;

  const CASE_PARTICIPANTS_ind = CASE_PARTICIPANTS_cases.findIndex((x) => x.Case_Short_NAME === Case_NAME);
  if (CASE_PARTICIPANTS_ind >= 0) {
    CASE_PARTICIPANTS_cases[CASE_PARTICIPANTS_ind] = {
      ...CASE_PARTICIPANTS_cases[CASE_PARTICIPANTS_ind],
      Case_Participants: caseParticipants,
    };
  }

  return {
    ...state,
    cases: CASE_PARTICIPANTS_cases,
    loading: false,
    isInit: true,
    error: false,
  };
};
export const caseParticipantsFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};

