const requested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  }
};

const failed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};

export const departmentsRequested = requested;
export const departmentsFailed = failed;
export const departmentsSucceeded = (state, action) => {
  return {
    ...state,
    departments: action.payload,
    loading: false,
    error: false,
  };
};

export const addDepartmentRequested = requested;
export const addDepartmentFailed = failed;
export const addDepartmentSucceeded = (state, action) => {
  return {
    ...state,
    departments: [...state.departments, action.payload],
    loading: false,
    error: false,
  };
};

export const updateDepartmentRequested = requested;
export const updateDepartmentFailed = failed;
export const updateDepartmentSucceeded = (state, action) => {
  const { departments } = state;
  const Department = action.payload;

  return {
    ...state,
    departments: state.departments.map((x, i, arr) => {
      if(x.Department_id === Department.Department_id){
        return Department;
      } else {
        return x;
      }
    }),
    loading: false,
    error: false,
  };
  
};

export const deleteDepartmentRequested = requested;
export const deleteDepartmentFailed = failed;
export const deleteDepartmentSucceded = (state, action) => {
  const { departments } = state;
  const Department = action.payload;

  return {
    ...state,
    departments: departments.filter((x) => x.Department_id !== Department),
    loading: false,
    error: false,
  };
};

