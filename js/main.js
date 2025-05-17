//Imports
//import * as bootstrap from 'bootstrap'

//user object
const user = {
  //present
  name: getCookie('name-me'),
  age: getCookie('current-age'),
  grossIncome: getCookie('gross-income'),
  //future
  retirementAge: getCookie('retirement-age'),
  projectionAge: getCookie('projection-age'),
  //rates
  inflationRate: 0.03,
  investmentRate: 0.05,
  raiseRate: 0.03,
  indexationRate: 0.03,
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

  setCookie('name-me', document.getElementById('name-me').value, 7);
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
      <div class="row mb-3">
        <div class="col-sm-12">
          <h1 class="h4 mb-3">Personals</h1>
        </div>
      </div>
      
      <div class="row align-items-end mb-3" id="personals">
        <div class="col-md-2">
          <label for="name-me" class="form-label">Name</label>
          <input type="text" class="form-control" id="name-me" maxlength="20" pattern="[A-Za-z]+" title="Only letters are allowed, up to 20 characters" onChange="saveUserData()" required>
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
        <div class="col-sm-2">
          <label for="gross-income" class="form-label">Gross Income</label>
          <input type="number" class="form-control" id="gross-income" min="0" max="10000000" value="50000" step="1000" onChange="saveUserData(this)" required>
        </div>
        <div class="col-sm-2">
          <button type="button" id="toggle-lock" class="btn btn-outline-secondary btn-sm" onClick="toggleLock()">
            <i id="lock-icon" class="bi bi-lock"></i> Lock
          </button>
        </div>
      </div>
      <h1 class="h4 mb-3">Rates</h1>
      <div class="row align-items-end mb-3">
        <div class="col-sm-2">
          <label for="inflation-rate" class="form-label">Inflation Rate</label>
          <input type="number" class="form-control" id="inflation-rate" min="0" max="100" value="3" step="0.1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-sm-2">
          <label for="investment-rate" class="form-label ">Investment Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="5" step="0.1" onChange="saveUserData(this)" required>
        </div>

    </form>
  `;

  document.body.appendChild(justMeContainer);
}

function toggleLock() {
  const lockIcon = document.getElementById('lock-icon');
  const inputs = document.querySelectorAll('#retirement-form input');

  if (lockIcon.classList.contains('bi-lock')) {
    // Unlock: Make fields editable
    lockIcon.classList.remove('bi-lock');
    lockIcon.classList.add('bi-unlock');
    lockIcon.parentElement.textContent = ' Unlock';
    inputs.forEach(input => input.removeAttribute('readonly'));
  } else {
    // Lock: Make fields read-only
    lockIcon.classList.remove('bi-unlock');
    lockIcon.classList.add('bi-lock');
    lockIcon.parentElement.textContent = ' Lock';
    inputs.forEach(input => input.setAttribute('readonly', true));
  }
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