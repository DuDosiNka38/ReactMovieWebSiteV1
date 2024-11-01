import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Error404 from "../pages/Errors/Error404";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";
// import UserSettings from '../pages/UserSettings/Usersettings';
import SingleCaseView from "../pages/AllCases/SingleCaseView";
import CreateCase from "../pages/CreateCase/CreateCase";
import AllCases from "../pages/AllCases/AllCasse";
import UsersConfiguration from "../pages/Users/UsersConfiguration";
import Department from "../pages/Departments/Deparments";
import FileView from "../pages/FileView/FileView";
import Users from "../pages/Users/Users";
import DocumentView from "../pages/Ducuments/Document/DocumentView";
import CaseInfo from "../pages/AllCases/CaseInfo";
import Events from "../pages/Events/Events";
import DocumentsList from "../pages/Ducuments/DocumentsList";
import SingleEventsView from "../pages/Events/SingleEventView";
import Priviliges from "../pages/Privileges/Privileges";
import Search from "../pages/Search/Search";
import Activity from "../pages/Activity/Activity";
import UserSettings from "../pages/Settings/User/UserSettings";
import AdminSettings from "../pages/Settings/Admin/AdminSettings";
import ElectronSettings from "../electron/pages/Settings/ElectronSettings";
import CaseExplorer from './../pages/CaseExplorer/CaseExplorer'
import AllEvents from './../pages/Events/AllEvents'
import Documents from './../pages/AllDocuments/Documents'
import Sync from './../electron/pages/Sync/Sync'
import Log from './../components/Dasboard/Log/Log'

import Calendars from "./../pages/Calendars/Calendars";
// Dashboard
import General from "../pages/General/index";

const authProtectedRoutes = [
  { path: "/home", component: General },
  { path: "/register", component: Register },
  // { path: "/usersettings", component: UserSettings },
  { path: "/caseview/:caseId", component: SingleCaseView },
  { path: "/file/:filePath", component: FileView },
  { path: "/createcase", component: CreateCase },
  { path: "/allcases", component: AllCases },
  { path: "/configusers/:userId", component: UsersConfiguration },
  { path: "/departments", component: Department },
  { path: "/usersmanagement", component: Users },
  { path: "/case/:caseId/document/:docId", component: DocumentView },
  { path: "/caseinfo/:caseId", component: CaseInfo },
  { path: "/events", component: Events },
  { path: "/case/:caseId/documents-list", component: DocumentsList },
  { path: "/case/:caseId/event/:eventId", component: SingleEventsView },
  { path: "/priviliges", component: Priviliges },
  { path: "/search", component: Search },
  { path: "/activity", component: Activity },
  { path: "/admin/settings", component: AdminSettings },
  { path: "/user/settings", component: UserSettings },
  { path: "/app/settings", component: ElectronSettings },
  { path: "/calendars", component: Calendars },
  { path: "/app/case-explorer", component: CaseExplorer },
  { path: "/allevents", component: AllEvents },
  { path: "/alldocs", component: Documents },
  { path: "/sync", component: Sync },

  // { path: "/home/todos/:type", component: Log },
  // { path: "/app/case-explorer/:comp", component: Test },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/home" /> },
  // {  component: Error404 },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/auth-lock-screen", component: AuthLockScreen },
];

export { authProtectedRoutes, publicRoutes };
