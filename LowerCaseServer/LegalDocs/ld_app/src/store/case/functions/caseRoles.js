export const caseRolesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  }
};

export const caseRolesSucceeded = (state, action) => {
  return {
    ...state,
    caseRoles: action.payload,
    loading: false,
    error: false,
  };
};

export const caseRolesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
