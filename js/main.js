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
      incomes: [],
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

    console.log(persons);
}

function savePerson(element){

    const personRow = element.closest('.row'); // Get the parent row of the input element
    console.log(`Saving person data for row: ${personRow.dataset.personId}`);
    const personId = personRow.dataset.personId; // Get the id of the person from the row's dataset

    // Update the corresponding person object in the persons array  
    if (personId !== undefined) {
        const person = persons.find(person => person.id == personId);
        console.log(`we found ${person.name} with id ${person.id}`);
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

    console.log(persons);
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
  const personRow = document.querySelector(`.row.align-items-end.mb-3[data-person-id="${thisPerson.id}"]`);
  console.log(`Person Row: ${personRow.dataset.personId}`);
  if (personRow) {
    personRow.remove(); // Remove the row from the DOM
    let idx = persons.findIndex(person => person.id == thisPerson.id);
    if (idx !== -1) {
      persons.splice(idx, 1); // Remove the person from the persons array
      console.log(`Removed ${thisPerson.name} from persons array.`);
    } else {
      console.error(`Person with ID ${thisPerson.id} not found in persons array.`);
    }
  } else {
    console.error(`${thisPerson.name} not found.`);
  }

  console.log(persons);
}

//Income Functions
function confirmIncome(element) {
    const incomeRow = document.createElement('div');
    incomeRow.className = 'row align-items-end mb-3'; // Add a class for styling

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
      removeIncome(row); // Call the removeIncome function with the row
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
    incomeData.inflationAdjustment = parseFloat(row.querySelector('#income-inflation').value);

    console.log(persons);
}

function removeIncome(e) { 
    row = e; // Get the row element from the event
    const incomeId = row.dataset.incomeId; // Get the income ID from the row's dataset
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

//Pension Functions

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

