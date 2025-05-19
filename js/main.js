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
        <div class="col-lg-2">
          <label for="name-me" class="form-label">Name</label>
          <input type="text" class="form-control" id="name-me" maxlength="20" pattern="[A-Za-z]+" title="Only letters are allowed, up to 20 characters" onChange="saveUserData()" required>
        </div>
        <div class="col-lg-1">
          <label for="current-age" class="form-label">Current Age</label>
          <input type="number" class="form-control" id="current-age" min="18" max="100" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="retirement-age" class="form-label">Retirement Age</label>
          <input type="number" class="form-control" id="retirement-age" min="18" max="100" value="55" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="projection-age" class="form-label">Projection Age</label>
          <input type="number" class="form-control" id="projection-age" min="18" max="100" value="100" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="gross-income" class="form-label">Gross Income</label>
          <input type="number" class="form-control" id="gross-income" min="0" max="10000000" value="50000" step="1000" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="income-raises-rate" class="form-label">Income Raise Rate</label>
          <input type="number" class="form-control" id="raise-rate" min="0" max="100" value="5" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <input class="form-check-input" type="checkbox" id="eiCheckbox">
          <label class="form-check-label" for="eiCheckbox">EI</label>
          <input class="form-check-input" type="checkbox" id="cppCheckbox">
          <label class="form-check-label" for="cppCheckbox">CPP</label>
        </div>
        <div class="col-lg-1">
          <button type="button" id="toggle-lock" class="btn btn-outline-secondary btn-sm" onClick="toggleLock()">
            <i id="lock-icon" class="bi bi-lock"></i> Lock
          </button>
        </div>
      </div>
        <h1 class="h4 mb-3">Savings</h1>
        <div class="row align-items-end mb-3">
        <div class="col-lg-1">
          <button type="button" id="add-button" class="btn btn-primary btn-sm" onClick="addSavingsAccount()">
            <i class="bi bi-plus"></i> Add
          </button>
        </div>
        <div class="col-lg-1">
          <button type="button" id="savings-lock-button" class="btn btn-outline-secondary btn-sm" onClick="lockSavings()">
            <i class="bi bi-plus"></i> Lock
          </button>
        </div>        

    </form>
  `;

  document.body.appendChild(justMeContainer);
}

function addSavingsAccount() {
    const savingsRow = document.createElement('div');
    savingsRow.className = 'row align-items-end mb-3';
  
    savingsRow.innerHTML = `
      <div class="col-lg-2">
        <label for="account-type" class="form-label">Account Type</label>
        <select class="form-select" id="account-type" onChange="savingsAccountChange(this)" required>
          <option value="cash">Cash</option>
          <option value="margin">Margin</option>
          <option value="rsp">RSP</option>
          <option value="srsp">Spousal RSP</option>
          <option value="mrsp">RSP Match</option>
          <option value="tfsa">TFSA</option>
          <option value="lrsp">LRSP</option>
          <option value="lira">LIRA</option>
          <option value="resp">RESP</option>
        </select>
      </div>
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label ">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div> 
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;
  
    // Append the new row to the Savings section
    const savingsSection = document.querySelector('.row.align-items-end.mb-3:last-of-type');
    savingsSection.parentNode.insertBefore(savingsRow, savingsSection.nextSibling);
  
    // Add event listener to the remove button
    savingsRow.querySelector('.remove-row').addEventListener('click', () => {
      savingsRow.remove();
    });
  }

