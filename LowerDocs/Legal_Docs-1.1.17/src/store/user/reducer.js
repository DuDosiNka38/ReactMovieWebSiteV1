import {
  requestedCaseSuces,
  requestedError,
  requestedDepartments,
  requestedCaseTypes,
  requestedPersoneData,
  requestedGlobalData,
  requestedAllUsersData,
  requestedParticipantRolesData,
  requestedUserRoles,
  requestedKeywords,
  requestedCalendars,
  LocalEvents,
  requestedRelationType,
  requestedAllEvents,
  requestedCaseStatus,
  requestedAllAlerts,
  requestedAllTodos,
  IS_USER_LOGGED,
  IS_USER_CHECK,
  IS_MOUNT_DATA,
  requestedPrviliges,
  requestedActivityTypes,
  requestedRolePrviliges,
  requestedSettings,
  requestedStaff,
  requestedGlobalKeywords,
  requestedSyncPath,
} from "./actionTypes";

const INIT_STATE = {
  caseData: {
    cases: [],
    files: [],
    caseRoles: [],
    casesTypes: [],
  },
  depatmentsData: {
    departments: [],
  },
  casesTypes: [],
  allCasesCount: [],
  persone: [],
  globalData: [],
  allUserData: [],
  staff: [],
  participantRoles: [],
  User_Roles: [],
  localEvents: [],
  calendars: [],
  relationType: [],
  IS_USER_LOGGED_IN: false,
  IS_USER_CHECKED_LOGGED_IN: false,
  IS_MOUNT_DATA_LOADED: false,
  AllEvents: [],
  CaseStatuses: [],
  todos: [],
  alerts: [],
  previliges: [],
  role_previliges: [],
  activityTypes: [],
  settings: {},
  keywords: [],
  globalKeywords: [],
  syncPath: [],
};

const User = (state = INIT_STATE, action) => {
  switch (action.type) {
    case IS_USER_LOGGED:
      return {
        ...state,
        IS_USER_LOGGED_IN: action.payload,
      };
    case IS_USER_CHECK:
      return {
        ...state,
        IS_USER_CHECKED_LOGGED_IN: action.payload,
      };
    case IS_MOUNT_DATA:
      return {
        ...state,
        IS_MOUNT_DATA_LOADED: action.payload,
      };
    case requestedParticipantRolesData:
      return {
        ...state,
        participantRoles: action.payload,
      };
    case requestedAllEvents:
      return {
        ...state,
        AllEvents: action.payload,
      };
    case requestedCalendars:
      return {
        ...state,
        calendars: action.payload,
      };

    case requestedCaseStatus:
      return {
        ...state,
        CaseStatuses: action.payload,
      };
      case requestedGlobalKeywords:
        return {
          ...state,
          
          globalKeywords: action.payload,
        };

      case requestedStaff:
        return {
          ...state,
          staff: action.payload,
        };



    case requestedKeywords:
      return {
        ...state,
        keywords: action.payload,
      };

    case requestedRelationType:
      return {
        ...state,
        relationType: action.payload,
      };

    case requestedRolePrviliges:
      return {
        ...state,
        role_previliges: action.payload,
      };
    case requestedActivityTypes:
      return {
        ...state,
        activityTypes: action.payload,
      };
    case requestedPrviliges:
      return {
        ...state,
        previliges: action.payload,
      };

    case requestedSettings:
      return {
        ...state,
        settings: action.payload,
      };

    case requestedAllTodos:
      return {
        ...state,
        todos: action.payload,
      };

    case requestedAllAlerts:
      return {
        ...state,
        alerts: action.payload,
      };

    case LocalEvents:
      return {
        ...state,
        localEvents: action.payload,
      };
    case requestedAllUsersData:
      return {
        ...state,
        allUserData: action.payload,
      };
    case requestedUserRoles:
      return {
        ...state,
        User_Roles: action.payload,
      };

    case requestedGlobalData:
      return {
        ...state,
        globalData: action.payload,
        error: false,
      };

    case requestedPersoneData:
      return {
        ...state,
        persone: action.payload,
        error: false,
      };

    case requestedDepartments:
      return {
        ...state,
        depatmentsData: {
          ...state,
          departments: action.payload,
        },
        error: false,
      };
    case requestedCaseTypes:
      return {
        ...state,
        casesTypes: action.payload,
        error: false,
      };

      case requestedSyncPath:
        return {
          ...state,
          syncPath: action.payload,
          error: false,
        };

    case requestedCaseSuces:
      return {
        ...state,
        caseData: {
          ...state,
          cases: action.payload,
        },
        error: false,
      };

    case requestedError:
      return {
        error: true,
      };
    default:
      return state;
  }
};

export default User;
