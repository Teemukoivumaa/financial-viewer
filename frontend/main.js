const getFinancials = async () => {
  try {
    const response = await fetch("/get-financials");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getCategories = async (financials) => {
  let categories = [];
  financials.forEach((financial) => {
    const category =
      financial.investement_type.charAt(0).toUpperCase() +
      financial.investement_type.slice(1);

    if (!categories.includes(category)) {
      categories.push(category);
    }
  });

  return categories;
};

let totalSum = 0;
let totalChange = 0;

async function createFinancialsList() {
  let financials = await getFinancials();

  if (financials) {
    var financialsList = document.getElementById("financials-list");
    financialsList.innerHTML = "";

    const categories = await getCategories(financials);

    for (let category of categories) {
      totalSum = 0;
      totalChange = 0;

      var categoryDiv = document.createElement("div");
      var categoryHeader = document.createElement("h2");
      categoryHeader.innerHTML = category;
      categoryDiv.appendChild(categoryHeader);
      financialsList.appendChild(categoryDiv);

      // Create a HTML table to display the financials
      var table = document.createElement("table");
      table.setAttribute("id", "financials-table");

      // Create table header
      var tableHeader = document.createElement("thead");
      var tableFooter = document.createElement("tfoot");

      var tableHeaderRow = document.createElement("tr");
      var tableHeaderId = document.createElement("th");
      var tableHeaderName = document.createElement("th");
      var tableHeaderAmount = document.createElement("th");
      var tableHeaderSum = document.createElement("th");
      var tableHeaderCourse = document.createElement("th");
      var tableHeaderDelete = document.createElement("th");
      var tableHeaderTicker = document.createElement("th");
      var tableHeaderPrice = document.createElement("th");
      var tableHeaderChange = document.createElement("th");

      tableHeaderRow.setAttribute("class", "header-row");

      tableHeaderId.innerHTML = "ID";
      tableHeaderName.innerHTML = "Name";
      tableHeaderAmount.innerHTML = "Amount";
      tableHeaderSum.innerHTML = "Price";
      tableHeaderCourse.innerHTML = "Median Course";
      tableHeaderDelete.innerHTML = "";
      tableHeaderTicker.innerHTML = "Ticker";
      tableHeaderPrice.innerHTML = "Current course";
      tableHeaderChange.innerHTML = "Change";

      tableHeaderRow.appendChild(tableHeaderId);
      tableHeaderRow.appendChild(tableHeaderName);
      tableHeaderRow.appendChild(tableHeaderAmount);
      tableHeaderRow.appendChild(tableHeaderSum);
      tableHeaderRow.appendChild(tableHeaderCourse);
      tableHeaderRow.appendChild(tableHeaderTicker);
      tableHeaderRow.appendChild(tableHeaderPrice);
      tableHeaderRow.appendChild(tableHeaderChange);
      tableHeaderRow.appendChild(tableHeaderDelete);

      tableHeader.appendChild(tableHeaderRow);
      table.appendChild(tableHeader);

      // Create table body
      var tableBody = document.createElement("tbody");

      const loader = document.createElement("div");
      loader.setAttribute("class", "lds-dual-ring");
      financialsList.appendChild(loader);

      // Create table rows with these values id, investement_type, investement_name, investement_amount, investement_course, sum, currency, created_at, updated_at
      for (let financial of financials) {
        if (
          financial.investement_type.toLowerCase() != category.toLowerCase()
        ) {
          continue;
        }

        var tableRow = document.createElement("tr");
        var tableRowId = document.createElement("td");
        var tableRowName = document.createElement("td");
        var tableRowAmount = document.createElement("td");
        var tableRowSum = document.createElement("td");
        var tableRowCourse = document.createElement("td");
        var tableRowTicker = document.createElement("td");
        var tableRowPrice = document.createElement("td");
        var tableRowChange = document.createElement("td");
        var tableRowDelete = document.createElement("td");

        tableRowDelete.onclick = function () {
          deleteFinancial(financial.id);
        };

        tableRowId.innerHTML = financial.id;
        tableRowName.innerHTML = financial.investement_name;
        tableRowAmount.innerHTML = financial.investement_amount;
        tableRowSum.innerHTML = `${financial.sum} ${financial.currency}`;
        tableRowCourse.innerHTML = `${financial.investement_course} ${financial.currency}`;
        tableRowDelete.innerHTML = "Delete 🗑️🔥";
        tableRowDelete.setAttribute("class", "delete-button");

        tableRow.appendChild(tableRowId);
        tableRow.appendChild(tableRowName);
        tableRow.appendChild(tableRowAmount);
        tableRow.appendChild(tableRowSum);
        tableRow.appendChild(tableRowCourse);
        tableRow.appendChild(tableRowTicker);
        tableRow.appendChild(tableRowPrice);
        tableRow.appendChild(tableRowChange);

        var ticker = financial.stock_ticker ? financial.stock_ticker : "";

        if (ticker && ticker != "undefined") {
          tableRowTicker.innerHTML = ticker;

          await getTickerData(
            ticker,
            tableRowPrice,
            tableRowChange,
            financial,
            category
          );
        } else {
          ticker = await getTicker(financial.investement_name);

          if (ticker && ticker != "N/A") {
            tableRowTicker.innerHTML = ticker;

            await getTickerData(
              ticker,
              tableRowPrice,
              tableRowChange,
              financial,
              category
            );
          } else {
            tableRowTicker.innerHTML = "No ticker found 🤷‍♂️";
            tableRowPrice.innerHTML = "N/A";
            tableRowChange.innerHTML = "N/A";
          }
        }

        tableRow.appendChild(tableRowDelete);
        tableBody.appendChild(tableRow);
      }

      financialsList.removeChild(loader);
      loader.setAttribute("class", "lds-dual-ring");

      table.appendChild(tableBody);

      // Create table footer
      var tableFooterRow = document.createElement("tr");

      var tableFooterId = document.createElement("th");
      var tableFooterName = document.createElement("th");
      var tableFooterAmount = document.createElement("th");
      var tableFooterSum = document.createElement("th");
      var tableFooterCourse = document.createElement("th");
      var tableFooterTicker = document.createElement("th");
      var tableFooterPrice = document.createElement("th");
      var tableFooterChange = document.createElement("th");
      var tableFooterDelete = document.createElement("th");

      tableFooterRow.setAttribute("class", "footer-row");

      tableFooterId.innerHTML = "Total";
      tableFooterName.innerHTML = "";
      tableFooterAmount.innerHTML = "";
      tableFooterSum.innerHTML = `${totalSum.toFixed(2)} €`;
      tableFooterCourse.innerHTML = "";
      tableFooterDelete.innerHTML = "";
      tableFooterTicker.innerHTML = "";
      tableFooterChange.innerHTML = `${totalChange.toFixed(2)} €`;
      tableFooterPrice.innerHTML = "";

      tableFooterRow.appendChild(tableFooterId);
      tableFooterRow.appendChild(tableFooterName);
      tableFooterRow.appendChild(tableFooterAmount);
      tableFooterRow.appendChild(tableFooterSum);
      tableFooterRow.appendChild(tableFooterCourse);
      tableFooterRow.appendChild(tableFooterDelete);
      tableFooterRow.appendChild(tableFooterTicker);
      tableFooterRow.appendChild(tableFooterChange);
      tableFooterRow.appendChild(tableFooterPrice);

      tableFooter.appendChild(tableFooterRow);

      table.appendChild(tableFooter);

      financialsList.appendChild(table);
    }
  }
}

const addFinancial = async () => {
  if (document.getElementById("investement_amount").value < 0) {
    alert("Amount must be positive");
    return;
  }

  let financial = {
    investement_type: document.getElementById("investement_type").value,
    investement_name: document.getElementById("search").value,
    investement_amount: document.getElementById("investement_amount").value,
    investement_course: document.getElementById("investement_course").value,
    investement_sum: document.getElementById("investement_sum").value,
    investement_currency: document.getElementById("investement_currency").value,
    investement_ticker: document.getElementById("investement_ticker").value,
  };

  try {
    const response = await fetch("/add-financial", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ financial }),
    });

    if (response.status == 200) {
      createFinancialsList();
    } else {
      alert(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteFinancial = async (id) => {
  try {
    const response = await fetch(`/delete-financial`, {
      method: "DELETE",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ financialID: id }),
    });

    if (response.status == 200) {
      createFinancialsList();
    } else {
      alert(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

const getFinancialPrice = async (ticker) => {
  try {
    const response = await fetch(`stock/${ticker}`, {
      method: "PUT",
      mode: "cors",
    });

    if (response.status == 200) {
      const data = await response.json();
      const price = data.currentPrice ? data.currentPrice : "N/A";
      const currency = data.currency ? data.currency : "N/A";

      return { price: price, currency: currency };
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getFundPrice = async (ticker) => {
  try {
    const response = await fetch(`fund/${ticker}`, {
      method: "PUT",
      mode: "cors",
    });

    if (response.status == 200) {
      const data = await response.json();
      const price = data.currentPrice ? data.currentPrice : "N/A";
      const currency = data.currency ? data.currency : "N/A";

      return { price: price, currency: currency };
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getTicker = async (investement_name) => {
  try {
    const response = await fetch(`search/${investement_name}/1`, {
      method: "GET",
      mode: "cors",
    });

    if (response.status == 200) {
      const data = await response.json();
      const ticker = data.symbols[0];

      return ticker ? ticker : "N/A";
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getTickerData = async (
  ticker,
  tableRowPrice,
  tableRowChange,
  financial,
  category
) => {
  if (category.toLowerCase() == "osake") {
    var tickerData = await getFinancialPrice(ticker);
  } else if (category.toLowerCase() == "rahasto") {
    var tickerData = await getFundPrice(ticker);
  }

  if (tickerData.currency === undefined || tickerData.price === undefined)
    return null;

  tableRowPrice.innerHTML = await formatCurrency(
    tickerData.currency,
    tickerData.price
  );

  tableRowChange.innerHTML = await getFinancialChange(
    tickerData.price,
    financial.investement_amount,
    financial.investement_course,
    tickerData.currency,
    tableRowChange
  );
};

const formatCurrency = async (currency, price) => {
  const options = { style: "currency", currency: currency };
  return new Intl.NumberFormat(getLang(), options).format(price);
};

const getFinancialChange = async (
  currentPrice,
  amount,
  course,
  currency,
  tableRowChange
) => {
  const currentPriceNumber = Number(currentPrice);
  const amountNumber = Number(amount);
  const courseNumber = Number(course);

  const currentSum = currentPriceNumber * amountNumber;
  const original = courseNumber * amountNumber;

  let prefix = "";
  let changePercentage = (currentSum / original) * 100;

  if (changePercentage < 100) {
    changePercentage = changePercentage - 100;
    tableRowChange.setAttribute("class", "negative-change");
  } else {
    prefix = "+";
    changePercentage = changePercentage - 100;
    tableRowChange.setAttribute("class", "positive-change");
  }

  let currentSumFormatted = "";

  if (currency == "EUR") {
    totalSum += original;
    totalChange += currentSum - original;
    currentSumFormatted = await formatCurrency(currency, currentSum - original);
  } else {
    let convertedOriginal = await convertCurrency(currency, original);
    let convertedSum = await convertCurrency(currency, currentSum);

    totalSum += convertedOriginal;
    totalChange += convertedSum - convertedOriginal;
    currentSumFormatted = await formatCurrency(
      "EUR",
      convertedSum - convertedOriginal
    );
  }

  return `${prefix}${currentSumFormatted} (${changePercentage.toFixed(2)}%)`;
};

const convertCurrency = async (currency, amount) => {
  const response = await fetch(`/convert/${currency}`, {
    method: "GET",
    mode: "cors",
  });

  if (response.status == 200) {
    const data = await response.json();
    const rate = data.rate ? data.rate : "N/A";
    return amount / rate;
  } else {
    const data = await response.text();
    return data;
  }
};

const getLang = () =>
  navigator.language ||
  navigator.browserLanguage ||
  (navigator.languages || ["en"])[0];

const resetForm = () => {
  document.getElementById("investement_name").value = "";
  document.getElementById("investement_amount").value = "0";
  document.getElementById("investement_course").value = "1";
  document.getElementById("investement_sum").value = "1";
  document.getElementById("investement_ticker").value = "";
};

const searchFinancialNames = async (name) => {
  try {
    const response = await fetch(`search/${name}/20`, {
      method: "GET",
      mode: "cors",
    });

    if (response.status == 200) {
      const data = await response.json();

      return data ? data : "N/A";
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const createFinancialForm = () => {
  let investement_type = document.getElementById("investement_type");

  let type = "Rahasto";

  if (investement_type != null) {
    type = investement_type.value;
  }

  let financialsForm = document.getElementById("financial-form");
  financialsForm.innerHTML = "";

  // Create a HTML table to display the financial form
  var table = document.createElement("table");
  table.setAttribute("id", "financials-table");
  table.setAttribute("class", "financial-form");

  // Create table header
  var tableHeader = document.createElement("thead");
  var tableHeaderRow = document.createElement("tr");
  tableHeaderRow.setAttribute("class", "financial-form");

  var tableHeaderType = document.createElement("th");
  var tableHeaderAmount = document.createElement("th");
  var tableHeaderCourse = document.createElement("th");
  var tableHeaderSum = document.createElement("th");
  var tableHeaderCurrency = document.createElement("th");
  var tableHeaderTicker = document.createElement("th");

  tableHeaderType.innerHTML = "Type";
  tableHeaderAmount.innerHTML = "Amount";
  tableHeaderCourse.innerHTML = "Median Course";
  tableHeaderSum.innerHTML = "Sum";
  tableHeaderCurrency.innerHTML = "Currency";
  tableHeaderTicker.innerHTML = "Ticker";

  tableHeaderRow.appendChild(tableHeaderType);
  tableHeaderRow.appendChild(tableHeaderAmount);
  tableHeaderRow.appendChild(tableHeaderCourse);
  tableHeaderRow.appendChild(tableHeaderSum);
  tableHeaderRow.appendChild(tableHeaderCurrency);
  tableHeaderRow.appendChild(tableHeaderTicker);

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  // Create table body
  var tableBody = document.createElement("tbody");
  var tableBodyRow = document.createElement("tr");
  tableBodyRow.setAttribute("class", "financial-form");

  var tableBodyType = document.createElement("td");
  var tableBodyAmount = document.createElement("td");
  var tableBodyCourse = document.createElement("td");
  var tableBodySum = document.createElement("td");
  var tableBodyCurrency = document.createElement("td");
  var tableBodyTicker = document.createElement("td");

  tableBodyType.innerHTML = `<select
    name="investement_type"
    id="investement_type"
    onchange="createFinancialForm()"
  >
    <option value="rahasto" ${
      type == "rahasto" ? "selected" : ""
    }>Rahasto</option>
    <option value="osake" ${type == "osake" ? "selected" : ""}>Osake</option>
  </select>`;

  tableBodyAmount.innerHTML = `<input type="number"
    id="investement_amount"
    name="investement_amount"
    min="0"
    value="0"
    oninput="calculateSum()"
    required 
  />`;
  tableBodyCourse.innerHTML = `<input type="number"
    id="investement_course"
    name="investement_course"
    min="1"
    value="1"
    oninput="calculateSum()"
    required 
  />`;
  tableBodySum.innerHTML = `<input type="number"
    id="investement_sum"
    name="sum"
    min="1"
    value="1"
    oninput="calculateCourse()"
    required  
  />`;
  tableBodyCurrency.innerHTML = `<select
    name="investement_currency"
    id="investement_currency"
  >
    <option value="EUR">EUR</option>
    <option value="USD">USD</option>
    <option value="SEK">SEK</option>
    <option value="NOK">NOK</option>
  </select>`;
  tableBodyTicker.innerHTML = `<input type="text" id="investement_ticker" placeholder="Ticker" />`;

  tableBodyRow.appendChild(tableBodyType);
  tableBodyRow.appendChild(tableBodyAmount);
  tableBodyRow.appendChild(tableBodyCourse);
  tableBodyRow.appendChild(tableBodySum);
  tableBodyRow.appendChild(tableBodyCurrency);
  tableBodyRow.appendChild(tableBodyTicker);

  tableBody.appendChild(tableBodyRow);
  table.appendChild(tableBody);
  financialsForm.appendChild(table);
};

const getSearchNames = async () => {
  const investement_name = document.getElementById("search").value;
  const search = document.getElementById("search_box");
  const box = document.getElementById("result_box");

  if (investement_name.length > 1) {
    const results = await searchFinancialNames(investement_name);
    box.innerHTML = "";

    const resultLength = results.symbols.length;

    if (resultLength == 0) {
      return;
    }

    search.classList.add("active");

    for (let i = 0; i < resultLength; i++) {
      const div = document.createElement("div");
      div.setAttribute("class", "result");
      div.innerHTML =
        "<li>" + results.shortNames[i] + " (" + results.symbols[i] + ")</li>";
      div.addEventListener("click", () => {
        document.getElementById("search").value = results.shortNames[i];
        document.getElementById("investement_ticker").value =
          results.symbols[i];
        box.innerHTML = "";
        search.classList.remove("active");
      });
      box.appendChild(div);
    }
  } else {
    search.classList.remove("active");
    box.innerHTML = "";
  }
};

const calculateCourse = () => {
  let investement_amount = document.getElementById("investement_amount").value;
  let investement_sum = document.getElementById("investement_sum").value;
  let investement_course = document.getElementById("investement_course");

  let course = investement_sum / investement_amount;
  investement_course.value = course.toFixed(3);
};

const calculateSum = () => {
  let investement_amount = document.getElementById("investement_amount").value;
  let investement_course = document.getElementById("investement_course").value;
  let investement_sum = document.getElementById("investement_sum");

  let sum = investement_amount * investement_course;
  investement_sum.value = sum.toFixed(2);
};
