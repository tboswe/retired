//Imports
//import * as bootstrap from 'bootstrap'

//user object
const user = {
  //present
  name: getCookie('userName'),
  age: getCookie('current-age'),
  grossIncome: getCookie('gross-income'),
  //future
  retirementAge: getCookie('retirement-age'),
  projectionAge: getCookie('projection-age'),
};

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}

//save
function saveUserData(element){

  setCookie('userName', document.getElementById('nameMe').value, 7);
}


//Questionaire
function adultDropdownChange(element){
  let dropdownButton = document.getElementById('adultDropdownMenuButton');
  dropdownButton.textContent = element.textContent;
  
  // Retrieve user data
  const userName = getCookie('userName');
  console.log(userName);
  justMeQuestions();
};

function justMeQuestions(){
  const justMeContainer = document.createElement('div');
  justMeContainer.className = 'container py-5';

  justMeContainer.innerHTML = `
    <form id="retirement-form">
      <!-- Questionaire -->
      <div class="row align-items-end mb-3">
        <div class="col-md-2">
          <label for="nameMe" class="form-label">Name</label>
          <input type="text" class="form-control" id="nameMe" maxlength="20" pattern="[A-Za-z]+" title="Only letters are allowed, up to 20 characters" onChange="saveUserData()" required>
        </div>
        <div class="col-sm-2">
          <label for="current-age" class="form-label">Current Age</label>
          <input type="number" class="form-control" id="current-age" min="18" max="100" onChange="saveUserData(this)" required>
        </div>
        <div class="col-sm-2">
          <label for="retirement-age" class="form-label">Retirement Age</label>
          <input type="number" class="form-control" id="retirement-age" min="18" max="100" value="55" onChange="saveUserData(this)" required>
        </div>
        <div class="col-sm-2">
          <label for="projection-age" class="form-label">Projection Age</label>
          <input type="number" class="form-control" id="projection-age" min="18" max="100" value="100" onChange="saveUserData(this)" required>
        </div>

    </form>
  `;

  document.body.appendChild(justMeContainer);
}
/*
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new bootstrap.Popover(popover)
  })

 let incomeForecast = (e) => {
    // Sample data for the table
    const data = [
      { year: 2025, age: 30, income: 50000, savings: 10000 },
      { year: 2026, age: 31, income: 52000, savings: 15000 },
      { year: 2027, age: 32, income: 54000, savings: 20000 },
    ];

    // Generate the table
    const tableContainer = document.getElementById("table-container");
    const table = document.createElement("table");
    table.className = "table table-striped table-bordered";

    // Create the table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Year</th>
        <th>Age</th>
        <th>Income</th>
        <th>Savings</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");
    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.year}</td>
        <td>${row.age}</td>
        <td>${row.income}</td>
        <td>${row.savings}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Append the table to the container
    tableContainer.appendChild(table);
  };*/