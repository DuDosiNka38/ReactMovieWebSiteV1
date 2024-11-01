const express = require("express");

const PORT = 8083;

const app = express();

app.use(express.json({ extended: true }));
app.use(require("cors")());

const infoRoutes = require("./routes/info");

app.use("/api/info/", infoRoutes);

// MongoApi.addHandler("users", require("./handlers/users"));

// app.use("/api/", MongoApi.listen);

async function App() {
  try {
    app.listen(PORT, function () {
      console.log(`Server listens on ${PORT}`);
    });
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}
App();
