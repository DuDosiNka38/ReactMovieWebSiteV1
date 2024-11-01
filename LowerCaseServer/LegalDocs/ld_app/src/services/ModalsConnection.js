import store from "./../store";
import * as ModalActions from "./../store/modal/actions";
import NewCase from "./../modals/Case/NewCaseModal";
import ManageCaseParticipantsModal from "./../modals/Case/ManageCaseParticipantsModal";
import DeleteCaseModal from "./../modals/Case/DeleteCaseModal";
import ChooseExistingPersonModal from "./../modals/Case/ChooseExistingPersonModal";
import AddNewCasePersonModal from "./../modals/Case/AddNewCasePersonModal";
import DeleteCaseParticipantModal from "./../modals/Case/DeleteCaseParticipantModal";
import ChooseCaseParticipantsRolesModal from "./../modals/Case/ChooseCaseParticipantsRolesModal";
import AddNewUserModal from "./../modals/Users/AddNewUserModal";
import AddNewUserSucceededModal from "./../modals/Users/AddNewUserSucceededModal";
import PinUserToCase from "./../modals/Users/PinUserToCase";
import ManualSyncModal from "./../modals/Sync/ManualSyncModal";
import SyncProgressModal from "./../modals/Sync/SyncProgressModal";
import UploadFilesModal from "./../modals/Sync/UploadFilesModal";
import SyncEndsModal from "./../modals/Sync/SyncEndsModal";
import EditDocumentModal from "./../modals/Documents/EditDocumentModal";
import DeleteEvent from "../components/Calendar/modals/DeleteEvent";
import WrongRowsModal from "../modals/Sync/WrongRowsModal";
import SubmitParsedFilesModal from "../modals/Sync/SubmitParsedFilesModal";
import RemovedParsedFilesModal from "../modals/Sync/RemovedParsedFilesModal";
import ChooseCaseForParsedModal from "../modals/Sync/ChooseCaseForParsedModal";
import ChooseFormForParsedModal from "../modals/Sync/ChooseFormForParsedModal";
import UserPcConfig from "./../modals/Users/UserPcConfig";
import DeleteUSerModal from "./../modals/Users/DeleteUserModal";
import UpdateUserModal from "./../modals/Users/UpdateUserModal";
import DaysCountModal from "./../components/Calendar/modals/DaysCountModal";
import AddEventModal from "./../components/Calendar/modals/AddEventModal";
import AddEventSuccModal from "./../components/Calendar/modals/AddEventSuccModal";
import CalendarSelectDocs from "./../components/Calendar/CalendarSelectDocs";
import SettingsCaseModal from "./../modals/Case/SettingsCaseModal";
import DeleteDocumentModal from "./../modals/Documents/DeleteDocumentModal";
import AddDocumentModal from "./../modals/Documents/AddDocumentModal";
import AddCalendarsModal from "./../pages/Tools/Calendars/modals/AddCalendarsModal";
import DeleteCalendarsModal from "./../pages/Tools/Calendars/modals/DeleteCalendarsModal";
import UpdateCalendarModal from "./../pages/Tools/Calendars/modals/UpdateCalendarModal";
import AddDepartmentModal from "./../pages/Tools/Departments/modals/AddDepartmentModal";
import DeleteDepartmentModal from "./../pages/Tools/Departments/modals//DeleteDepartmentModal";
import UpdateDepartmentModal from "./../pages/Tools/Departments/modals/UpdateDepartmentModal";
import FilePreviewImageModal from "../modals/Documents/FilePreviewImageModal";
import AddKeywordsModal from "../modals/Documents/AddKeywordsModal";
import DeleteKaywordModal from "../modals/Documents/DeleteKaywordModal";
import NotUploadedFilesModal from "../modals/Sync/NotUploadedFilesModal";
import ChangeDocFormModal from "../modals/Documents/ChangeDocFormModal";
import ViewFileModal from "../modals/Documents/ViewFileModal";
import RemoveUserPcModal from "../modals/Users/RemoveUserPcModal";
import NewRectConfig from "../FormsDetect/Toolbar/modals/NewRectConfig";
import SearchModal from "./../modals/Search/SearchModal";
import SyncErrorModal from "../modals/Sync/SyncErrorModal";
import SynchronizationModal from "../modals/Sync/SynchronizationModal";
import ServerErrorModal from "../modals/System/ServerError.modal";
import AttachDocumentModal from "../modals/Event/AttachDocument.modal";
import ChooseDocsRelationModal from "../modals/Event/ChooseDocsRelation.modal";
import ConfirmDisattachModal from "../modals/Event/ConfirmDisattach.modal";
import EditEvent from "../components/Calendar/modals/EditEvent";
import AttachToEventModal from "../modals/Event/AttachToEvent.modal";
import DeleteActivityTypeModal from "../modals/ActivityType/DeleteActivityType.modal";
import AddActivityTypeModal from "../modals/ActivityType/AddActivityType.modal";
import EditActivityTypeModal from "../modals/ActivityType/EditActivityType.modal";
import DocDescEditorModal from "../modals/Documents/DocDescEditorModal";
import ActivityTypeRequirementsModal from "../modals/ActivityType/ActivityTypeRequirements.modal";
import AddNewActivityRequirementModal from "../modals/ActivityType/AddNewActivityRequirement.modal";
import AddChildEvent from "../components/Calendar/modals/AddChildEvent";
import EditEventDesc from "../modals/Event/EditEventDesc";
import DeleteActivityRequirementModal from "../modals/ActivityType/DeleteActivityRequirement.modal";
import AskAddActivityRequirementsModal from "../modals/ActivityType/AskAddActivityRequirements.modal";
import AddNewActivityRequirementResultModal from "../modals/ActivityType/AddNewActivityRequirementResult.modal";
import EditActivityRequirementModal from "../modals/ActivityType/EditActivityRequirement.modal";
import CheckAvailability from "../components/Calendar/modals/CheckAvailability";
import ShowHa from "../components/Calendar/modals/ShowHa";
import AssignCaseToItemsModal from "../modals/Sync/AssignCaseToItems.modal";
import DontSaved from "../modals/Settings/DontSaved";
import EstimateWarning from "./../components/Calendar/modals/EstimateWarning";
import StartTimer from "../modals/TimeLog/StartTimer.modal";
import MoreCalendarActions from '../components/Calendar/modals/MoreCalendarActions';



