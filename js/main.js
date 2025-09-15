//Imports
//import * as bootstrap from 'bootstrap'

//Global Variables
//counters for unique id generation
let personCounter = 0;
let incomeCounter = 0;
let savingsCounter = 0;
let pensionCounter = 0;
let assetCounter = 0;
let debtCounter = 0;
let expenseCounter = 0;
const indexationRate = 0.03;
const inflationRate = 0.03;


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
  savings: [],
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
}

//this is to hold savings accounts, whether rsp, tfsa, cash, etc.
const savings = {
  id: Number,
  type: String, // e.g., cash, TFSA, RSP
  name: String, // e.g., “Personal TFSA”
  amount: Number,
  taxfree: Boolean, // Indicates if the savings account is tax-free
  returnRate: Number // annual growth rate (investment rate)
};


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

//DOM-Object maps
const personToRowMap = new WeakMap();

//Persons
function addPerson(){

    const personRow = document.createElement('div');
    personRow.className = 'row align-items-end mb-3';
  
    personRow.innerHTML = `
      <div class="col-lg-2">
        <label for="person-name" class="form-label">Name</label>
        <input type="text" class="form-control" id="person-name" placeholder="Johnny" value="Johnny" required>
      </div>
      <div class="col-lg-2">
        <label for="person-current-age" class="form-label">Current Age</label>
        <input type="number" class="form-control" id="person-current-age" min="0" step="1" value="30"  required>
      </div>
      <div class="col-lg-2">
        <label for="person-retirement-age" class="form-label">Retirement Age</label>
        <input type="number" class="form-control" id="person-retirement-age" min="0" step="1" Value="55" required>
      </div>
      <div class="col-lg-2">
        <label for="person-projection-age" class="form-label">Projection Age</label>
        <input type="number" class="form-control" id="person-projection-age" min="0" step="1" value="100"  required>
      </div>
      <div class="col-lg-2">
      <span>
      <button type="button" class="btn btn-primary btn-sm save-row">
        <i class="bi bi-plus"></i> Save
      </button>
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
        </span>
      </div>
    `;

    //Append the new row to the persons section
    const personsSection = document.querySelector('#persons-section');
    personsSection.appendChild(personRow);

    // Add event listeners to buttons
    personRow.querySelector('.save-row').addEventListener('click', ()=> {savePerson(personCounter, personRow)}); //invoke the save function, give it a new pId, and assign it to row
    personRow.querySelector('.remove-row').addEventListener('click', () => {personRow.remove()}); //simply remove DOM row
}

function savePerson(personId,personRow){
  //if new person
  if (personId ===personCounter) {
    // Create a new person object and add it to the persons array
    let newPerson = {
      id: personCounter
    };
    personCounter++; // Increment the ID counter for the next object

    persons.push(newPerson);
    console.log(`Created new person with ID: ${newPerson.id}`);
    //personToRowMap - map newPerson to personRow that has 'newRow' as id
    personToRowMap.set(newPerson,personRow);
    //set thisPerson in working memory
    thisPerson=newPerson;
    personId=thisPerson;
  } else {
    //get person object
    const pid = Number(personId); // normalize type
    const idx = persons.findIndex(p => p.id === pid);
    if (idx === -1) {
      console.error(`Person with ID ${personId} not found in persons array.`);
      return;
    }
    //set thisPerson
    thisPerson=persons[idx];
  }

  //update the person object
  thisPerson.name = personRow.querySelector('#person-name').value || `Person ${pid}`;
  thisPerson.age = parseInt(personRow.querySelector('#person-current-age').value, 10) || 30;
  thisPerson.retirementAge = parseInt(personRow.querySelector('#person-retirement-age').value, 10) || 55;
  thisPerson.projectionAge = parseInt(personRow.querySelector('#person-projection-age').value, 10) || 100;
  thisPerson.incomes = thisPerson.incomes || [];
  thisPerson.savings = thisPerson.savings || [];
  console.log(`Saved person: ${thisPerson.name} (ID: ${thisPerson.id})`, thisPerson);
  
  // Replace row with display
  personRow.innerHTML = `
    <span>
    ${thisPerson.name}: Age: ${thisPerson.age} | Retirement: ${thisPerson.retirementAge} | Projection: ${thisPerson.projectionAge}

        <button type="button" id="btn-person-edit" class="btn btn-primary btn-sm edit-row">
          <i class=""></i> Edit
        </button>
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </span>  

  `;

  personRow.querySelector('.remove-row').addEventListener('click', () => removePerson(thisPerson.id));
  personRow.querySelector('.edit-row').addEventListener('click', () => editPerson(thisPerson.id));

}

