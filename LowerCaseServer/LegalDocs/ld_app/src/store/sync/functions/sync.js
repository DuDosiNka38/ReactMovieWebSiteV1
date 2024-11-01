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
//SYNC SHARE
export const syncShareRequested = requested;
export const syncShareFailed = failed;
export const syncShareSucceeded = (state, action) => {
  const syncShare = [...state.syncShare];
  const recievedSyncShare = action.payload;
  
  recievedSyncShare.map((p) => {
    const ind = syncShare.findIndex((x) => x.Share_to_Person_id === p.Share_to_Person_id);
    if (ind >= 0) {
      syncShare[ind] = { ...syncShare[ind], ...p };
    } else {
      syncShare.push(p);
    }
  });

  return {
    ...state,
    syncShare: syncShare,
    loading: false,
    isInit: true,
    error: false,
  };
};


export const syncSharedPersonsRequested = requested;
export const syncSharedPersonsFailed = failed;
export const syncSharedPersonsSucceeded = (state, action) => {
  const recievedSyncSharedPersons = action.payload;

  return {
    ...state,
    Shared_Persons: recievedSyncSharedPersons,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const removeSyncSharePersonRequested = requested;
export const removeSyncSharePersonFailed = failed;
export const removeSyncSharePersonSucceded = (state, action) => {
  return {
    ...state,
    loading: false,
    syncShare: state.syncShare.filter((x) => x.Share_to_Person_id !== action.payload)
  };
}

export const addSyncSharePersonRequested = requested;
export const addSyncSharePersonFailed = failed;


//SYNC SCHEDULE
export const syncScheduleRequested = requested;
export const syncScheduleFailed = failed;
export const syncScheduleSucceeded = (state, action) => {
  const recievedSyncSchedule = action.payload;

  return {
    ...state,
    syncSchedule: recievedSyncSchedule,
    loading: false,
    isInit: true,
    error: false,
  };
};

export const setSyncScheduleRequested = requested;
export const setSyncScheduleFailed = failed;

export const removeSyncScheduleRequested = requested;
export const removeSyncScheduleFailed = failed;
export const removeSyncScheduleSucceded = (state, action) => {
  return {
    ...state,
    loading: false,
    syncSchedule: state.syncSchedule.filter((x) => x.Row_id !== action.payload)
  };
}

//Parsing Steps
export const parsingStepsRequested = requested;
export const parsingStepsFailed = failed;
export const parsingStepsSucceeded = (state, action) => {
  return {
    ...state,
    Parsing_Steps: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};


export const setSyncProcess = (state, action) => {
  return {
    ...state,
    process: action.payload,
    loading: true,
    error: false,
  };
};

