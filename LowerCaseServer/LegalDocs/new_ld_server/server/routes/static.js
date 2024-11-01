const express = require("express");
const { getCaseTypes } = require("../route-actions/CaseTypes");
const { getActivityTypes, insertActivityType, updateActivityType, deleteActivityType } = require("../route-actions/ActivityTypes");
const { getActivityRequirements, insertActivityRequirement, updateActivityRequirement, deleteActivityRequirement } = require("../route-actions/ActivityRequirements");
const { getCalendars, updateCalendar, deleteCalendar, insertCalendar, getCalendarTypes } = require("../route-actions/Calendars");
const { getCaseStatuses } = require("../route-actions/CaseStatuses");
const { getFileStatuses } = require("../route-actions/FileStatuses");
const { getFileFormats } = require("../route-actions/FileFormats");
const { getRelationTypes } = require("../route-actions/RelationTypes");
const { getCaseRoles } = require("../route-actions/CaseRoles");
const { getCaseSides } = require("../route-actions/CaseSides");
const { getUserRoles } = require("../route-actions/UserRoles");
const { getDocForms, insertDocForm, insertDocFormText } = require("../route-actions/Documents");
const { getSyncParsingSteps } = require("../route-actions/Sync");

const staticRouter = express.Router();
const jsonParser = express.json();

staticRouter.get("/case-types", getCaseTypes);
staticRouter.get("/case-roles", getCaseRoles);
staticRouter.get("/case-sides", getCaseSides);
staticRouter.get("/case-statuses", getCaseStatuses);

staticRouter.get("/activity-types", getActivityTypes);
staticRouter.post("/activity-type", jsonParser, insertActivityType);
staticRouter.put("/activity-type", jsonParser, updateActivityType);
staticRouter.delete("/activity-type/:Activity_type", deleteActivityType);


staticRouter.get("/activity-requirements", getActivityRequirements);
staticRouter.post("/activity-requirement", jsonParser, insertActivityRequirement);
staticRouter.put("/activity-requirement", jsonParser, updateActivityRequirement);
staticRouter.delete("/activity-requirement/:Parent_Activity_type/child/:Child_Activity_type/case-type/:Case_Type", deleteActivityRequirement);

staticRouter.get("/calendars", getCalendars);
staticRouter.get("/calendar-types", getCalendarTypes);
staticRouter.post("/calendar", jsonParser, insertCalendar);
staticRouter.put("/calendar/:Calendar_name", jsonParser, updateCalendar);
staticRouter.delete("/calendar/:Calendar_name", deleteCalendar);

staticRouter.get("/file-statuses", getFileStatuses);
staticRouter.get("/file-formats", getFileFormats);
staticRouter.get("/relation-types", getRelationTypes);
staticRouter.get("/user-roles", getUserRoles);
staticRouter.get("/parsing-steps", getSyncParsingSteps);

staticRouter.get("/doc-forms", getDocForms);
staticRouter.post("/doc-form", jsonParser, insertDocForm);
staticRouter.post("/doc-form/text", jsonParser, insertDocFormText);


module.exports = staticRouter;
