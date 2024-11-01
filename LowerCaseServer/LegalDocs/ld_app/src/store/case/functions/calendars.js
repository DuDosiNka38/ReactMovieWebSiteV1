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

export const calendarsRequested = requested;
export const calendarsFailed = failed;
export const calendarsSucceeded = (state, action) => {
  return {
    ...state,
    calendars: action.payload,
    loading: false,
    error: false,
  };
};

export const addCalendarRequested = requested;
export const addCalendarFailed = failed;
export const addCalendarSucceeded = (state, action) => {
  return {
    ...state,
    calendars: [...state.calendars, action.payload],
    loading: false,
    error: false,
  };
};

export const updateCalendarRequested = requested;
export const updateCalendarFailed = failed;
export const updateCalendarSucceeded = (state, action) => {
  const { calendars } = state;
  const Calendar = action.payload;

  return {
    ...state,
    calendars: state.calendars.map((x, i, arr) => {
      if(x.Calendar_name === Calendar.Calendar_name){
        return Calendar;
      } else {
        return x;
      }
    }),
    loading: false,
    error: false,
  };
};

export const deleteCalendarRequested = requested;
export const deleteCalendarFailed = failed;
export const deleteCalendarSucceded = (state, action) => {
  const { calendars } = state;
  const Calendar = action.payload;

  return {
    ...state,
    calendars: calendars.filter((x) => x.Calendar_name !== Calendar),
    loading: false,
    error: false,
  };
};

