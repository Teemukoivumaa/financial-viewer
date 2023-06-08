const express = require("express");
const router = express.Router();
const database = require("./database.js");

const deleteFinancial = router.delete(
  "/:financialID",
  async function (req, res) {
    console.log("Should delete financial with id: " + req.params.financialID);
    await database.deleteFinancial(req.params.financialID, res);
  }
);

module.exports = { deleteFinancial };
