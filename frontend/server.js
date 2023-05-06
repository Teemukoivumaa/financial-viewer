const express = require("express");
const path = require("path");
const axios = require("axios");
let app = express();
let port = process.env.port || 8090;
let backendPort = process.env.backendport || 8091;

const dir = path.join("./");
app.use(express.static(dir));

app.get("/", async function (req, res) {
  console.log("Site pinged");

  res.sendFile(path.join(__dirname, "main.html"));
});

app.get("/get", async function (req, res) {
  console.log("Pinging backend");
  const respose = await axios.get("http://backend:8081/get-financials");
  console.log("Returning info to client");
  res.send(JSON.stringify(respose.data));
});

app.listen(port, async function () {
  console.log("Server started in port: " + port);
  await checkBackend();
});

async function checkBackend() {
  console.log("Checking if backend is up in port: " + backendPort);
  for (let index = 0; index < 10; index++) {
    const response = await axios.get(`http://backend:${backendPort}/health`);

    console.log(response.status);
    if (response.status == 200) {
      console.log("Backend ok!");
      return 0;
    } else {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

console.log("-------------\n\n");