function editPerson(personId){
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }
   //set person and get associated row
  const thisPerson = persons[idx];
  const personRow = personToRowMap.get(thisPerson);

    personRow.innerHTML = `
      <div class="col-lg-2">
        <label for="person-name" class="form-label">Name</label>
        <input type="text" class="form-control" id="person-name" value="${thisPerson.name}" required>
      </div>
      <div class="col-lg-2">
        <label for="person-current-age" class="form-label">Current Age</label>
        <input type="number" class="form-control" id="person-current-age" min="0" step="1" value="${thisPerson.age}"  required>
      </div>
      <div class="col-lg-2">
        <label for="person-retirement-age" class="form-label">Retirement Age</label>
        <input type="number" class="form-control" id="person-retirement-age" min="0" step="1" Value="${thisPerson.retirementAge}" required>
      </div>
      <div class="col-lg-2">
        <label for="person-projection-age" class="form-label">Projection Age</label>
        <input type="number" class="form-control" id="person-projection-age" min="0" step="1" value="${thisPerson.projectionAge}"  required>
      </div>
      <div class="col-lg-2">
        <span>
          <button type="button" id="btn-person-save" class="btn btn-primary btn-sm save-row">
            <i class="bi bi-plus"></i> Save
          </button>
          <button type="button" id="btn-person-cancel" class="btn btn-danger btn-sm remove-row">
            <i class="bi bi-trash"></i> Cancel
          </button>
        </span>
      </div>
    `;
    
    personRow.querySelector('.save-row').addEventListener('click', () => savePerson(thisPerson.id, personRow));
    personRow.querySelector('.remove-row').addEventListener('click', () => cancelEditPerson(thisPerson.id));
};

function cancelEditPerson(personId) {
  //we just need to re-render the person display
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }

  const thisPerson = persons[idx];
  const personRow = personToRowMap.get(thisPerson);

  personRow.innerHTML = `
    <span>
    ${thisPerson.name}: Age: ${thisPerson.age}, Retirement: ${thisPerson.retirementAge},  Projection: ${thisPerson.projectionAge}.

        <button type"button" class="btn btn-primary btn-sm edit-row" >
          <i class=""></i> Edit
        </button>
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
      </span>  
  `;

  personRow.querySelector('.edit-row').addEventListener('click', () => editPerson(persons[idx].id));
  personRow.querySelector('.remove-row').addEventListener('click', () => removePerson(persons[idx].id));
}

