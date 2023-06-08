const express = require("express");
const path = require("path");
let app = express();
let port = process.env.port || 8091;

const database = require("./database.js");
let databaseUp = false;

const routes = require("./router.js");

const dir = path.join("./");
app.use(express.static(dir));
app.use(express.json());

app.listen(port, async function () {
  console.log("Backend server started in port: " + port);
});

app.get("/health", async function (req, res) {
  console.log("Frontend requesting health");

  for (let index = 0; index < 10; index++) {
    databaseUp = await database.checkDatabase();
    if (databaseUp == true) {
      console.log("Database up");
      return;
    } else {
      console.log("Database not up yet");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  res.status(200);
  res.send("OK");
});

//Financial table: id, investement_type, investement_name, investement_amount, investement_course, sum, currency, created_at, updated_at
app.get("/get-financials", async function (req, res) {
  console.log("Should get financials");
  await database.getAllFinancials(res);
});

app.post("/add-financial", async function (req, res) {
  console.log("Should add financial");
  await database.addFinancial(req, res);
});

app.use("/delete-financial", routes.deleteFinancial);

console.log("-------------\n\n");
