const express = require("express");
const path = require("path");
let app = express();
let port = process.env.port || 8091;

const database = require("./database.js");
const dir = path.join("./");
app.use(express.static(dir));

const getAllQuery = "SELECT * FROM financials;";

app.listen(port, async function () {
  console.log("Backend server started in port: " + port);

  await database.startDB();

  await database.client.query(getAllQuery, (error, response) => {
    console.log("\nGot fiancials");
    if (error) throw error.stack;
    const rows = response.rowCount;

    for (var i = 0; i < rows; i++) {
      console.log(response.rows[i]);
    }
  });
});

app.get("/health", async function (req, res) {
  console.log("Frontend requesting health");
  res.status(200);
  res.send("OK");
});

//Financial table: id, investement, amount, sum, created_at, updated_at
app.get("/get-financials", async function (req, res) {
  console.log("Should get financials");

  await database.client.query(getAllQuery, (error, response) => {
    console.log("\nGot fiancials");
    if (error) throw error.stack;
    const rows = response.rowCount;
    let financials = [];

    for (var i = 0; i < rows; i++) {
      financials.push({
        id: response.rows[i].id,
        investement: response.rows[i].investement,
        amount: response.rows[i].amount,
        sum: response.rows[i].sum,
        created_at: response.rows[i].created_at,
        updated_at: response.rows[i].updated_at,
      });
    }

    console.log("Returning financials");
    res.send(JSON.stringify(financials));
  });
});

console.log("-------------\n\n");