function removePerson(personId) {
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }

  const thisPerson = persons[idx];
  console.log(`Removing person: ${thisPerson.name} (id ${thisPerson.id})`);

  // Remove associated incomes safely
  if (Array.isArray(thisPerson.incomes)) {
    // keep removing the first income until none left
    while (thisPerson.incomes.length > 0) {
      const inc = thisPerson.incomes[0];
      console.log(`Removing income: ${inc.name} (id ${inc.id})`);
      // call your existing remover — it should remove from the person's incomes array
      removeIncome(inc.id);

      // defensive fallback: if removeIncome didn't remove it, shift it ourselves
      if (thisPerson.incomes.length > 0 && thisPerson.incomes[0].id === inc.id) {
        console.warn(`removeIncome didn't remove income id ${inc.id}. Forcing removal.`);
        thisPerson.incomes.shift();
      }
    }
  }

  // If you have other associated arrays (savings, assets, etc.), remove them similarly:
  if (Array.isArray(thisPerson.savings)) {
    while (thisPerson.savings.length > 0) {
      const s = thisPerson.savings[0];
      console.log(`Removing savings: ${s.name} (id ${s.id})`);
      removeSavings(thisPerson.id, s.id);
      if (thisPerson.savings.length > 0 && thisPerson.savings[0].id === s.id) {
        thisPerson.savings.shift();
      }
    }
  }

  // Remove any DOM rows that reference this person (there may be multiple)
  personToRowMap.get(thisPerson)?.remove(); // Remove main person row if exists

  // Remove the person from the array
  persons.splice(idx, 1);

  // Log a snapshot so it can't be misread later
  console.log('Person removed. Remaining person ids:', persons.map(p => p.id));
}


//Income Functions
function confirmIncome(element) {
  //sanity check  
  if (persons.length === 0) {
    alert("You must add a person before adding savings.");
    return;
  }

  //create row
  const incomeRow = document.createElement('div');
  incomeRow.className = 'row align-items-end mb-3';


  // Build the person dropdown options
  let personOptions = persons.map((p, id) => 
    `<option value="${id}">${p.name || 'Person ' + (id + 1)}</option>`
  ).join('');

  incomeRow.innerHTML = `
    <div class="col-lg-2">
      <label for="income-person" class="form-label">For?</label>
      <select class="form-select" id="income-person" required>
        ${personOptions}
      </select>
    </div>
    <div class="col-lg-2">
      <input type="text" class="form-control" id="income-name" placeholder="Source Name" value='Income' required>
    </div>
    <div class="col-lg-2">
      <input type="number" class="form-control" id="income-amount" placeholder="50000" value='50000' required>
    </div>
    <div class="col-lg-1">
      <input type="number" class="form-control" id="income-rate" placeholder="Growth Rate" min="-2" max="2" step="0.01" value='0.03' required>
    </div>
    <div class="col-lg-2">
    <span>
      <button type="button" class="btn btn-primary btn-sm" onclick="addSavings(this)">
        <i class="bi bi-plus"></i> Add
      </button>
            <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Cancel
      </button>
      </span>
    </div>
    <div class="col-lg-1">

    </div>
    `;
  
    // Append the new row to the income section
    const incomeSection = document.querySelector('#income-section');
    incomeSection.appendChild(incomeRow);

    // Add event listener to the remove button
    incomeRow.querySelector('.remove-row').addEventListener('click', () => {
      incomeRow.remove(); // Remove the income row
    });

  }

