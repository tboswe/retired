//Imports
//import * as bootstrap from 'bootstrap'

//Global Variables
const indexationRate = 0.03;
const inflationRate = 0.03;
const investmentRate = 0.07;

//storage
const persons = []; // Array to hold person objects


//Objects
const person = {
  name: String,
  age: Number,
  retirementAge: Number,
  projectionAge: Number,
  incomes: [],
  savings: [],
  pensions: [],
  assets: [],
  debts: []
};

const income = {
  type: String, // e.g., salary, bonus, RSU, net income
  name: String, // e.g., company name
  amount: Number, // e.g., 100000
  frequency: String, // e.g., yearly, monthly, bi-monthly, bi-weekly
  deductions: Number, // e.g., 200
  deductionsFrequency: String, // e.g., yearly, monthly, bi-monthly, bi-weekly
  fromRange: Number, // e.g., 2025
  toRange: Number, //e.g. 2030
}

const savings = {
  type: String, // e.g., cash, margin, RSP, spousal RSP, TFSA, LRSP, LIRA, RESP

}

const pension = {
  type: String,
}

const asset = {
  name: String,
  value: Number
}

const debt = {
  balance: Number,
  payment: Number,
  paymentFrequency: String,
  lastPayment: Date
}

//SAVE
function saveUserData(element){
  console.log('called saveUserData with element:', element);
    const personRow = element.closest('.row'); // Get the parent row of the input element
    const index = personRow.dataset.personIndex; // Get the index of the person from the row's dataset
console.log('the index is:', index)
    // Update the corresponding person object in the persons array  
    if (index !== undefined) {
        const personData = persons[index]; 
        if (element.id === 'person-name') {
            personData.name = element.value;
            console.log(`Person ${index} name updated to: ${personData.name}`);
        } else if (element.id === 'person-current-age') {
            personData.age = parseInt(element.value, 10);
            console.log(`Person ${index} current age updated to: ${personData.age}`);
        } else if (element.id === 'person-retirement-age') {
            personData.retirementAge = parseInt(element.value, 10);
            console.log(`Person ${index} retirement age updated to: ${personData.retirementAge}`);
        } else if (element.id === 'person-projection-age') {
            personData.projectionAge = parseInt(element.value, 10);
            console.log(`Person ${index} projection age updated to: ${personData.projectionAge}`);
        }
    }
};

//Persons
function addPerson(){
    const personRow = document.createElement('div');
    personRow.className = 'row align-items-end mb-3';
  
    personRow.innerHTML = `
      <div class="col-lg-2">
        <label for="person-name" class="form-label">Name</label>
        <input type="text" class="form-control" id="person-name" placeholder="Name" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-current-age" class="form-label">Current Age</label>
        <input type="number" class="form-control" id="person-current-age" min="0" step="100" placeholder="Current Age" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-retirement-age" class="form-label">Retirement Age</label>
        <input type="number" class="form-control" id="person-retirement-age" min="0" step="100" placeholder="Retirement Age" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-projection-age" class="form-label">Projection Age</label>
        <input type="number" class="form-control" id="person-projection-age" min="0" step="100" placeholder="Projection Age" onChange="saveUserData(this)" required>
      </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;

    // Create a new person object and add it to the persons array
    const newPerson = person;
    newPerson.name = '';
    newPerson.age = 0;
    newPerson.retirementAge = 0;
    newPerson.projectionAge = 0;

    persons.push(newPerson);
    personRow.dataset.personIndex = persons.length - 1; // Store the index of the person in the row

  
    // Append the new row to the Persons section
    const personSection = document.querySelector('#add-person-button').parentNode.parentNode;
    personSection.appendChild(personRow);
  
    // Add event listener to the remove button
    personRow.querySelector('.remove-row').addEventListener('click', () => {
      persons.splice(personRow.dataset.personIndex,1) ; // remove the person from the persons array
      personRow.remove();

        // Update the index for all rows after the removed one
      const allRows = document.querySelectorAll('.row.align-items-end.mb-3');
      allRows.forEach((row, idx) => {
        row.dataset.personIndex = idx;
      });
    });
}

function personChange(selectElement) {
    const selectedValue = selectElement.value; // Get the selected dropdown value
    const row = selectElement.closest('.row'); // Get the parent row of the dropdown

    // Clear the row's content except for the dropdown
    row.innerHTML = `
      <div class="col-lg-2">
        <label for="person-type" class="form-label">Person Type</label>
        <select class="form-select" id="person-type" onChange="personChange(this)" required>
          <option value="earner" ${selectedValue === 'earner' ? 'selected' : ''}>Earner</option>
          <option value="dependant" ${selectedValue === 'dependant' ? 'selected' : ''}>Dependant</option>
        </select>
      </div>
    `;
  
    // Add additional fields based on the selected value
    if (selectedValue === 'earner') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="person-name" class="form-label">Name</label>
          <input type="text" class="form-control" id="person-name" placeholder="Name" required>
        </div>
        <div class="col-lg-2">
          <label for="person-current-age" class="form-label">Current Age</label>
          <input type="number" class="form-control" id="person-current-age" min="0" step="100" placeholder="Current Age" required>
        </div>
        <div class="col-lg-2">
          <label for="person-retirement-age" class="form-label">Retirement Age</label>
          <input type="number" class="form-control" id="person-retirement-age" min="0" step="100" placeholder="Retirement Age" required>
        </div>
        <div class="col-lg-2">
          <label for="person-projection-age" class="form-label">Projection Age</label>
          <input type="number" class="form-control" id="person-projection-age" min="0" step="100" placeholder="Projection Age" required>
        </div>
      `;
    } else if (selectedValue === 'dependant') {
      row.innerHTML += `
        <div class="col-lg-2">
          <label for="dependant-name" class="form-label">Name</label>
          <input type="text" class="form-control" id="dependant-name" placeholder="Dependant Name" required>
        </div>
        <div class="col-lg-1">
          <label for="dependant-current-age" class="form-label">Current Age</label>
          <input type="number" class="form-control" id="dependant-current-age" min="0" max="100" value="7" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="dependant-independant-age" class="form-label">Independance Age</label>
          <input type="number" class="form-control" id="dependant-independant-age" min="0" max="100" value="22" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="dependant-cost" class="form-label">Dependant Cost</label>
          <input type="number" class="form-control" id="dependant-cost" min="0" max="50" step="1" placeholder="10" required>
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
          <label for="income-from-range" class="form-label ">From</label>
          <input type="number" class="form-control" id="income-from-range" min="2000" max="3000" value="2025" step="1" onChange="saveUserData(this)" required>
        </div>
        <div class="col-lg-1">
          <label for="income-to-range" class="form-label ">To</label>
          <input type="number" class="form-control" id="income-to-range" min="2000" max="3000" value="2030" step="1" onChange="saveUserData(this)" required>
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
function addAsset(){
    const assetRow = document.createElement('div');
    assetRow.className = 'row align-items-end mb-3';
  
    assetRow.innerHTML = `
      <div class="col-lg-2">
        <label for="asset-name" class="form-label">Asset Name</label>
        <input type="text" class="form-control" id="asset-name" placeholder="Name" required>
      </div>
      <div class="col-lg-2">
        <label for="asset-value" class="form-label">Value</label>
        <input type="number" class="form-control" id="asset-value" min="0" step="100" placeholder="100000" required>
      </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;
  
    // Append the new row to the Savings section
    const assetSection = document.querySelector('#add-asset-button').parentNode.parentNode;
    assetSection.appendChild(assetRow);
  
    // Add event listener to the remove button
    assetRow.querySelector('.remove-row').addEventListener('click', () => {
      assetRow.remove();
    });
}

