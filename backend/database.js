const { Pool } = require("pg");

const debug = process.env.DEBUG || false;

if (debug) {
  console.debug("Debug mode on");
  console.debug("POSTGRES_USER: " + process.env.POSTGRES_USER);
  console.debug("POSTGRES_DB: " + process.env.POSTGRES_DB);
  console.debug("POSTGRES_PASSWORD: " + process.env.POSTGRES_PASSWORD);
}

let pool = new Pool({
  host: "database",
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

async function queryDB(query) {
  console.log("Querying database");
  const client = await pool.connect();
  try {
    await client.query(query);
    client.release();
    return true;
  } catch (e) {
    console.log(e.stack);
    client.release();
    return false;
  }
}

async function checkDatabase() {
  let connected = false;

  for (let index = 0; index < 10; index++) {
    let client;
    try {
      console.log("Trying to connect to database...");
      client = await pool.connect();
      console.log("Connected to database");
      connected = true;
    } catch (error) {
      if (debug) console.debug(error.stack);
      console.log("Couldn't connect to database");
    }

    client.release();

    if (connected == true) {
      if (debug) console.debug(connected);
      return true;
    } else {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  if (connected == false) {
    console.log("Failed to connect to database, limit reached");
    process.exit(1);
  } else {
    console.log("Connected to database");
  }

  return true;
}

async function getAllFinancials(res) {
  console.log("Getting all financials");
  const getAllQuery = "SELECT * FROM financials;";
  let financials = [];

  const client = await pool.connect();

  await client.query(getAllQuery, (error, response) => {
    console.log("\nGot fiancials");
    if (error) throw error.stack;
    const rows = response.rowCount;

    if (debug) console.debug("Rows: " + rows);

    // Get all financials from rows and push them to financials array
    for (let index = 0; index < rows; index++) {
      let financial = {
        id: response.rows[index].id,
        investement_type: response.rows[index].investement_type,
        investement_name: response.rows[index].investement_name,
        investement_amount: response.rows[index].investement_amount,
        investement_course: response.rows[index].investement_course,
        sum: response.rows[index].sum,
        currency: response.rows[index].currency,
        stock_ticker: response.rows[index].stock_ticker
          ? response.rows[index].stock_ticker
          : null,
        created_at: response.rows[index].created_at,
        updated_at: response.rows[index].updated_at,
      };

      financials.push(financial);
    }

    res.send(JSON.stringify(financials));
  });

  client.release();
}

async function addFinancial(req, res) {
  console.log("Adding financial");
  const addFinancialQuery =
    "INSERT INTO financials (investement_type, investement_name, investement_amount, investement_course, sum, currency, stock_ticker) VALUES ('" +
    req.body.financial.investement_type +
    "', '" +
    req.body.financial.investement_name +
    "', '" +
    req.body.financial.investement_amount +
    "', '" +
    req.body.financial.investement_course +
    "', '" +
    req.body.financial.investement_sum +
    "', '" +
    "€" +
    "', '" +
    req.body.financial.investement_ticker +
    "');";

  console.log(addFinancialQuery);
  const client = await pool.connect();

  await client.query(addFinancialQuery, (error, response) => {
    console.log("\nAdded fiancial");
    if (error) {
      res.status(500);
      res.send("Failed to add financial to database");
      throw error.stack;
    }

    res.status(200);
    res.send("OK");
  });

  client.release();
}

async function deleteFinancial(financialID, res) {
  console.log("Deleting financial");
  const deleteFinancialQuery =
    "DELETE FROM financials WHERE id = '" + financialID + "';";
  console.log(deleteFinancialQuery);
  const client = await pool.connect();

  await client.query(deleteFinancialQuery, (error, response) => {
    console.log("\nDeleted fiancial");
    if (error) {
      res.status(500);
      res.send("Failed to delete financial from database");
      throw error.stack;
    }

    res.status(200);
    res.send("OK");
  });

  client.release();
}

module.exports = {
  queryDB,
  pool,
  checkDatabase,
  getAllFinancials,
  addFinancial,
  deleteFinancial,
};
