import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/AuthService";

// Authentication related pages
// import Login from "../pages/Authentication/Login";
// import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";
// import ForgetPwd from "../pages/Authentication/ForgetPassword";
// import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Cases from "../pages/Case/Cases";
import SingleCase from "../pages/Case/SingleCase";
import CaseSettings from "../pages/Case/SingleCase";
import Documents from "../pages/Documents/Documents"
import Events from "../pages/Events/Events"
import Admin from "../pages/Admin/Admin"
//SignIn
import SignIn from './../pages/Authentication/SignIn'
import LockScreen from './../pages/Authentication/LockScreen'
import UserManagement from "./../pages/Tools/Users/UserManagement";
import SinglDocumentPage from "./../pages/Documents/SinglDocumentPage";
import Synchronization from "../pages/Synchronization/Synchronization";
import SynchronizationSettings from "../pages/Synchronization/SynchronizationSettings";
import SingleEventView from "./../pages/Events/SingleEventView";
import Departments from "../pages/Tools/Departments/Departments";
import Calendar from "./../pages/Tools/Calendars/Calendars";
import FormTools from "./../FormsDetect/FormTools";
import Search  from "./../pages/Search/Search";
import SyncLog from "../pages/Synchronization/SyncLog";
import ActivityTypes from "../pages/Tools/ActivityTypes/ActivityTypes";
import Settings from "../pages/Settings/Settings";
import Notifications from "../pages/Notifications/Notifications";
import TimeLog from "../pages/TimeLog/TimeLog";
import EventChain from "../pages/Events/EventChain";
import SyncBoard from "../pages/Synchronization/SyncBoard";
import CheckLocationsPm from "../progress-modals/Synchronization/CheckLocations.pm";
import SynchronizationProcess from "../pages/Synchronization/SynchronizationProcess";

const authProtectedRoutes = [

	{ type: 'DASHBOARD', path: "/dashboard", component: Dashboard },
	{ type: 'FORM_TOOLS', path: "/file/:filePrevievPath", exact: true, strict: true, component: FormTools },

	{ type: 'CASE_SETTINGS', path: "/case/:Case_Short_NAME/settings", exact: true, strict: true, component: CaseSettings },
	{ type: 'CASE_EVENTS', path: "/case/:Case_Short_NAME/events", exact: true, strict: true, component: Events },
	{ type: 'CASE_DOCUMENTS', path: "/case/:Case_Short_NAME/documents", exact: true, strict: true, component: Documents },
	{ type: 'SINGLE_CASE', path: "/case/:Case_Short_NAME", exact: true, strict: true, component: SingleCase },

	{ type: 'STATUS_CASES', path: "/cases/status/:Status", exact: true, strict: true, component: Cases },
	{ type: 'ALL_CASES', path: "/cases", exact: true, strict: true, component: Cases },
  { type: 'ALL_DOCUMENTS', path: "/documents", exact: true, strict: true, component: Documents },
  { type: 'SINGLE_DOCUMENT', path: "/document/:DOC_ID", exact: true, strict: true, component: SinglDocumentPage },
  { type: 'ALL_EVENTS', path: "/events", exact: true, strict: true, component: Events },
	{ type: 'EVENT_CHAIN', path: "/event/:Activity_Name/chain", exact: true, strict: true, component: EventChain },
  { type: 'SINGLE_EVENT', path: "/event/:Activity_Name", exact: true, strict: true, component: SingleEventView },

	{ type: 'SYNCHRONIZATION/LOG', path: "/syncronization/log",   component: SyncLog },
	{ type: 'SYNCHRONIZATION/BOARD', path: "/syncronization/board",   component: SyncBoard },
  { type: 'SYNCHRONIZATION/SETTINGS', path: "/syncronization/settings", component: SynchronizationSettings },
  { type: 'SYNCHRONIZATION', path: "/syncronization", component: Synchronization },


  { type: 'ADMIN_TOOLS/USERS', path: "/admin-tools/users", component: UserManagement },
  { type: 'ADMIN_TOOLS/ERRORS', path: "/admin-tools/errors", component: Admin },
  { type: 'ADMIN_TOOLS/DEPARTMENTS', path: "/admin-tools/departments", component: Departments },
  { type: 'ADMIN_TOOLS/PRIVILEGES', path: "/admin-tools/privileges", component: Admin },
  { type: 'ADMIN_TOOLS/CALENDARS', path: "/admin-tools/calendars", component: Calendar },
  { type: 'ADMIN_TOOLS/ACTIVITY_TYPES', path: "/admin-tools/activity-types", component: ActivityTypes },
  { type: 'ADMIN_TOOLS', path: "/admin-tools", component: Admin },
  { type: 'LOCK_SCREEN', path: "/lock-screen", component: LockScreen },
	{ type: 'SEARCH_PAGE', path: "/search", exact: true, strict: true, component: Search },
	{ type: 'SETTINGS', path: "/settings", exact: true, strict: true, component: Settings },
	{ type: 'NOTIFICATIONS', path: "/all-notifications", exact: true, strict: true, component: Notifications },
	{ type: 'TIME_LOG', path: "/time-log", exact: true, strict: true, component: TimeLog },

	{ type: 'MODAL/TEST', path: "/modal/test", exact: true, strict: true, component: CheckLocationsPm},
	{ type: 'MODAL/SYNC', path: "/modal/synchronization", exact: true, strict: true, component: SynchronizationProcess},



	{ type: 'LOGOUT', path: "/logout", component: () => {
		AuthService.removeAuthHash();
		return <Redirect to="/signin" />
	} },
	
	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

const publicRoutes = [
	{ type: 'SIGN_IN',  path: "/signin", component: SignIn },
	// { path: "/logout", component: Logout },
	// { path: "/login", component: Login },
	// { path: "/forgot-password", component: ForgetPwd },
	// { path: "/register", component: Register },
	// { path: "/auth-lock-screen", component: AuthLockScreen },
];

export { authProtectedRoutes, publicRoutes };