const ModalConnection = () => {
  store.dispatch(
    ModalActions.addModals([
      {
        type: "REMOVE_USER_PC",
        component: RemoveUserPcModal,
      },
      {
        type: "USER_DELETE",
        component: DeleteUSerModal,
      },
      {
        type: "USER_PC_CONFIG",
        component: UserPcConfig,
      },
      {
        type: "UPDATE_USER",
        component: UpdateUserModal,
      },
      {
        type: "NEW_CASE",
        component: NewCase,
      },
      {
        type: "MANAGE_CASE_PARTICIPANTS",
        component: ManageCaseParticipantsModal,
      },
      {
        type: "DELETE_CASE",
        component: DeleteCaseModal,
      },
      {
        type: "CP_CHOOSE_EXISTING_PERSON",
        component: ChooseExistingPersonModal,
      },
      {
        type: "CP_ADD_NEW_PERSON",
        component: AddNewCasePersonModal,
      },
      {
        type: "CP_DELETE_CASE_PARTICIPANT",
        component: DeleteCaseParticipantModal,
      },
      {
        type: "CP_CHOOSE_ROLES",
        component: ChooseCaseParticipantsRolesModal,
      },
      {
        type: "NEW_USER",
        component: AddNewUserModal,
      },
      {
        type: "NEW_USER_SUCCEEDED",
        component: AddNewUserSucceededModal,
      },
      {
        type: "PIN_USER_TO_CASE",
        component: PinUserToCase,
      },
      {
        type: "MANUAL_SYNC",
        component: ManualSyncModal,
      },
      {
        type: "SYNC_PROGRESS",
        component: SyncProgressModal,
      },
      {
        type: "UPLOAD_FILES",
        component: UploadFilesModal,
      },
      {
        type: "SYNC_ENDS",
        component: SyncEndsModal,
      },
      {
        type: "EDIT_DOCUMENT",
        component: EditDocumentModal,
      },
      {
        type: "DELETE_EVENT",
        component: DeleteEvent,
      },
      {
        type: "WRONG_ROWS_FOUND",
        component: WrongRowsModal,
      },
      {
        type: "SUBMIT_PARSED_FILES",
        component: SubmitParsedFilesModal,
      },
      {
        type: "REMOVE_PARSED_FILES",
        component: RemovedParsedFilesModal,
      },
      {
        type: "CHOOSE_CASE_FOR_PARSED",
        component: ChooseCaseForParsedModal,
      },
      {
        type: "CHOOSE_FORM_FOR_PARSED",
        component: ChooseFormForParsedModal,
      },
      {
        type: "DAYS_COUNT",
        component: DaysCountModal,
      },
      {
        type: "ADD_EVENT",
        component: AddEventModal,
      },
      {
        type: "EDIT_EVENT",
        component: EditEvent,
      },
      {
        type: "ADD_EVENT_SUCC",
        component: AddEventSuccModal,
      },
      {
        type: "ADD_DOCS_TO_CASE",
        component: CalendarSelectDocs
      },  
      {
        type: "SETTINGS_CASE",
        component: SettingsCaseModal,
      },
      {
        type: "DELETE_DOC",
        component: DeleteDocumentModal,
      },
      {
        type: "ADD_DOC",
        component: AddDocumentModal,
      },
      {
        type: "ADD_CALENDAR",
        component: AddCalendarsModal,
      },
      {
        type: "DELESTE_CALENDAR",
        component: DeleteCalendarsModal,
      },
      {
        type: "UPDATE_CALENDAR",
        component: UpdateCalendarModal,
      },
      {
        type: "ADD_DEPARTMENT",
        component: AddDepartmentModal
      },     
			{
        type: "DELETE_DEPARTMENT",
        component: DeleteDepartmentModal
      }, 
			{
        type: "UPDATE_DEPARTMENT",
        component: UpdateDepartmentModal
      },     
      {
        type: "FILE_PREVIEW_IMAGE",
        component: FilePreviewImageModal
      },

      {
        type: "ADD_KEYWORDS",
        component: AddKeywordsModal
      },
      {
        type: "DELETE_KEYWORD",
        component: DeleteKaywordModal
      },
      {
        type: "NOT_UPLOADED_FILES",
        component: NotUploadedFilesModal
      },
      {
        type: "CHANGE_DOC_FORM",
        component: ChangeDocFormModal
      },

      {
        type: "SHOW_FILE_PREIVIEW",
        component: ViewFileModal
      },
      {
        type: "NEW_RECT_CONFIG",
        component: NewRectConfig
      },
      {
        type: "SEARCH_MODAL",
        component: SearchModal
      },
      {
        type: "SYNC_WARNING",
        component: SyncErrorModal
      },
      {
        type: "SYNCHRONIZATION",
        component: SynchronizationModal
      },
      {
        type: "SERVER_ERROR",
        component: ServerErrorModal
      },
      {
        type: "ATTACH_DOCUMENT",
        component: AttachDocumentModal
      },
      {
        type: "CHOOSE_DOCS_RELATION",
        component: ChooseDocsRelationModal
      },
      {
        type: "CONFIRM_DISATTACH",
        component: ConfirmDisattachModal
      },
      {
        type: "ATTACH_TO_EVENT",
        component: AttachToEventModal
      },
      {
        type: "ADD_ACTIVITY_TYPE",
        component: AddActivityTypeModal
      },
      {
        type: "EDIT_ACTIVITY_TYPE",
        component: EditActivityTypeModal
      },
      {
        type: "DELETE_ACTIVITY_TYPE",
        component: DeleteActivityTypeModal
      },
      {
        type: "DOC_DESC_EDITOR",
        component: DocDescEditorModal
      },
      {
        type: "ACTIVITY_TYPE_REQUIREMENTS",
        component: ActivityTypeRequirementsModal
      },
      {
        type: "DELETE_ACTIVITY_REQUIREMENT",
        component: DeleteActivityRequirementModal
      },
      {
        type: "ADD_NEW_ACTIVITY_REQUIREMENT",
        component: AddNewActivityRequirementModal
      },
      {
        type: "EDIT_ACTIVITY_REQUIREMENT",
        component: EditActivityRequirementModal
      },
      {
        type: "ADD_CHILD_EVENT",
        component: AddChildEvent
      },
      {
        type: "EDIT_EVENT_DESC",
        component: EditEventDesc
      },
      {
        type: "ASK_ADD_ACTIVITY_REQUIREMENTS",
        component: AskAddActivityRequirementsModal
      },
      {
        type: "ADD_NEW_ACTIVITY_REQUIREMENT_RESULT",
        component: AddNewActivityRequirementResultModal
      },
      {
        type: "CHECK_AVAILABILITY",
        component: CheckAvailability
      },
      {
        type: "SHOW_HA",
        component: ShowHa
      },
      {
        type: "ASSIGN_CASE_TO_ITEMS",
        component: AssignCaseToItemsModal
      },
      {
        type: "DONT_SAVED_SETTINGS",
        component: DontSaved
      },
      {
        type: "ESTIMATE_WARNING",
        component: EstimateWarning
      },


      //Time Log
      {
        type: "START_TIMER",
        component: StartTimer
      },
      {
        type: "CALENDAR_MORE_ACTIONS",
        component: MoreCalendarActions
      }

    ])
  );
};

export default ModalConnection;
