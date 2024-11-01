const express = require("express");
const { getCases, insertCase, updateCase, deleteCase, getSingleCase, getCasesByPersonId, getCaseLog } = require("../route-actions/Case");
const { insertCaseParticipant, getAllCaseParticipants, getCaseParticipants, deleteCaseParticipant, insertCaseParticipants } = require("../route-actions/CaseParticipants");

const caseRouter = express.Router();
const jsonParser = express.json();

caseRouter.get("/cases/:type", getCases);
caseRouter.get("/cases/user/:Person_id", getCasesByPersonId);
caseRouter.post("/case", jsonParser, insertCase);
caseRouter.put("/case/:Case_Short_NAME", jsonParser, updateCase);
caseRouter.delete("/case/:Case_Short_NAME", deleteCase);


caseRouter.get("/case/:Case_Short_NAME", getSingleCase);

caseRouter.get("/case/case-participants", getAllCaseParticipants);
caseRouter.get("/case/case-participants/:Case_NAME", getCaseParticipants);
caseRouter.post("/case/case-participant", jsonParser, insertCaseParticipant);
caseRouter.post("/case/case-participants", jsonParser, insertCaseParticipants);
caseRouter.delete("/case/:Case_NAME/case-participant/:Person_id", jsonParser, deleteCaseParticipant);

caseRouter.get("/case/:Case_NAME/log", getCaseLog);

// authRouter.post("/check-hash", jsonParser, async (req, res) => {
//   res.send(await Auth.isValidHash(req.body));
// });

module.exports = caseRouter;
