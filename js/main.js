//Imports
//import * as bootstrap from 'bootstrap'

//Global Variables
let personCounter = 0;
let incomeCounter = 0;
const indexationRate = 0.03;
const inflationRate = 0.03;
const investmentRate = 0.07;


//storage
const persons = []; // Array to hold person objects
//const sharedExpenses = []; // Array to hold shared expense objects
//const sharedDebts = []; // Array to hold shared debt objects
//const sharedAssets = []; // Array to hold shared asset objects


//Objects
const person = {
  id: Number, 
  name: String,
  age: Number,
  retirementAge: Number,
  projectionAge: Number,
  incomes: [],
  //savings: [],
  //pensions: [],
  //assets: [],
  //debts: [],
  //expenses: []
};

//income is for all pre-retirement income, whether salary, bonus, RSU, net income, etc.
const income = {
  id: Number, 
  type: String, // e.g., salary, bonus, RSU, net income
  name: String, // e.g., company name
  amount: Number, // e.g., 100000
  raise: Number, // e.g., 5 for 5% yearly raise
  inflationAdjustment: Number, // e.g., 0.03 for 3% inflation adjustment
}

//this is to hold savings accounts, whether rsp, tfsa, cash, etc.
const savings = {
  id: Number, 
  type: String, // e.g., cash, margin, RSP, spousal RSP, TFSA, LRSP, LIRA, RESP
}

//pension is for gross retirement income, where one could have a company pension, government pension, CPP, LIF, etc
const pension = {
  id: Number, 
  type: String,
}

//asset is for net worth calculation, especially in the case of a house, where you'd put the value of the house against the existing mortgage
const asset = {
  id: Number, 
  name: String,
  value: Number,
  shared: Boolean, // Indicates if the asset is shared
}

//For debts, mainly mortgages, but could also be for car loans, student loans, etc.
const debt = {
  id: Number, 
  balance: Number,
  payment: Number,
  paymentFrequency: String,
  lastPayment: Date,
  shared: Boolean, // Indicates if the debt is shared
}

//expenses are for building the monthly budget, where all income sources will be calculated against the expenses to determine the surplus, or the 'savings capacity' in order to later project
const expense = {
  id: Number, 
  name: String,
  amount: Number, // e.g., 1000
  expenseEndDate: Date, // e.g., 2025-12-31
  inflation: Boolean,
  shared: Boolean, // Indicates if the expense is shared
};

//Persons
function addPerson(){
    const personRow = document.createElement('div');
    personRow.className = 'row align-items-end mb-3';
  
    personRow.innerHTML = `
      <div class="col-lg-2">
        <label for="person-name" class="form-label">Name</label>
        <input type="text" class="form-control" id="person-name" placeholder="Johnny" onChange="savePerson(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-current-age" class="form-label">Current Age</label>
        <input type="number" class="form-control" id="person-current-age" min="0" step="100" placeholder="30" onChange="savePerson(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-retirement-age" class="form-label">Retirement Age</label>
        <input type="number" class="form-control" id="person-retirement-age" min="0" step="100" placeholder="55" onChange="savePerson(this)" required>
      </div>
      <div class="col-lg-2">
        <label for="person-projection-age" class="form-label">Projection Age</label>
        <input type="number" class="form-control" id="person-projection-age" min="0" step="100" placeholder="100" onChange="savePerson(this)" required>
      </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;

    
    // Create a new person object and add it to the persons array
    const newPerson = {
      id: personCounter,  
      name: 'Johnny',
      age: 30,
      retirementAge: 55,
      projectionAge: 100,
    };
    personCounter++; // Increment the ID counter for the next object

    persons.push(newPerson);
    personRow.dataset.personId = newPerson.id; // Store the index of the person in the row

  
    // Append the new row to the Persons section
    const personSection = document.querySelector('#add-person-button').parentNode.parentNode;
    personSection.appendChild(personRow);
  
    // Add event listener to the remove button
    personRow.querySelector('.remove-row').addEventListener('click', () => {
      removePerson(personRow.dataset.personId);
      //persons.splice(personRow.dataset.personIndex,1) ; // remove the person from the persons array
      //personRow.remove();

        // Update the index for all rows after the removed one
      //const allRows = document.querySelectorAll('.row.align-items-end.mb-3');
      //allRows.forEach((row, idx) => {
        //row.dataset.personId = idx;});
    });
}

function savePerson(element){

    const personRow = element.closest('.row'); // Get the parent row of the input element
    const personId = personRow.dataset.personId; // Get the id of the person from the row's dataset

    // Update the corresponding person object in the persons array  
    if (index !== undefined) {
        const person = persons.find(person => person.id == personId);; 
        if (element.id === 'person-name') {
            person.name = element.value;
            console.log(`${person.name}'s name updated to: ${person.name}`);
        } else if (element.id === 'person-current-age') {
            person.age = parseInt(element.value, 10);
            console.log(`${person.name}'s current age updated to: ${person.age}`);
        } else if (element.id === 'person-retirement-age') {
            person.retirementAge = parseInt(element.value, 10);
            console.log(`${person.name}'s retirement age updated to: ${person.retirementAge}`);
        } else if (element.id === 'person-projection-age') {
            person.projectionAge = parseInt(element.value, 10);
            console.log(`${person.name}'s projection age updated to: ${person.projectionAge}`);
        }
    }
};