function addIncome(element) {
    // Get the parent row of the button
    let row = element.closest('.row'); // Get the parent row of the button

    // Get the selected person index
    if (!row) {
      console.error('Row element not found.');
      return;
    }
    // Check if the row has the income-person select element
    if (!row.querySelector('#income-person')) {
      console.error('Income person select element not found in the row.');
      return;
    }
    // Get the person select element
    const personSelect = row.querySelector('#income-person'); // Get the person select element from the row
    // Check if the person select element exists and has a selected index
    if (!personSelect) {
      console.error('Person select element not found.');
      return;
    }
    if (personSelect.selectedIndex < 0) {
      console.error('No person selected.');
      return;
    }
    // Get the selected index of the person
    const selectedIndex = personSelect.value; // Get the selected index of the person
    if (selectedIndex < 0 || selectedIndex >= persons.length) {
      console.error(`Invalid person index: ${selectedIndex}`);
      return;
    }
    // Get the selected person object
    const thisPerson = persons[selectedIndex]; // Get the selected person object
    if (!thisPerson) {
      console.error(`Person with index ${selectedIndex} not found.`);
      return;
    }
    console.log(`Adding income for person: ${thisPerson.name} (ID: ${thisPerson.id})`);

    const newIncome = {
      id: incomeCounter, // Use the length of incomes array to set a unique ID
      type: 'salary', // Default type, can be changed later
      name: '',
      amount: 100000,
      raise: 0.05, // Default raise rate
      inflationAdjustment: inflationRate // Default inflation adjustment
    };
    incomeCounter++; // Increment the ID counter for the next object
    if (!thisPerson.incomes) {
      thisPerson.incomes = []; // Initialize incomes array if it doesn't exist
    }
    console.log(`Creating new income with ID: ${newIncome.id} for person: ${thisPerson.name}`);
    thisPerson.incomes.push(newIncome); // Add the new income object to the selected person's incomes

    //store the income id in the row
    row.dataset.incomeId = newIncome.id; // Store the income ID in the row's dataset
    //store the person id in the row
    row.dataset.personId = thisPerson.id; // Store the person ID in the row's dataset
    console.log(`New income added for person: ${thisPerson.name} with ID: ${newIncome.id}`);

    //Clear the confirmation, add the income row
    row.innerHTML = ''; // Clear the row's inner HTML before adding new content
    // Build the income row HTML
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
          <input type="number" class="form-control" id="income-amount" min="0" step="100" value="100000" onChange="saveIncome(this)" required>
        </div>
        <div class="col-lg-2">
          <label for="income-raise" class="form-label ">Yearly Raise</label>
          <input type="number" class="form-control" id="income-raise" min="0" max="50" step="0.01" value="0.05" onChange="saveIncome(this)" required>
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
      removeIncome(row.dataset.incomeId); // Call the removeIncome function with the income ID
      //row.remove();
    });

    console.log(persons);
  }

function saveIncome(e) {
    // Get the parent row of the select element
    const row = e.closest('.row'); // Get the parent row of the dropdown
    const incomeId = row.dataset.incomeId; // Get the income ID from the row's dataset
    const personId = row.dataset.personId; // Get the person ID from the row's dataset

  
    const thisPerson = persons.find(person => person.id == personId); // Get the selected person object
    const incomeData = thisPerson.incomes.find(income => income.id == incomeId); // Get the income object from the selected person's incomes array
    if (!incomeData) {
        console.error(`Income with ID ${incomeId} not found for person ${thisPerson.name}`);
        return;
    }
    console.log(`Saving income data for person: ${thisPerson.name}, income ID: ${incomeId}`);

    
    // Update the income object with the new values
    incomeData.name = row.querySelector('#income-name').value;
    incomeData.amount = parseFloat(row.querySelector('#income-amount').value);
    incomeData.raise = parseFloat(row.querySelector('#income-raise').value);

    console.log(persons);
}

function removeIncome(incomeId) { 
    const row = document.querySelector(`[data-income-id="${incomeId}"]`); // Get the row element using the income ID
    if (!row) {
        console.error(`Row with income ID ${incomeId} not found.`);
        return;
    }
    const personId = row.dataset.personId; // Get the person ID from the row's dataset
    const person = persons.find(p => p.id == personId); // Get the selected person object
    if (!person) {
        console.error(`Person with ID ${personId} not found.`);
        return;
    }
    console.log(`Removing income with ID: ${incomeId} for person: ${person.name}`);
    // Find the income object in the selected person's incomes array
    const income = person.incomes.find(i => i.id == incomeId); // Get the income object from the selected person's incomes array
    if (!income) {
        console.error(`Income with ID ${incomeId} not found for person ${person.name}`);
        return;
    }
    // Remove the income object from the selected person's incomes array
    const incomeIndex = person.incomes.indexOf(income); // Get the index of the income object in the selected person's incomes array
    if (incomeIndex > -1) {
        person.incomes.splice(incomeIndex, 1); // Remove the income object from the selected person's incomes array
        console.log(`Removed income with ID: ${incomeId} for person: ${person.name}`);
    } else {
        console.error(`Income with ID ${incomeId} not found in person's incomes array.`);
    }
    // Remove the row from the DOM
    row.remove(); // Remove the row from the DOM

    console.log(persons);
}

