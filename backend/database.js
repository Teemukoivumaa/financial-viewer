const password = "postgres";

const { Client } = require("pg");

var client = new Client({
  host: "db",
  user: "postgres",
  database: "postgres",
  password: password,
  port: 5432,
});

async function queryDB(query) {
  console.log("Querying database");
  try {
    await client.query(query);
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
}

async function startDB() {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error.stack);
    console.log("Couldn't connect to database");
    return false;
  }

  return true;
}

module.exports = {
  startDB,
  queryDB,
  client,
};