function removePerson(personId){
  const thisPerson = persons.find(person => person.id == personId);
  console.log(`Removing: ${thisPerson.name}`);
  
  //remove associated incomes
  let idx = 0;
  while(thisPerson.incomes && thisPerson.incomes.length > 0) {
    // Remove all incomes associated with this person
    console.log(`Removing income: ${thisPerson.incomes[idx].name}`);
    removeIncome(thisPerson, thisPerson.incomes[idx]);
    idx++;
  }

  //personremoval
  const personRow = document.querySelector(`.row.align-items-end.mb-3[data-person-index="${thisPerson.id}"]`);
  console.log(`Person Row: ${personRow.dataset.personId}`);
  if (personRow) {
    personRow.remove(); // Remove the row from the DOM
    persons = persons.filter(person => person.id == thisPerson.id); // Remove the person from the persons array
    console.log(`${person.name} removed.`);
  } else {
    console.error(`${person.name} not found.`);
  }
}

//Income Functions
function confirmIncome() {
    const incomeRow = document.createElement('div');
    incomeRow.className = 'row align-items-end mb-3';

    // Build the person dropdown options
    let personOptions = persons.map((p, idx) => 
      `<option value="${idx}">${p.name || 'Person ' + (idx + 1)}</option>`
    ).join('');



  incomeRow.innerHTML = `
        <div class="col-lg-2">
          <label for="income-person" class="form-label">For?</label>
          <select class="form-select" id="income-person" required>
            ${personOptions}
          </select>
        </div>
        <div class="col-lg-1">
          <button type="button" id="confirm-income" class="btn btn-primary btn-sm" onClick="addIncome(this)">
            <i class="bi bi-plus"></i> Confirm
          </button>
        </div>
        <div class="col-lg-1">
          <button type="button" class="btn btn-danger btn-sm remove-row">
            <i class="bi bi-trash"></i> Cancel
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

function addIncome(element) {
    // Get the selected person index
    const personSelect = document.querySelector('#income-person');
    const selectedIndex = personSelect.value; // Get the selected index of the person

    const thisPerson = persons[selectedIndex]; // Get the selected person object

    row = element.closest('.row'); // Get the parent row of the button

    const newIncome = {
      id: incomeCounter, // Use the length of incomes array to set a unique ID
      type: 'salary', // Default type, can be changed later
      name: '',
      amount: 100000,
      raise: 0.05, // Default raise rate
      inflationAdjustment: inflationRate // Default inflation adjustment
    };
    incomeCounter++; // Increment the ID counter for the next object
    
    if (thisPerson.incomes) {
      // If the person already has incomes, push the new income object to their incomes array
      thisPerson.incomes.push(newIncome); // Add the new income object to the selected person's incomes
      thisPerson.incomes[thisPerson.incomes.length - 1].id = thisPerson.incomes.length - 1; // Set the ID to the index in the incomes array
    } else {
      thisPerson.incomes = [newIncome]; // Initialize the incomes array with the new income object
      thisPerson.incomes[0].id = 0; // Set the ID to 0 for the first income object
    }

    //store the income id in the row
    row.dataset.incomeId = newIncome.id; // Store the income ID in the row's dataset
    //store the person id in the row
    row.dataset.personId = selectedIndex; // Store the person ID in the row's dataset
    //Clear the confirmation, add the income row
    row.innerHTML = `  
        <div class="col-lg-1">
          <label for="income-person" class="form-label">Person</label>
          <p id="income-person">${thisPerson.name}</p>
        </div>
        <div class="col-lg-2">
          <label for="income-name" class="form-label">Income Name</label>
          <input type="text" class="form-control" id="income-name" placeholder="Company Name" onChange="saveIncome(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="income-amount" class="form-label">Yearly Amount</label>
          <input type="number" class="form-control" id="income-amount" min="0" step="100" placeholder="100000" onChange="saveIncome(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="income-raise" class="form-label ">Yearly Raise</label>
          <input type="number" class="form-control" id="income-raise" min="0" max="50" step="1" value="0.05" onChange="saveIncome(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="income-inflation" class="form-label">Inflation Adjustment</label>
          <input type="number" class="form-control" id="income-inflation" min="0" max="50" step="1" value="0.03" onChange="saveIncome(this)" required>
        </div>
      <div class="col-lg-1">
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    `;

    

    // Append the new row to the Income section
    const incomeSection = document.querySelector('#add-income-button').parentNode.parentNode;
    incomeSection.appendChild(row);

        // Add event listener to the remove button
    row.querySelector('.remove-row').addEventListener('click', () => {
      removeIncome(thisPerson, newIncome);
      row.remove();
    });
  }

function saveIncome(selectElement) {
    // Get the parent row of the select element
    const row = selectElement.closest('.row'); // Get the parent row of the dropdown
    const incomeId = row.dataset.incomeId; // Get the income ID from the row's dataset
    const personId = row.dataset.personId; // Get the person ID from the row's dataset

  
    const thisPerson = persons[personId]; // Get the selected person object
    const incomeData = thisPerson.incomes[incomeId]; // Get the income object from the selected person's incomes array
    // Update the income object with the new values
    incomeData.name = row.querySelector('#income-name').value;
    incomeData.amount = parseFloat(row.querySelector('#income-amount').value);
    incomeData.raise = parseFloat(row.querySelector('#income-raise').value);
    incomeData.inflationAdjustment = Number(parseFloat(row.querySelector('#income-inflation').value));
}

function removeIncome(person,income) {
    // Get the parent row of the select element
    //const row = buttonElement.closest('.row'); // Get the parent row of the button
    //const incomeId = row.dataset.incomeId; // Get the income ID from the row's dataset

    // Get the selected person index
    //const personSelect = document.querySelector('#income-person');
    //const selectedPersonIndex = personSelect.value; // Get the selected index of the person
    //const thisPerson = persons[selectedPersonIndex]; // Get the selected person object

    // Remove the income from the selected person's incomes array
    if (person.incomes && person.incomes.length > income.id) {
        person.incomes.splice(income.id, 1); // Remove the income object from the selected person's incomes array
    } else {
        console.error(`Income with ID ${income.id} not found for person ${person.name}`);
    }
    // Log the removal of the income
    if (!person) {
        console.log(`Income removed from person: ${person.name}`);
    } else {
        console.log('No person selected for income removal');
    }
    //finish by removing the html row
    const incomeRow = document.querySelector(`.row.align-items-end.mb-3[data-person-index="${income.id}"]`);
    incomeRow.remove(); // Remove the income row
}

//Savings Functions
/*
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

function confirmSavings() {
}

function saveSavings(){

}

function removeSavings(){
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
*/

//Pension Functions
/*
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
*/

//Asset Functions
/*
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
*/

//Debt Functions
/*
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
*/

//Expense Functions

//Projection
function generateProjection() {
  //person check
  if(persons.length === 0){
    alert("You must add a person to generate");
    return
  } else {
    for(let i=0; i<persons.length; i++){//for each person
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
      
      //start with year and age
      let columns = ['Year','Age'];

      //load incomes
      if(persons[i].incomes === undefined){//if this person has no incomes
        alert(`${persons[i].name} has no income`)
      } else {
        for(let j=0; j<persons[i].incomes.length; j++){
          columns.push(`${persons[i].incomes[j].name} Income`);
        }
      }

      // Header
      const thead = document.createElement('thead');
      let headerRow = `<h1>${persons[i].name}</h1>`;
      columns.forEach(col => headerRow += `<th>${col}</th>`);
      headerRow += '</tr>';
      thead.innerHTML = headerRow;
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      let amount = persons[i].incomes[0].amount;//define the amount outside of the for loop in order to conserve the original amount in the person income array
      for (let age = persons[i].age; age <= persons[i].projectionAge; age++) {
        // Assuming 'year' is the current year + age - startAge
        const year = new Date().getFullYear() + (age - persons[i].age);
        let row = `<tr><td>${year}</td>`;
        //age
        row += `<td>${age}</td>`;
        // Assuming 'income' is a placeholder value, replace with actual income calculation
        amount += amount*persons[i].incomes[0].raise+amount*persons[i].incomes[0].inflationAdjustment; // Example income calculation
        if (age < persons[i].retirementAge){
          row += `<td>${Number(amount.toFixed(0))}</td>`;
        }
    
        // Add more cells based on the number of columns
        columns.slice(3).forEach(() => row += '<td></td>'); // Placeholder for additional data
        row += '</tr>';
        cell => row += `<td>${cell}</td>`
        tbody.innerHTML += row;
      }   
      table.appendChild(tbody);

      container.appendChild(table);
    }//end for of each person
  }//end else for person check
}