//Savings Functions

function confirmSavings() {
  if (persons.length === 0) {
    alert("You must add a person before adding savings.");
    return;
  }

  const savingsRow = document.createElement('div');
  savingsRow.className = 'row align-items-end mb-3';

  // Build person dropdown
  const personOptions = persons.map((p, id) => 
    `<option value="${id}">${p.name || 'Person ' + (id + 1)}</option>`
  ).join('');

  savingsRow.innerHTML = `
  <div class="col-lg-2">
      <label for="savings-person" class="form-label">For?</label>
      <select class="form-select" id="savings-person" required>
        ${personOptions}
      </select>
    </div>
    <div class="col-lg-2">
      <label for="savings-name" class="form-label">Savings Name</label>
      <input type="text" class="form-control" id="savings-name" placeholder="TFSA" required>
    </div>
    <div class="col-lg-2">
      <label for="savings-amount" class="form-label">Amount</label>
      <input type="number" class="form-control" id="savings-amount" min="0" step="100" value="0" required>
    </div>
    <div class="col-lg-2 d-flex align-items-center">
      <div class="form-check mt-4">
        <input class="form-check-input" type="checkbox" id="savings-taxfree">
        <label class="form-check-label" for="savings-taxfree">Tax Free</label>
      </div>
      <span>
        <label class="form-label ms-3" for="savings-rate">Rate</label>
        <input type="number" class="form-control" id="savings-rate" min="-2" max="2" step="0.01" value="0.07" required>
      </span>
    </div>
    <div class="col-lg-1">
      <button type="button" class="btn btn-primary btn-sm" onclick="addSavings(this)">
        <i class="bi bi-plus"></i> Add
      </button>
    </div>
    <div class="col-lg-1">
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Cancel
      </button>
    </div>
  `;

const savingsSection = document.querySelector('#savings-section');
savingsSection.appendChild(savingsRow);


  savingsRow.querySelector('.remove-row').addEventListener('click', () => savingsRow.remove());
}

function addSavings(element) {
  const row = element.closest('.row');
  const personSelect = row.querySelector('#savings-person');
  const personIndex = personSelect.value;
  const thisPerson = persons[personIndex];

  const newSavings = {
    id: savingsCounter++,
    type: row.querySelector('#savings-name').value || 'Savings',
    name: row.querySelector('#savings-name').value || 'Savings',
    amount: parseFloat(row.querySelector('#savings-amount').value),
    taxfree: row.querySelector('#savings-taxfree').checked,
    returnRate: row.querySelector('#savings-rate').value, // default investment rate
  };

  if (!thisPerson.savings) thisPerson.savings = [];
  thisPerson.savings.push(newSavings);

  console.log(`Added savings for ${thisPerson.name}:`, newSavings);
  row.dataset.savingsId = newSavings.id;
  row.dataset.personId = thisPerson.id;


  // Replace row with display
  row.innerHTML = `
    <div class="col-lg-2"><p>${thisPerson.name}</p></div>
    <div class="col-lg-2"><p>${newSavings.name}</p></div>
    <div class="col-lg-2"><p>${newSavings.amount.toFixed(0)}</p></div>
    <div class="col-lg-2">${newSavings.taxfree ? "Tax Free" : "Taxable"}</div>
    <div class="col-lg-2"><p>${(newSavings.returnRate * 100).toFixed(2)}%</p></div>
    <div class="col-lg-1">
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Remove
      </button>
    </div>
  `;

  row.querySelector('.remove-row').addEventListener('click', () => removeSavings(thisPerson.id, newSavings.id));
}