function savingsAccountChange(selectElement) {
    const selectedValue = selectElement.value; // Get the selected dropdown value
    const row = selectElement.closest('.row'); // Get the parent row of the dropdown
  
    // Clear the row's content except for the dropdown
    row.innerHTML = `
      <div class="col-lg-2">
        <label for="account-type" class="form-label">Account Type</label>
        <select class="form-select" id="account-type" onChange="savingsAccountChange(this)" required>
          <option value="cash" ${selectedValue === 'cash' ? 'selected' : ''}>Cash</option>
          <option value="margin" ${selectedValue === 'margin' ? 'selected' : ''}>Margin</option>
          <option value="rsp" ${selectedValue === 'rsp' ? 'selected' : ''}>RSP</option>
          <option value="srsp" ${selectedValue === 'srsp' ? 'selected' : ''}>Spousal RSP</option>
          <option value="tfsa" ${selectedValue === 'tfsa' ? 'selected' : ''}>TFSA</option>
          <option value="lrsp" ${selectedValue === 'lrsp' ? 'selected' : ''}>LRSP</option>
          <option value="lira" ${selectedValue === 'lira' ? 'selected' : ''}>LIRA</option>
          <option value="resp" ${selectedValue === 'resp' ? 'selected' : ''}>RESP</option>
        </select>
      </div>
    `;
  
    // Add additional fields based on the selected value
    if (selectedValue === 'cash' || selectedValue === 'margin') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label ">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div> 

      `;
    } else if (selectedValue === 'rsp') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="annuitant" class="form-label">Annuitant</label>
          <input type="text" class="form-control" id="annuitant" placeholder="Who receives" required>
        </div>
        <div class="col-lg-2">      
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
      `;      
    } else if (selectedValue === 'srsp'){
      row.innerHTML += `
      <div class="col-lg-2">
        <label for="account-name" class="form-label">Account Name</label>
        <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
      </div>
      <div class="col-lg-2">
        <label for="contributor" class="form-label">Contributor</label>
        <input type="text" class="form-control" id="contributor" placeholder="Who contributes" required>
      </div>
      <div class="col-lg-2">
        <label for="annuitant" class="form-label">Annuitant</label>
        <input type="text" class="form-control" id="annuitant" placeholder="Who receives" required>
      </div>          
      <div class="col-lg-2">
        <label for="account-balance" class="form-label">Balance</label>
        <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
      </div>
      <div class="col-lg-1">
          <label for="investment-rate" class="form-label ">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
      </div>
      `;
    } else if (selectedValue === 'mrsp') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="annuitant" class="form-label">Annuitant</label>
          <input type="text" class="form-control" id="annuitant" placeholder="Who receives" required>
        </div>   
        <div class="col-lg-2">
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="match-rate" class="form-label ">Match Rate</label>
          <input type="number" class="form-control" id="match-rate" min="0" max="100" value="4" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label ">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div> 
      `;
    } else if (selectedValue === 'resp') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>      
        <div class="col-lg-2">
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label ">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="yearly-contribution" class="form-label">Yearly Contribution</label>
          <input type="number" class="form-control" id="yearly-contribution" min="0" step="100" placeholder="Enter yearly contribution" required>
        </div>
        <div class="col-lg-1">
          <label for="resp-contributions-end" class="form-label">Last Contribution Year</label>
          <input type="number" class="form-control" id="resp-contributions-end" placeholder="Enter year of last contribution" required>
        </div>
      `;
    } else if (selectedValue === 'tfsa') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="annuitant" class="form-label">Annuitant</label>
          <input type="text" class="form-control" id="annuitant" placeholder="Who receives" required>
        </div>
        <div class="col-lg-2">      
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
      `;   
    } else if (selectedValue === 'lrsp' || selectedValue === 'lira'){ 
      //similar to rsp but will link to an LIF and a year of LIF start
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="account-name" class="form-label">Account Name</label>
          <input type="text" class="form-control" id="account-name" placeholder="Account Nickname" required>
        </div>
        <div class="col-lg-2">
          <label for="annuitant" class="form-label">Annuitant</label>
          <input type="text" class="form-control" id="annuitant" placeholder="Who receives" required>
        </div>
        <div class="col-lg-2">
          <label for="linked-lif" class="form-label">Associated LIF</label>
          <input type="text" class="form-control" id="linked-lif" placeholder="Linked LIF" required>
        </div>
        <div class="col-lg-2">      
          <label for="account-balance" class="form-label">Balance</label>
          <input type="number" class="form-control" id="account-balance" min="0" step="100" placeholder="Enter balance" required>
        </div>
        <div class="col-lg-1">
          <label for="investment-rate" class="form-label">Return Rate</label>
          <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
      `;       
    }
  
    // Add the remove button back to the row
    row.innerHTML += `
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;
  
    // Add event listener to the remove button
    row.querySelector('.remove-row').addEventListener('click', () => {
      row.remove();
    });
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