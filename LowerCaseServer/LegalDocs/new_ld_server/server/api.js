const express = require("express");
const vhost = require("vhost");
const app = express();
const fs = require("fs");
const IO = require("./lib/Socket");
const { innerPorts, outerPorts } = require("./config/config.dev");

require("./socket");
require("./watcher");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const caseRoutes = require("./routes/case");
const departmentsRouter = require("./routes/departments");
const staticRouter = require("./routes/static");
const docsRouter = require("./routes/documents");
const eventRouter = require("./routes/events");
const computersRouter = require("./routes/computers");
const syncRouter = require("./routes/sync");
const path = require("path");
const paramsRouter = require("./routes/parameters");

const WRONG_HOST = {
  result: false,
  data: {
    error_code: "WRONG_HOSTNAME",
    error_message: "Recieved wrong hostname!",
    error_data: null,
  },
};

app.use(require("cors")());

app.use(
  vhost("*.managelegaldocs.com", async function handle(req, res, next) {
    
    if (req.vhost[0]) {
      req.hostId = req.vhost[0];

      // const isExists = await isDbExists(req.hostId);

      // if(isExists){
      //   next();
      // } else {
      //   res.send(WRONG_HOST);
      // }
      next();
    } else {
      res.send(WRONG_HOST);
    }
  })
);

app.use("*", (req, res, next) => {
  if(!req.hostId){
    res.send(WRONG_HOST);
    return;
  }

  next();
})
app.get("/", (req, res) => {
  res.send(null);
});

app.get("/api/handshake", (req, res) => {
  res.send({ result: true, alias: req.hostId, ports: outerPorts });
});

app.use("/api/", authRoutes);
app.use("/api/", caseRoutes);
app.use("/api/", userRoutes);
app.use("/api/", staticRouter);
app.use("/api/", departmentsRouter);
app.use("/api/", docsRouter);
app.use("/api/", eventRouter);
app.use("/api/", computersRouter);
app.use("/api/", syncRouter);
app.use("/api/", paramsRouter);

app.use("*", (req, res) => {
  const path1 = path.join(req.baseUrl);
  console.log(path1, fs.existsSync(path1))
  if (fs.existsSync(path1)) {
    res.sendFile(path1);
  } else {
    res.send({
      result: false,
      data: {
        error_code: "WRONG_REQUEST",
        error_message: "Recieved wrong request!",
        error_data: null,
      },
    });
  }
});

app.listen(innerPorts.api, () => {
  console.log(`API listening on port ${innerPorts.api}`);
});
