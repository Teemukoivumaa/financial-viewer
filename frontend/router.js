const express = require("express");
const axios = require("axios");

const router1 = express.Router();
const router2 = express.Router();
const router3 = express.Router();
const router4 = express.Router();

const getStockData = router1.put("/:stockTicker", async function (req, res) {
  console.log("Getting stock ticker data for: " + req.params.stockTicker);
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${req.params.stockTicker}`,
      {
        params: {
          modules: "financialData",
        },
      }
    );

    if (response.status == 200) {
      const financialData = {
        currentPrice:
          response.data.quoteSummary.result[0].financialData.currentPrice.fmt,
        currency:
          response.data.quoteSummary.result[0].financialData.financialCurrency,
      };

      res.status(response.status);
      res.send(financialData);
    } else {
      res.status(response.status);
      res.send("N/A");
    }
  } catch (error) {
    res.status(404);
    res.send("N/A");
  }
});

const getFundData = router2.put("/:fundTicker", async function (req, res) {
  console.log("Getting fund ticker data for: " + req.params.fundTicker);
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${req.params.fundTicker}`,
      {
        params: {
          modules: "price",
        },
      }
    );

    if (response.status == 200) {
      const financialData = {
        currentPrice:
          response.data.quoteSummary.result[0].price.regularMarketPrice.raw,
        currency: response.data.quoteSummary.result[0].price.currency,
      };

      res.status(response.status);
      res.send(financialData);
    } else {
      res.status(response.status);
      res.send("N/A");
    }
  } catch (error) {
    res.status(404);
    res.send("N/A");
  }
});

const search = router3.get("/:financialName/:count", async function (req, res) {
  console.log("Searching ticker for: " + req.params.financialName);
  console.log("Search count:" + req.params.count);

  var count = req.params.count;
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search`,
      {
        params: {
          q: req.params.financialName,
        },
      }
    );

    if (response.status == 200) {
      const symbols = [];
      const shortNames = [];

      if (count > response.data.quotes.length)
        count = response.data.quotes.length;

      for (var i = 0; i < count; i++) {
        symbols.push(response.data.quotes[i].symbol);
        shortNames.push(response.data.quotes[i].longname);
      }

      res.status(response.status);
      res.send(JSON.stringify({ symbols: symbols, shortNames: shortNames }));
    } else {
      res.status(response.status);
      res.send("N/A");
    }
  } catch (error) {
    res.status(404);
    res.send("N/A");
  }
});

const convertCurrency = router4.get(
  "/:fromCurrency",
  async function (req, res) {
    console.log("Getting currency data for: " + req.params.fromCurrency);
    try {
      const response = await axios.get(
        `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/M.${req.params.fromCurrency}.EUR.SP00.A`,
        {
          params: {
            startPeriod: "2023-08",
            detail: "dataonly",
          },
        }
      );

      if (response.status == 200) {
        res.status(response.status);
        res.send({
          rate: JSON.stringify(
            response.data.dataSets[0].series["0:0:0:0:0"].observations["0"][0]
          ),
        });
      } else {
        res.status(response.status);
        res.send("N/A");
      }
    } catch (error) {
      res.status(404);
      res.send("N/A");
    }
  }
);

module.exports = { getStockData, getFundData, search, convertCurrency };
