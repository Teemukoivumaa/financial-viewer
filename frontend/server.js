const express = require("express");
const path = require("path");
const axios = require("axios");

let app = express();

let port = process.env.port || 8090;
let backendPort = process.env.backendport || 8091;
const debug = process.env.DEBUG || false;

const dir = path.join("./");
app.use(express.static(dir));
app.use(express.json());

app.get("/", async function (req, res) {
  console.log("Site pinged");

  res.sendFile(path.join(__dirname, "main.html"));
});

app.get("/get-financials", async function (req, res) {
  console.log("Getting financials");
  const respose = await axios.get(
    `http://backend:${backendPort}/get-financials`
  );
  console.log("Returning info to client");

  res.send(JSON.stringify(respose.data));
});

app.post("/add-financial", async function (req, res) {
  console.log("Adding financial");
  console.log(req.body.financial);
  const respose = await axios.post(
    `http://backend:${backendPort}/add-financial`,
    {
      financial: req.body.financial,
    }
  );

  if (respose.status == 200) {
    res.status(200);
    res.send("OK");
  } else {
    res.status(500);
    res.send(respose);
  }
});

app.delete("/delete-financial", async function (req, res) {
  console.log("Deleting financial");

  var fiancialID = JSON.parse(req.body.financialID);
  console.log(fiancialID);
  if (fiancialID && fiancialID != null) {
    const response = await axios.delete(
      `http://backend:${backendPort}/delete-financial/${fiancialID}`
    );

    if (response.status == 200) {
      res.status(200);
      res.send("OK");
    } else {
      res.status(500);
      res.send("NOT OK");
    }
  } else {
    res.status(500);
    res.send("NOT OK");
  }
});

app.listen(port, async function () {
  console.log("Server started in port: " + port);
  await checkBackend();
});

async function checkBackend() {
  console.log("Checking if backend is up in port: " + backendPort);
  for (let index = 0; index < 10; index++) {
    const response = await axios.get(`http://backend:${backendPort}/health`);

    if (debug) console.log(response.status);

    if (response.status == 200) {
      console.log("Backend ok!");
      return 0;
    } else {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

console.log("-------------\n\n");