function removeSavings(personId, savingsId) {
  // Find the person
  const person = persons.find(p => p.id == personId);
  if (!person) {
    console.error(`Person with ID ${personId} not found.`);
    return;
  }

  // Remove the savings from the person's savings array
  const index = person.savings.findIndex(s => s.id == savingsId);
  if (index > -1) {
    const removed = person.savings.splice(index, 1)[0];
    console.log(`Removed savings "${removed.name}" (ID ${savingsId}) from ${person.name}`);
  } else {
    console.warn(`Savings ID ${savingsId} not found for ${person.name}`);
  }

  // Remove the row from the DOM
  const row = document.querySelector(`.row[data-savings-id="${savingsId}"][data-person-id="${personId}"]`);
  if (row) {
    row.remove();
    console.log(`Removed savings row from DOM for ${person.name}`);
  } else {
    console.warn(`DOM row for savings ID ${savingsId} not found.`);
  }
}


//Pension Functions

//Expense Functions

//Projection
function generateProjection() {
  //person check
  if(persons.length === 0){
    alert("You must add a person to generate");
    return
  } else {
            // Find or create the container
      let container = document.getElementById('table-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'table-container';
        container.className = 'table-responsive my-4';
        document.body.appendChild(container);
      }
      container.innerHTML = '';

    for(let i=0; i<persons.length; i++){//for each person

      // Create table
      const table = document.createElement('table');
      table.className = 'table table-striped table-bordered';
      table.id = `projection-table-${persons[i].id}`; // Unique ID for each person's table
      
      //start with year and age
      let columns = ['Year','Age'];

      //load incomes
      if(persons[i].incomes.length === 0){//if this person has no incomes
        alert(`${persons[i].name} has no income`)
      } else {
        for(let j=0; j<persons[i].incomes.length; j++){
          columns.push(`${persons[i].incomes[j].name}`);
        }
      }

      //load savings
      if (persons[i].savings && persons[i].savings.length > 0) {
        for (let j = 0; j < persons[i].savings.length; j++) {
          columns.push(`${persons[i].savings[j].taxfree ? `${persons[i].savings[j].name}*` : `${persons[i].savings[j].name}`}`);
        }
      }

    

      // Header
      const thead = document.createElement('thead');
      let headerRow = `<tr><th colspan="${columns.length}"><h3>${persons[i].name}</h3></th></tr><tr>`;
      columns.forEach(col => headerRow += `<th>${col}</th>`);
      headerRow += '</tr>';
      thead.innerHTML = headerRow;

      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      let incomeAmounts = persons[i].incomes.map(income => income.amount);
      // Initialize income amounts for each income source
      // Loop through each year from current age to projection age
      for (let age = persons[i].age; age <= persons[i].projectionAge; age++) {
        const year = new Date().getFullYear() + (age - persons[i].age);
        let row = `<tr><td>${year}</td>`;
        row += `<td>${age}</td>`;

        //let totalIncome = 0;
        if (age < persons[i].retirementAge) {
          // Sum all incomes for this year
          for (let j = 0; j < persons[i].incomes.length; j++) {
            //totalIncome += incomeAmounts[j];
            // Update the amount for next year
            incomeAmounts[j] *= (1 + persons[i].incomes[j].raise);
          
            row += `<td>${incomeAmounts[j].toFixed(0)}</td>`;
          }
        } else {
          row += `<td></td>`;
        }
        if (persons[i].savings && persons[i].savings.length > 0) {
          for (let j = 0; j < persons[i].savings.length; j++) {
            const s = persons[i].savings[j];

            // Initialize yearly amount if not exists
            if (s.amountByYear === undefined) s.amountByYear = s.amount; {

              // Grow by rate (e.g., investmentRate)
              s.amountByYear *= (1 + (s.returnRate || 0)); 

              row += `<td>${s.amountByYear.toFixed(0)}</td>`;
            }
          }
        }

  row += '</tr>';
  tbody.innerHTML += row;
}
      table.appendChild(tbody);

      container.appendChild(table);
    }//end for of each person
  }//end else for person check
}

