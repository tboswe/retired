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

//Cookiedough
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

//SAVE
function saveUserData(element){

  setCookie('name-me', document.getElementById('name-me').value, 7);
}

//INIT
//Questionaire
function adultDropdownChange(element){
  let dropdownButton = document.getElementById('adultDropdownMenuButton');
  dropdownButton.textContent = element.textContent;
  
  // Retrieve user data
  const userName = getCookie('userName');
  console.log(userName);
  justMeQuestions();
};

//Init Just Me
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
          <label for="base-income" class="form-label">Base Income</label>
          <input type="number" class="form-control" id="base-income" min="0" max="10000000" value="50000" step="1000" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="bonus-income" class="form-label">Bonus</label>
          <input type="number" class="form-control" id="bonus-income" min="0" max="200" value="12" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="stock-income" class="form-label">Stock</label>
          <input type="number" class="form-control" id="stock-income" min="0" max="10000000" value="50000" step="1000" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="raise-rate" class="form-label">Raise Rate</label>
          <input type="number" class="form-control" id="raise-rate" min="0" max="100" value="5" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label class="form-check-label" for="eiCheckbox">EI</label>
          <input class="form-check-input" type="checkbox" id="eiCheckbox" onChange="ei(this)">
          <label class="form-check-label" for="cppCheckbox">CPP</label>
          <input class="form-check-input" type="checkbox" id="cppCheckbox" onChange="cpp(this)">
        </div>
        <div class="col-lg-1">
          <button type="button" id="personals-lock-button" class="btn btn-outline-secondary btn-sm" onClick="LockPersonals()">
            <i id="lock-icon" class="bi bi-lock"></i> Lock
          </button>
        </div>
      </div>
        <h1 class="h4 mb-3">Income</h1>
        <div class="row align-items-end mb-3">
          <div class="col-lg-1">
            <button type="button" id="add-income-button" class="btn btn-primary btn-sm" onClick="addIncome()">
              <i class="bi bi-plus"></i> Add
            </button>
          </div>
          <div class="col-lg-1">
            <button type="button" id="income-lock-button" class="btn btn-outline-secondary btn-sm" onClick="lockIncome()">
              <i class="bi bi-plus"></i> Lock
            </button>
          </div>
        </div>
        <h1 class="h4 mb-3">Savings</h1>
        <div class="row align-items-end mb-3">
          <div class="col-lg-1">
            <button type="button" id="add-savings-button" class="btn btn-primary btn-sm" onClick="addSavings()">
              <i class="bi bi-plus"></i> Add
            </button>
          </div>
          <div class="col-lg-1">
            <button type="button" id="savings-lock-button" class="btn btn-outline-secondary btn-sm" onClick="lockSavings()">
              <i class="bi bi-plus"></i> Lock
            </button>
          </div>
        </div>
        <h1 class="h4 mb-3">Pensions</h1>
        <div class="row align-items-end mb-3">
          <div class="col-lg-1">
            <button type="button" id="add-pension-button" class="btn btn-primary btn-sm" onClick="addPension()">
              <i class="bi bi-plus"></i> Add
            </button>
          </div>
          <div class="col-lg-1">
            <button type="button" id="pensions-lock-button" class="btn btn-outline-secondary btn-sm" onClick="lockPensions()">
              <i class="bi bi-plus"></i> Lock
            </button>
          </div>
        </div>
        <h1 class="h4 mb-3">Assets</h1>
        <div class="row align-items-end mb-3">
          <div class="col-lg-1">
            <button type="button" id="add-asset-button" class="btn btn-primary btn-sm" onClick="addAsset()">
              <i class="bi bi-plus"></i> Add
            </button>
          </div>
          <div class="col-lg-1">
            <button type="button" id="assets-lock-button" class="btn btn-outline-secondary btn-sm" onClick="lockAssets()">
              <i class="bi bi-plus"></i> Lock
            </button>
          </div>
        </div>            

    </form>
  `;

  document.body.appendChild(justMeContainer);
}

//Init me and my partner

//Income Functions
function addIncome() {
    const incomeRow = document.createElement('div');
    incomeRow.className = 'row align-items-end mb-3';
  
    incomeRow.innerHTML = `
      <div class="col-lg-2">
        <label for="income-type" class="form-label">Income Type</label>
        <select class="form-select" id="account-type" placeholder="Choose" onChange="incomeChange(this)" required>
          <option value="salary">Base Salary</option>
          <option value="bonus">Bonus</option>
          <option value="rsu">RSU</option>
          <option value="net">Net Income</option>
        </select>
      </div>
        <div class="col-lg-2">
          <label for="income-name" class="form-label">Income Name</label>
          <input type="text" class="form-control" id="income-name" placeholder="Company Name" required>
        </div>
        <div class="col-lg-2">
          <label for="income-amount" class="form-label">Amount</label>
          <input type="number" class="form-control" id="income-amount" min="0" step="100" placeholder="100000" required>
        </div>
        <div class="col-lg-1">
          <label for="income-frequency" class="form-label ">Frequency</label>
          <select class="form-select" id="income-frequency" placeholder="Choose" onChange="incomeFrequencyChange(this)" required>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="Bi-monthly">Bi-monthly</option>
            <option value="Bi-weekly">Bi-weekly</option>
          </select>
        </div> 
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;
  
    // Append the new row to the income section
    const incomeSection = document.querySelector('#add-income-button').parentNode.parentNode;
    incomeSection.appendChild(incomeRow);
  
    // Add event listener to the remove button
    incomeRow.querySelector('.remove-row').addEventListener('click', () => {
      incomeRow.remove();
    });
  }

  function incomeChange(selectElement) {
    const selectedValue = selectElement.value; // Get the selected dropdown value
    const row = selectElement.closest('.row'); // Get the parent row of the dropdown

    // Clear the row's content except for the dropdown
    row.innerHTML = `
      <div class="col-lg-2">
        <label for="income-type" class="form-label">Income Type</label>
        <select class="form-select" id="income-type" onChange="incomeChange(this)" required>
          <option value="salary" ${selectedValue === 'salary' ? 'selected' : ''}>Base Salary</option>
          <option value="bonus" ${selectedValue === 'bonus' ? 'selected' : ''}>Bonus</option>
          <option value="rsu" ${selectedValue === 'rsu' ? 'selected' : ''}>RSU</option>
          <option value="net" ${selectedValue === 'net' ? 'selected' : ''}>Net Salary</option>
        </select>
      </div>
    `;
  
    // Add additional fields based on the selected value
    if (selectedValue === 'salary') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="income-name" class="form-label">Income Name</label>
          <input type="text" class="form-control" id="income-name" placeholder="Company Name" required>
        </div>
        <div class="col-lg-2">
          <label for="income-amount" class="form-label">Amount</label>
          <input type="number" class="form-control" id="income-amount" min="0" step="100" placeholder="100000" required>
        </div>
        <div class="col-lg-1">
          <label for="income-frequency" class="form-label ">Frequency</label>
          <select class="form-select" id="income-frequency" placeholder="Choose" onChange="incomeFrequencyChange(this)" required>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="Bi-monthly">Bi-monthly</option>
            <option value="Bi-weekly">Bi-weekly</option>
          </select>
        </div>
        <div class="col-lg-2">
          <label for="income-deductions" class="form-label">Non-tax Deductions</label>
          <input type="number" class="form-control" id="income-amount" min="0" step="100" placeholder="200" required>
        </div>
        <div class="col-lg-1">
          <label for="income-deductions-frequency" class="form-label ">Frequency</label>
          <select class="form-select" id="income-deductions-frequency" placeholder="Choose" onChange="incomeDeductionsFrequencyChange(this)" required>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="Bi-monthly">Bi-monthly</option>
            <option value="Bi-weekly">Bi-weekly</option>
          </select>
        </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>

      `;
    } else if (selectedValue === 'bonus') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="bonus-name" class="form-label">Bonus Name</label>
          <input type="text" class="form-control" id="bonus-name" placeholder="Company XYZ" required>
        </div>
        <div class="col-lg-1">
          <label for="bonus-percentage" class="form-label">%</label>
          <input type="number" class="form-control" id="bonus-percentage" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-2">      
          <label for="bonus-amount" class="form-label">Amount</label>
          <input type="number" class="form-control" id="bonus-amount" min="0" step="100" placeholder="Amount" required>
        </div>        
      `;      
    } else if (selectedValue === 'rsu'){
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
    } else if (selectedValue === 'net') {
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

//Savings Functions
function addSavings() {
    const savingsRow = document.createElement('div');
    savingsRow.className = 'row align-items-end mb-3';
  
    savingsRow.innerHTML = `
      <div class="col-lg-2">
        <label for="account-type" class="form-label">Account Type</label>
        <select class="form-select" id="account-type" placeholder="Choose" onChange="savingsChange(this)" required>
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
    const savingsSection = document.querySelector('#add-savings-button').parentNode.parentNode;
    savingsSection.appendChild(savingsRow);
  
    // Add event listener to the remove button
    savingsRow.querySelector('.remove-row').addEventListener('click', () => {
      savingsRow.remove();
    });
  }

function savingsChange(selectElement) {
    const selectedValue = selectElement.value; // Get the selected dropdown value
    const row = selectElement.closest('.row'); // Get the parent row of the dropdown
  
    // Clear the row's content except for the dropdown
    row.innerHTML = `
      <div class="col-lg-2">
        <label for="account-type" class="form-label">Account Type</label>
        <select class="form-select" id="account-type" onChange="savingsChange(this)" required>
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

//Pension Functions
function addPension() {
  const pensionsRow = document.createElement('div');
  pensionsRow.className = 'row align-items-end mb-3';

  pensionsRow.innerHTML = `
    <div class="col-lg-2">
      <label for="pension-type" class="form-label">Pension Type</label>
      <select class="form-select" id="pension-type" onChange="pensionsChange(this)" required>
        <option value="defined-benefit">Defined Benefit</option>
        <option value="defined-contribution">Defined Contribution</option>
        <option value="lif">LIF</option>
      </select>
    </div>
    <div class="col-lg-2">
      <label for="pension-name" class="form-label">Pension Name</label>
      <input type="text" class="form-control" id="pension-name" placeholder="Pension Name" required>
    </div>
    <div class="col-lg-2">
      <label for="pension-balance" class="form-label">Bala nce</label>
      <input type="number" class="form-control" id="pension-balance" min="0" step="100" placeholder="Enter balance" required>
    </div>
    <div class="col-lg-1">
      <label for="return-rate" class="form-label ">Return Rate</label>
      <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="4" step="1" onChange="saveUserData(this)" required>
    </div>
    <div class="col-lg-1">
      <label for="pension-mode" class="form-label">Pension Mode</label>
        <select class="form-select" id="pension-mode" onChange="xxx(this)" required>
          <option value="cash">Best 5</option>
        </select>
    </div> 
    <div class="col-lg-1">
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Remove
      </button>
    </div>
  `;

    // Append the new row to the Pension section
    const pensionsSection = document.querySelector('#add-pension-button').parentNode.parentNode;
    pensionsSection.appendChild(pensionsRow);

  // Add event listener to the remove button
  pensionsRow.querySelector('.remove-row').addEventListener('click', () => {
    pensionsRow.remove();
  });
}

function pensionsChange(selectElement) {
  const selectedValue = selectElement.value; // Get the selected dropdown value
  const row = selectElement.closest('.row'); // Get the parent row of the dropdown

  // Clear the row's content except for the dropdown
  row.innerHTML = `
    <div class="col-lg-2">
      <label for="pension-type" class="form-label">Pension Type</label>
      <select class="form-select" id="pension-type" onChange="pensionsChange(this)" required>
        <option value="defined-benefit" ${selectedValue === 'defined-benefit' ? 'selected' : ''}>Defined Benefit</option>
        <option value="defined-contribution" ${selectedValue === 'defined-contribution' ? 'selected' : ''}>Defined Contribution</option>
        <option value="lif" ${selectedValue === 'lif' ? 'selected' : ''}>LIF</option>
      </select>
    </div>
  `;

  if (selectedValue === 'defined-benefit') {
    row.innerHTML += `
      <div class="col-lg-2">
        <label for="pension-name" class="form-label">Pension Name</label>
        <input type="text" class="form-control" id="pension-name" placeholder="Pension Name" required>
      </div>
      <div class="col-lg-2">
        <label for="pension-balance" class="form-label">Balance</label>
        <input type="number" class="form-control" id="pension-balance" min="0" step="100" placeholder="Enter balance" required>
      </div>
      <div class="col-lg-1">
        <label for="return-rate" class="form-label ">Return Rate</label>
        <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="4" step="1" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-1">
        <label for="pension-mode" class="form-label">Pension Mode</label>
        <select class="form-select" id="pension-mode" onChange="xxx(this)" required>
          <option value="cash">Best 5</option>
        </select>
      </div>
    `;
  } else if (selectedValue === 'defined-contribution') {
    row.innerHTML += `
      <div class="col-lg-2">
        <label for="pension-name" class="form-label">Pension Name</label>
        <input type="text" class="form-control" id="pension-name" placeholder="Pension Name" required>
      </div>
      <div class="col-lg-2">
        <label for="pension-balance" class="form-label">Balance</label>
        <input type="number" class="form-control" id="pension-balance" min="0" step="100" placeholder="Enter balance" required>
      </div>
      <div class="col-lg-1">
        <label for="return-rate" class="form-label ">Return Rate</label>
        <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="4" step="1" onChange="saveUserData(this)" required>
      </div>
      `;
  } else if (selectedValue === 'lif') {
    row.innerHTML += `
      <div class="col-lg-2">
        <label for="pension-name" class="form-label">Pension Name</label>
        <input type="text" class="form-control" id="pension-name" placeholder="Pension Name" required>
      </div>
      <div class="col-lg-2">
        <label for="pension-balance" class="form-label">Balance</label>
        <input type="number" class="form-control" id="pension-balance" min="0" step="100" placeholder="Enter balance" required>
      </div>
      <div class="col-lg-1">
        <label for="return-rate" class="form-label ">Return Rate</label>
        <input type="number" class="form-control" id="investment-rate" min="0" max="100" value="4" step="1" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-1">
        <label for="lif-start" class="form-label">LIF Start Year</label>
        <input type="number" class="form-control" id="lif-start" min="0" step="1" placeholder="Enter year of LIF start" required>
      </div>
      `;
  };

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
//Asset Functions

//Debt Functions