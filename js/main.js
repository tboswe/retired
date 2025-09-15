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

//Object to DOM maps
const personToRowMap = new Map();

//Persons
function addPerson(){

    const personRow = document.createElement('div');
    personRow.className = 'row parent align-items-end mb-3';
  
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
      <div class="col-lg-3">
      <span>
        <button type="button" class="btn btn-primary btn-sm add-income">
          <i class="bi bi-plus"></i> Income
        </button>
        <button type="button" class="btn btn-primary btn-sm add-savings">
          <i class="bi bi-plus"></i> Savings
        </button>
        <button type="button" class="btn btn-danger btn-sm remove-row">
          <i class="bi bi-trash"></i> Remove
        </button>
        </span>
      </div>
      <!-- 🔽 Income container goes here -->
      <div class="col-12 income-section mt-3 pt-2 border-top border-bottom" style="margin-left:2rem;">
        <!-- dynamically added income rows will go here -->
      </div>
      <!-- 🔽 Savings container goes here -->
      <div class="col-12 savings-section mt-3 pt-2 border-top border-bottom" style="margin-left:2rem;">
        <!-- dynamically added income rows will go here -->
      </div>
    `;

    //create person object and add to persons array
    let newPerson = {
      id: personCounter
    };
    personCounter++; // Increment the ID counter for the next object
    
    //push person to persons array
    persons.push(newPerson);
    console.log(`Created new person with ID: ${newPerson.id}`);

    //personToRowMap - map newPerson to personRow that has 'newRow' as id
    personToRowMap.set(newPerson.id,personRow);

    //save person
    savePerson(newPerson.id);

    //Append the new row to the persons section
    const personsSection = document.querySelector('#persons-section');
    personsSection.appendChild(personRow);

    // Add event listeners to buttons
    personRow.querySelector('.remove-row').addEventListener('click', () => {removePerson(newPerson.id)}); //removePerson
    personRow.querySelector('.add-income').addEventListener('click', () => {addIncome(newPerson.id)}); //addIncome
    personRow.querySelector('.add-savings').addEventListener('click', () => {addSavings()}); //addSavings

    // Add event listeners to input fields for dynamic saving
    personRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        savePerson(newPerson.id);
      });
    });

}

function savePerson(personId){
  //find person in persons array
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }

  //set thisPerson
  thisPerson=persons[idx];
  console.log(`Saving person: ${thisPerson.name} (ID: ${thisPerson.id})`, thisPerson);

  //get associated row
  const personRow = personToRowMap.get(thisPerson.id);

  //update the person object
  thisPerson.name = personRow.querySelector('#person-name').value || `Person ${pid}`;
  thisPerson.age = parseInt(personRow.querySelector('#person-current-age').value, 10) || 30;
  thisPerson.retirementAge = parseInt(personRow.querySelector('#person-retirement-age').value, 10) || 55;
  thisPerson.projectionAge = parseInt(personRow.querySelector('#person-projection-age').value, 10) || 100;
  thisPerson.incomes = thisPerson.incomes || [];
  thisPerson.savings = thisPerson.savings || [];
  console.log(`Saved person: ${thisPerson.name} (ID: ${thisPerson.id})`, thisPerson);
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
  personToRowMap.get(thisPerson.id)?.remove(); // Remove main person row if exists
  personToRowMap.delete(thisPerson.id); // Remove from map

  document.querySelectorAll(`[data-person-id="${thisPerson.id}"]`).forEach(row => {
    row.remove();
    console.log(`Removed associated row with data-person-id ${thisPerson.id}`);
  });

  // Remove the person from the array
  persons.splice(idx, 1);

  // Log a snapshot so it can't be misread later
  console.log('Person removed. Remaining person ids:', persons.map(p => p.id));
}


//Income Functions
function addIncome(personId) {
  //get personRow from personToRowMap
  let personRow = personToRowMap.get(personId);
  if (!personRow) {
    console.error(`Person row for person ID ${personId} not found.`);
    return;
  }

  //get incomeSection within personRow
  let incomeSection = personRow.querySelector('.income-section');

  //create income row
  const incomeRow = document.createElement('div');
  incomeRow.className = 'row mb-2';

  //find person in persons array
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }

  let thisPerson = persons[idx];
  console.log(`Adding income for person: ${thisPerson.name} (ID: ${thisPerson.id})`);

  incomeRow.innerHTML = `
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
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Remove
      </button>
      </span>
    </div>
    <div class="col-lg-1">

    </div>
    `;

    // Create new income object and add to thisPerson.incomes
    const newIncome = {
      id: incomeCounter++, // Unique ID
      type: 'salary', // Default type
      name: incomeRow.querySelector('#income-name').value || 'Income',
      amount: parseFloat(incomeRow.querySelector('#income-amount').value) || 50000,
      raise: parseFloat(incomeRow.querySelector('#income-rate').value) || 0.03,
    };

    // Add event listener to the remove button
    incomeRow.querySelector('.remove-row').addEventListener('click', () => {
      removeIncome(incomeId); // Remove the income row
    });

    // Add event listeners to input fields for dynamic saving
    incomeRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        saveIncome(newIncome.id);
      });
    });

    // Append the income row to the income section
    incomeSection.appendChild(incomeRow);

  }

function saveIncome(incomeId) {
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