//Debt Functions
function addDebt(){
    const debtRow = document.createElement('div');
    debtRow.className = 'row align-items-end mb-3';
  
    debtRow.innerHTML = `
      <div class="col-lg-2">
        <label for="debt-name" class="form-label">Debt Name</label>
        <input type="text" class="form-control" id="debt-name" placeholder="Name" required>
      </div>
      <div class="col-lg-2">
        <label for="debt-balance" class="form-label">Balance</label>
        <input type="number" class="form-control" id="debt-balance" min="0" step="100" placeholder="Balance" required>
      </div>
      <div class="col-lg-2">
        <label for="debt-payment" class="form-label">Monthly Payment</label>
        <input type="number" class="form-control" id="debt-payment" min="0" step="100" placeholder="Payment" required>
      </div>
      <div class="col-lg-2">
        <label for="debt-last-payment" class="form-label ">Last Year of Payment</label>
        <input type="date" class="form-control" id="debt-last-payment" placeholder="Last Payment" required>
      </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;
  
    // Append the new row to the Savings section
    const debtSection = document.querySelector('#add-person-button').parentNode.parentNode;
    debtSection.appendChild(debtRow);
  
    // Add event listener to the remove button
    debtRow.querySelector('.remove-row').addEventListener('click', () => {
      debtRow.remove();
    });
}

//Projection
function generateProjection(startAge, endAge, columns) {
  // columns: array of column names

  // Find or create the container
  let container = document.getElementById('table-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'table-container';
    container.className = 'table-responsive my-4';
    document.body.appendChild(container);
  }
  container.innerHTML = '';

  // Create table
  const table = document.createElement('table');
  table.className = 'table table-striped table-bordered';

  // Header
  const thead = document.createElement('thead');
  let headerRow = '';
  columns.forEach(col => headerRow += `<th>${col}</th>`);
  headerRow += '</tr>';
  thead.innerHTML = headerRow;
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  for (let age = startAge; age <= endAge; age++) {
    let row = `<tr><td>${age}</td>`;
    // Assuming 'year' is the current year + age - startAge
    const year = new Date().getFullYear() + (age - startAge);
    row += `<td>${year}</td>`;
    // Assuming 'income' is a placeholder value, replace with actual income calculation
    const income = 100000*((age - startAge)*inflationRate + 1); // Example income calculation
    if (age < person.retirementAge){
      row += `<td>${income}</td>`;
    }
    // Add more cells based on the number of columns
    columns.slice(3).forEach(() => row += '<td>Data</td>'); // Placeholder for additional data
    row += '</tr>';
    cell => row += `<td>${cell}</td>`
    tbody.innerHTML += row;
  }
  table.appendChild(tbody);

  container.appendChild(table);
}

function generate() {
  generateProjection(
  person.age, // start age
  person.projectionAge, // end age
  ['Age', 'Year', 'Income'] // columns
  );
}
