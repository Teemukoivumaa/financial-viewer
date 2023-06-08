const getFinancials = async () => {
  try {
    const response = await fetch("/get-financials");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
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

async function createFinancialsList() {
  let financials = await getFinancials();

  if (financials) {
    var financialsList = document.getElementById("financials-list");
    financialsList.innerHTML = "";

    const categories = await getCategories(financials);

    for (let category of categories) {
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
      var tableHeaderRow = document.createElement("tr");
      var tableHeaderId = document.createElement("th");
      var tableHeaderName = document.createElement("th");
      var tableHeaderAmount = document.createElement("th");
      var tableHeaderSum = document.createElement("th");
      var tableHeaderCourse = document.createElement("th");
      var tableHeaderDelete = document.createElement("th");

      tableHeaderRow.setAttribute("class", "header-row");

      tableHeaderId.innerHTML = "ID";
      tableHeaderName.innerHTML = "Name";
      tableHeaderAmount.innerHTML = "Amount";
      tableHeaderSum.innerHTML = "Sum";
      tableHeaderCourse.innerHTML = "Course";
      tableHeaderDelete.innerHTML = "";

      tableHeaderRow.appendChild(tableHeaderId);
      tableHeaderRow.appendChild(tableHeaderName);
      tableHeaderRow.appendChild(tableHeaderAmount);
      tableHeaderRow.appendChild(tableHeaderSum);
      tableHeaderRow.appendChild(tableHeaderCourse);

      if (category.toLowerCase() == "osake") {
        var tableHeaderTicker = document.createElement("th");
        tableHeaderTicker.innerHTML = "Ticker";
        tableHeaderRow.appendChild(tableHeaderTicker);
      }

      tableHeaderRow.appendChild(tableHeaderDelete);
      tableHeader.appendChild(tableHeaderRow);
      table.appendChild(tableHeader);

      // Create table body
      var tableBody = document.createElement("tbody");

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
        var tableRowDelete = document.createElement("td");

        tableRowDelete.onclick = function () {
          deleteFinancial(financial.id);
        };

        tableRowId.innerHTML = financial.id;
        tableRowName.innerHTML = financial.investement_name;
        tableRowAmount.innerHTML = financial.investement_amount;
        tableRowSum.innerHTML = `${financial.sum} ${financial.currency}`;
        tableRowCourse.innerHTML = financial.investement_course;
        tableRowDelete.innerHTML = "Delete 🗑️🔥";
        tableRowDelete.setAttribute("class", "delete-button");

        tableRow.appendChild(tableRowId);
        tableRow.appendChild(tableRowName);
        tableRow.appendChild(tableRowAmount);
        tableRow.appendChild(tableRowSum);
        tableRow.appendChild(tableRowCourse);

        if (category.toLowerCase() == "osake") {
          var tableRowTicker = document.createElement("td");
          tableRowTicker.innerHTML = financial.stock_ticker
            ? financial.stock_ticker
            : "";
          tableRow.appendChild(tableRowTicker);
        }

        tableRow.appendChild(tableRowDelete);
        tableBody.appendChild(tableRow);
      }

      table.appendChild(tableBody);

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
    investement_name: document.getElementById("investement_name").value,
    investement_amount: document.getElementById("investement_amount").value,
    investement_course: document.getElementById("investement_course").value,
    investement_sum: document.getElementById("investement_sum").value,
  };

  if (financial.investement_type == "osake") {
    financial.investement_ticker =
      document.getElementById("investement_ticker").value;
  }

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
    console.log(error);
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
    console.log(error);
  }
};

const resetForm = () => {
  document.getElementById("investement_name").value = "";
  document.getElementById("investement_amount").value = "0";
  document.getElementById("investement_course").value = "1";
  document.getElementById("investement_sum").value = "1";
  document.getElementById("investement_ticker").value = "";
};

const createFinancialForm = () => {
  let investement_type = document.getElementById("investement_type");

  let ticker = false;
  let type = "Rahasto";

  if (investement_type != null) {
    type = investement_type.value;
  }

  if (investement_type != null && type.toLowerCase() == "osake") ticker = true;

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
  var tableHeaderName = document.createElement("th");
  var tableHeaderAmount = document.createElement("th");
  var tableHeaderCourse = document.createElement("th");
  var tableHeaderSum = document.createElement("th");

  tableHeaderType.innerHTML = "Type";
  tableHeaderName.innerHTML = "Name";
  tableHeaderAmount.innerHTML = "Amount";
  tableHeaderCourse.innerHTML = "Course";
  tableHeaderSum.innerHTML = "Sum";

  tableHeaderRow.appendChild(tableHeaderType);
  tableHeaderRow.appendChild(tableHeaderName);
  tableHeaderRow.appendChild(tableHeaderAmount);
  tableHeaderRow.appendChild(tableHeaderCourse);
  tableHeaderRow.appendChild(tableHeaderSum);

  if (ticker) {
    var tableHeaderTicker = document.createElement("th");
    tableHeaderTicker.innerHTML = "Ticker";
    tableHeaderRow.appendChild(tableHeaderTicker);
  }

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  // Create table body
  var tableBody = document.createElement("tbody");
  var tableBodyRow = document.createElement("tr");
  tableBodyRow.setAttribute("class", "financial-form");

  var tableBodyType = document.createElement("td");
  var tableBodyName = document.createElement("td");
  var tableBodyAmount = document.createElement("td");
  var tableBodyCourse = document.createElement("td");
  var tableBodySum = document.createElement("td");

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
  tableBodyType.value = type;

  tableBodyName.innerHTML = `<input type="text"
    id="investement_name"
    name="investement_name"
    required 
  />`;
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

  tableBodyRow.appendChild(tableBodyType);
  tableBodyRow.appendChild(tableBodyName);
  tableBodyRow.appendChild(tableBodyAmount);
  tableBodyRow.appendChild(tableBodyCourse);
  tableBodyRow.appendChild(tableBodySum);

  if (ticker) {
    var tableBodyTicker = document.createElement("td");
    tableBodyTicker.innerHTML = `<input type="text" id="investement_ticker" placeholder="Ticker" />`;
    tableBodyRow.appendChild(tableBodyTicker);
  }

  tableBody.appendChild(tableBodyRow);
  table.appendChild(tableBody);
  financialsForm.appendChild(table);
};

const calculateCourse = () => {
  let investement_amount = document.getElementById("investement_amount").value;
  let investement_sum = document.getElementById("investement_sum").value;
  let investement_course = document.getElementById("investement_course");

  let course = investement_sum / investement_amount;
  investement_course.value = course;
};

const calculateSum = () => {
  let investement_amount = document.getElementById("investement_amount").value;
  let investement_course = document.getElementById("investement_course").value;
  let investement_sum = document.getElementById("investement_sum");

  let sum = investement_amount * investement_course;
  investement_sum.value = sum;
};
