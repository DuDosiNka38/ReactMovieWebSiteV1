export const personnelRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};

export const personnelSucceeded = (state, action) => {
  const recievedPersonnel = action.payload;
  const personnel = [...state.personnel].filter((p) => recievedPersonnel.map((x) => (x.Person_id)).includes(p.Person_id));

  
  recievedPersonnel.map((p) => {
    const ind = personnel.findIndex((x) => x.Person_id === p.Person_id);
    if (ind >= 0) {
      personnel[ind] = { ...personnel[ind], ...p };
    } else {
      personnel.push(p);
    }
  });

  return {
    ...state,
    personnel: personnel,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const personnelFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};


export const rolesRequested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};

export const rolesSucceeded = (state, action) => {
  return {
    ...state,
    Roles: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const rolesFailed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};

