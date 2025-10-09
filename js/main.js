//Imports
//import * as bootstrap from 'bootstrap'

//Global Variables
//counters for unique id generation
let personCounter = 0;
let incomeCounter = 0;
let savingsCounter = 0;
const defaultIndexationRate = 0.03;
const defaultInflationRate = 0.03;
const defaultGrowthRate = 0.07;


//storage
const persons = []; // Array to hold person objects

//Objects
const person = {
  id: Number, 
  name: String,
  age: Number,
  retirementAge: Number,
  projectionAge: Number,
  region: String,
  incomes: [],
  savings: [],
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

/*Planned for future use
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
};*/

//Object to DOM maps
const personToRowMap = new Map();
const incomeToRowMap = new Map();
const savingsToRowMap = new Map();

//import/export buttons
// Encryption import/export utilities using Web Crypto API
// Usage note: replace getAppData() and applyImportedData(data) with your app's functions.

//encryption helpers
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
const KDF_ITERATIONS = 250000; // adjustable: higher = slower but stronger
const SALT_BYTES = 16;
const IV_BYTES = 12; // recommended for AES-GCM

//Wire Buttons
document.addEventListener('DOMContentLoaded', () => {
  const db = document.getElementById('addPerson-btn');
  const eb = document.getElementById('export-btn');
  const ib = document.getElementById('import-btn');

  if (db) db.addEventListener('click', () => addPerson(0));
  if (eb) eb.addEventListener('click', exportData);
  if (ib) ib.addEventListener('click', importData);
});

// Helpers: ArrayBuffer <-> base64
function bufToBase64(buf) {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}
function base64ToBuf(b64) {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

// Derive AES-GCM key via PBKDF2 from password and salt
async function deriveKeyFromPassword(password, salt, iterations = KDF_ITERATIONS) {
  const pwUtf8 = TEXT_ENCODER.encode(password);
  const baseKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return key;
}

async function encryptJsonObject(obj, password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKeyFromPassword(password, salt, KDF_ITERATIONS);

  const plaintext = TEXT_ENCODER.encode(JSON.stringify(obj));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

  return {
    version: 1,
    alg: 'AES-GCM',
    kdf: 'PBKDF2',
    iterations: KDF_ITERATIONS,
    salt: bufToBase64(salt.buffer),
    iv: bufToBase64(iv.buffer),
    data: bufToBase64(ciphertext)
  };
}

async function decryptToJsonObject(fileObj, password) {
  if (!fileObj.salt || !fileObj.iv || !fileObj.data) throw new Error('File missing required fields.');
  const saltBuf = base64ToBuf(fileObj.salt);
  const ivBuf = base64ToBuf(fileObj.iv);
  const dataBuf = base64ToBuf(fileObj.data);

  const key = await deriveKeyFromPassword(password, new Uint8Array(saltBuf), fileObj.iterations || KDF_ITERATIONS);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(ivBuf) }, key, dataBuf);
  const jsonText = TEXT_DECODER.decode(plainBuf);
  return JSON.parse(jsonText);
}

// File download helper
function downloadObjectAsFile(obj, filename = 'export.enc.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Return the data to export (any JSON-serializable object)
function getAppData() {
  return persons.length > 0 ? { persons } : null;
}

  
// Apply imported data back to the app. Implement as needed.
function applyImportedData(obj) {
  // Example: if obj has persons array, replace current persons
  if (Array.isArray(obj.persons)) {
    persons.length = 0; // clear current
    // Rebuild the UI as needed
    document.getElementById('persons-section').innerHTML = '';
    personToRowMap.clear();
    incomeToRowMap.clear();
    savingsToRowMap.clear();
    //re-add all persons from obj.persons, let the function do it's job
    obj.persons.forEach(p => {
      //add the person first
      addPerson(p.id);
      //once p is added, set the DOM
      personToRowMap.get(p.id).querySelector('#person-name').value = p.name || `Person ${p.id}`;
      personToRowMap.get(p.id).querySelector('#person-current-age').value = p.age || 30;
      personToRowMap.get(p.id).querySelector('#person-retirement-age').value = p.retirementAge || 55;
      personToRowMap.get(p.id).querySelector('#person-projection-age').value = p.projectionAge || 100;
      //once DOM set, call savePerson to set object properly
      savePerson(p.id);
      //add the incomes for that person
      p.incomes.forEach(i => {
        //add the income to the person
        addIncome(p.id);
        //once income added, set the DOM
        incomeToRowMap.get(i.id).querySelector('#income-name').value = i.name || 'Income';
        incomeToRowMap.get(i.id).querySelector('#income-amount').value = i.amount || 50000;
        incomeToRowMap.get(i.id).querySelector('#income-rate').value = i.raise || 0.03;
        //once DOM set, call updateIncome to set object properly
        updateIncome(i.id);
      });
      //add the savings for that person
      p.savings.forEach(s => {
        //add the savings to the person
        addSavings(p.id);
        //once savings added, set the DOM
        savingsToRowMap.get(s.id).querySelector('#savings-name').value = s.name || 'Savings';
        savingsToRowMap.get(s.id).querySelector('#savings-amount').value = s.amount || 10000;
        savingsToRowMap.get(s.id).querySelector('#savings-taxfree').checked = s.taxfree || false;
        savingsToRowMap.get(s.id).querySelector('#savings-returnRate').value = s.returnRate || 0.07;
        //once DOM set, call updateSavings to set object properly
        updateSavings(s.id);
      });
    })
  }
}

// Export flow
async function exportData() {
  try {
    const data = getAppData();
    if (!data) { alert('No data available to export.'); return; }

    // Ask user for a password
    const password = prompt('Enter a password to encrypt your export file (do NOT forget it):');
    if (password === null) return; // user cancelled
    if (password.length === 0) {
      if (!confirm('You entered an empty password. This will create an unencrypted export. Continue?')) return;
      // produce plaintext export
      downloadObjectAsFile({ version: 1, alg: 'none', data: data }, `export-${new Date().toISOString()}.json`);
      return;
    }

    // Encrypt and download
    const encObj = await encryptJsonObject(data, password);
    const filename = `export-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.enc.json`;
    downloadObjectAsFile(encObj, filename);
    alert('Exported encrypted file. Keep your password safe.');
  } catch (err) {
    console.error(err);
    alert('Export failed: ' + (err && err.message ? err.message : String(err)));
  }
}

// Import flow
function importData() {
  // create file input if not present
  let fi = document.getElementById('__import-file-input');
  if (!fi) {
    fi = document.createElement('input');
    fi.type = 'file';
    fi.accept = '.json,.enc.json,application/json';
    fi.style.display = 'none';
    fi.id = '__import-file-input';
    document.body.appendChild(fi);
    fi.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      fi.value = ''; // reset
      if (!f) return;
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);

        if (parsed.alg === 'none') {
          // plaintext export
          if (!confirm('File appears to be unencrypted. Do you want to import it?')) return;
          applyImportedData(parsed.data);
          alert('Imported plaintext data.');
          return;
        }

        // encrypted file
        const password = prompt('Enter the password to decrypt the import file:');
        if (password === null) return; // cancelled

        try {
          const decrypted = await decryptToJsonObject(parsed, password);
          applyImportedData(decrypted);
          alert('Import successful.');
        } catch (decryptErr) {
          console.error(decryptErr);
          alert('Decryption failed. Wrong password or corrupted file.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to read/parse file: ' + (err.message || err));
      }
    });
  }
  fi.click();
}

// Load locations JSON
async function loadSupportedLocations() {
  try {
    const res = await fetch('data/supported_locations.json');
    if (!res.ok) throw new Error('Failed to load locations JSON');
    const data = await res.json();
    // data now has { countries: {...}, regions: {...} }
    return data;
  } catch (err) {
    console.error('Error loading locations:', err);
    return null;
  }
}


//Persons
function addPerson(pid){
    const personRow = document.createElement('div');
    personRow.className = 'row parent align-items-end mb-3';

    let newPerson;
    //if pid = 0, it's a new add
    if(pid == 0){
      newPerson = {
        id: personCounter
      };
      personCounter++ //increment the counter
      console.log(`Created new person with ID: ${newPerson.id}`);
    } else { //otherwise it's an import
      newPerson = {
        id: pid
      }
      personCounter = pid+1 //push counter past given id to avoid collisions
      console.log(`imported person with ID: ${newPerson.id}`);
    }
    
    //push person to persons array
    persons.push(newPerson);
    
    personRow.innerHTML = `
      <div class="col-lg-2">
        <label for="person-name" class="form-label">Name</label>
        <input type="text" class="form-control" id="person-name" placeholder="Johnny" value="Johnny" required>
      </div>
      <div class="col-lg-1">
        <label for="person-current-age" class="form-label">Current Age</label>
        <input type="number" class="form-control" id="person-current-age" min="0" step="1" value="30"  required>
      </div>
      <div class="col-lg-1">
        <label for="person-retirement-age" class="form-label">Retirement Age</label>
        <input type="number" class="form-control" id="person-retirement-age" min="0" step="1" Value="55" required>
      </div>
      <div class="col-lg-1">
        <label for="person-projection-age" class="form-label">Projection Age</label>
        <input type="number" class="form-control" id="person-projection-age" min="0" step="1" value="100"  required>
      </div>
      <div class="col-lg-2">
        <select class="form-select" id="person-location-region">
          <option value="">Select Region</option>
        </select>
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
        <!-- dynamically added savings rows will go here -->
      </div>
    `;
    


  //personToRowMap - map newPerson to personRow that has 'newRow' as id
  personToRowMap.set(newPerson.id, personRow);

  //save person
  savePerson(newPerson.id);

  //Append the new row to the persons section
  const personsSection = document.querySelector('#persons-section');
  personsSection.appendChild(personRow);

  //Populate region dropdown
  const regionSelect = personRow.querySelector('#person-location-region');
  loadSupportedLocations().then(locData => {
    if (locData && locData.regions) {
      for (const regionCode in locData.regions) {
        const option = document.createElement('option');
        option.value = regionCode;
        option.textContent = locData.regions[regionCode].name;
        regionSelect.appendChild(option);
      }
    }
  });
  
  // Add event listeners to buttons
  personRow.querySelector('.remove-row').addEventListener('click', () => { removePerson(newPerson.id) }); //removePerson
  personRow.querySelector('.add-income').addEventListener('click', () => { addIncome(newPerson.id) }); //addIncome
  personRow.querySelector('.add-savings').addEventListener('click', () => { addSavings(newPerson.id) }); //addSavings

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
  thisPerson.region = personRow.querySelector('#person-location-region').value || 'QC-CA';
  thisPerson.incomes = thisPerson.incomes || [];
  thisPerson.savings = thisPerson.savings || [];
  console.log(`Saved person: ${thisPerson.name} (ID: ${thisPerson.id})`, thisPerson);

      //reset projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();
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
      deleteSavings(thisPerson.id, s.id);
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
  
    //reset     alert("You must add a person to generate");projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();
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
    <div class="col-lg-2 d-flex align-items-center">
      <input type="text" class="form-control" id="income-name" placeholder="Source Name" value='Income' required>
    </div>
    <div class="col-lg-2 d-flex align-items-center">
      <input type="number" class="form-control" id="income-amount" min="-1000000" max="1000000000" step="5000" value='50000' required>
    </div>
    <div class="col-lg-1 d-flex align-items-center">
      <input type="number" class="form-control" id="income-rate" placeholder="Growth Rate" min="-2" max="2" step="0.01" value='0.03' required>
    </div>
    <div class="col-lg-2 d-flex align-items-center">
    <span class="d-flex align-items-center">
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Remove
      </button>
      </span>
    </div>
    `;

    // Create new income object and add to thisPerson.incomes
    const newIncome = {
      id: incomeCounter, // Unique ID
      type: 'salary', // Default type
      name: incomeRow.querySelector('#income-name').value || 'Income',
      amount: parseFloat(incomeRow.querySelector('#income-amount').value) || 50000,
      raise: parseFloat(incomeRow.querySelector('#income-rate').value) || 0.03,
    };
    incomeCounter++; // Increment the ID counter for the next income

    //push new income to person's income array
    if (!thisPerson.incomes) thisPerson.incomes = [];
    thisPerson.incomes.push(newIncome);
    console.log(`Added income for ${thisPerson.name}:`, newIncome);

    // Set income to row map
    incomeToRowMap.set(newIncome.id, incomeRow);

    // Set data attributes for easy lookup
    incomeRow.dataset.incomeId = newIncome.id;
    incomeRow.dataset.personId = thisPerson.id;

    // Save the income immediately
    updateIncome(newIncome.id);

    // Add event listener to the remove button
    incomeRow.querySelector('.remove-row').addEventListener('click', () => {
      removeIncome(newIncome.id); // Remove the income row
    });

    // Add event listeners to input fields for dynamic saving
    incomeRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        updateIncome(newIncome.id);
      });
    });

    // Append the income row to the income section
    incomeSection.appendChild(incomeRow);
  }

function updateIncome(incomeId) {
    const thisIncomeId = Number(incomeId); // normalize type
    // Find the income row in the DOM
    const incomeRow = incomeToRowMap.get(thisIncomeId);
    if (!incomeRow) {
        console.error(`Row with income ID ${incomeId} not found.`);
        return;
    }
    //find the person in persons array
    const personId = incomeRow.dataset.personId; // Get the person ID from the row's dataset
    const pid = Number(personId); // normalize type
    const personIdx = persons.findIndex(p => p.id == pid); // Get the selected person object
    if (personIdx === -1) {
        console.error(`Person with ID ${personId} not found.`);
        return;
    }
    const thisPerson = persons[personIdx];

    // Find the income object in the selected person's incomes array
    const thisIncome = thisPerson.incomes.find(income => income.id == incomeId); // Get the income object from the selected person's incomes array
    if (!thisIncome) {
        console.error(`Income with ID ${incomeId} not found for person ${thisPerson.name}`);
        return;
    }

    // Update the income object with values from the input fields
    thisIncome.name = incomeRow.querySelector('#income-name').value || 'Income';
    thisIncome.amount = parseFloat(incomeRow.querySelector('#income-amount').value) || 50000;
    thisIncome.raise = parseFloat(incomeRow.querySelector('#income-rate').value) || 0.03;
    console.log(`Saved income for ${thisPerson.name}:`, thisIncome);

        //reset projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();
}

function removeIncome(incomeId) { 
    const incomeRow = incomeToRowMap.get(incomeId);
    if (!incomeRow) {
        console.error(`Row with income ID ${incomeId} not found.`);
        return;
    }
    const personId = incomeRow.dataset.personId; // Get the person ID from the row's dataset
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
    incomeRow.remove(); // Remove the row from the DOM

    console.log(persons);

        //reset projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();
}

//Savings Functions

function addSavings(personId) {
  //get personRow from personToRowMap
  let personRow = personToRowMap.get(personId);
  if (!personRow) {
    console.error(`Person row for person ID ${personId} not found.`);
    return;
  }

  //get savingsSection within personRow
  let savingsSection = personRow.querySelector('.savings-section');

  //create savings row
  const savingsRow = document.createElement('div');
  savingsRow.className = 'row mb-2';

  //find person in persons array
  const pid = Number(personId); // normalize type
  const idx = persons.findIndex(p => p.id === pid);
  if (idx === -1) {
    console.error(`Person with ID ${personId} not found in persons array.`);
    return;
  }

  let thisPerson = persons[idx];
  console.log(`Adding savings for person: ${thisPerson.name} (ID: ${thisPerson.id})`);

  savingsRow.innerHTML = `
    <div class="col-lg-2 d-flex align-items-center">
      <input type="text" class="form-control" id="savings-name" value="Savings" required>
    </div>
    <div class="col-lg-2 d-flex align-items-center">
      <input type="number" class="form-control" id="savings-amount" min="0" step="1000" value="10000" required>
    </div>
    <div class="col-lg-3 d-flex align-items-center">
      <label for="savings-returnRate" class="form-label me-2 mb-0" style="white-space: nowrap;">Return Rate</label>
      <input type="number" class="form-control" id="savings-returnRate" min="-2" max="2" step="0.01" value="0.07" required>
    </div>
    <div class="col-lg-1 d-flex align-items-center">
      <span>
        <input class="form-check-input" type="checkbox" id="savings-taxfree">
        <i class="form-check-label" for="savings-taxfree">Tax Free</i>
      </span>
    </div>
    <div class="col-lg-2 d-flex align-items-center">
      <button type="button" class="btn btn-danger btn-sm remove-row">
        <i class="bi bi-trash"></i> Remove
      </button>
    </div>
  `;

    // Create new savings object and add to thisPerson.savings
    const newSavings= {
      id: savingsCounter, // Unique ID
      type: 'cash',
      name: savingsRow.querySelector('#savings-name').value || 'Savings',
      amount: parseFloat(savingsRow.querySelector('#savings-amount').value) || 10000,
      taxfree: savingsRow.querySelector('#savings-taxfree').checked || false,
      returnRate: parseFloat(savingsRow.querySelector('#savings-returnRate').value) || 0.07,
    };
    savingsCounter++; // Increment the ID counter for the next savings

    //push new savings to person's savings array
    if (!thisPerson.savings) thisPerson.savings = [];
    thisPerson.savings.push(newSavings);
    console.log(`Added savings for ${thisPerson.name}:`, newSavings);

    // Set savings to row map
    savingsToRowMap.set(newSavings.id, savingsRow);

    // Set data attributes for easy lookup
    savingsRow.dataset.savingsId = newSavings.id;
    savingsRow.dataset.personId = thisPerson.id;

    // Save the savings immediately
    updateSavings(newSavings.id);

    // Add event listener to the remove button
    savingsRow.querySelector('.remove-row').addEventListener('click', () => {
      deleteSavings(newSavings.id); // Remove the savings row
    });

    // Add event listeners to input fields for dynamic saving
    savingsRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        updateSavings(newSavings.id);
      });
    });

    // Append the savings row to the savings section
    savingsSection.appendChild(savingsRow);
}

function updateSavings(savingsId){
    const thisSavingsId = Number(savingsId); // normalize type
    // Find the savings row in the DOM
    const savingsRow = savingsToRowMap.get(thisSavingsId);
    if (!savingsRow) {
        console.error(`Row with savings ID ${savingsId} not found.`);
        return;
    }
    //find the person in persons array
    const personId = savingsRow.dataset.personId; // Get the person ID from the row's dataset
    const pid = Number(personId); // normalize type
    const personIdx = persons.findIndex(p => p.id == pid); // Get the selected person object
    if (personIdx === -1) {
        console.error(`Person with ID ${personId} not found.`);
        return;
    }
    const thisPerson = persons[personIdx];

    // Find the savings object in the selected person's savingss array
    const thisSavings = thisPerson.savings.find(savings => savings.id == savingsId); // Get the savings object from the selected person's savingss array
    if (!thisSavings) {
        console.error(`savings with ID ${savingsId} not found for person ${thisPerson.name}`);
        return;
    }

    // Update the savings object with values from the input fields
    thisSavings.name = savingsRow.querySelector('#savings-name').value || 'savings';
    thisSavings.amount = parseFloat(savingsRow.querySelector('#savings-amount').value) || 50000;
    thisSavings.taxfree = savingsRow.querySelector('#savings-taxfree').checked || false,
    thisSavings.returnRate = parseFloat(savingsRow.querySelector('#savings-returnRate').value) || 0.03;
    console.log(`Updated savings for ${thisPerson.name}:`, thisSavings);

        //reset projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();

}

function deleteSavings(savingsId) {
    const savingsRow = savingsToRowMap.get(savingsId);
    if (!savingsRow) {
        console.error(`Row with savings ID ${savingsId} not found.`);
        return;
    }
    const personId = savingsRow.dataset.personId; // Get the person ID from the row's dataset
    const person = persons.find(p => p.id == personId); // Get the selected person object
    if (!person) {
        console.error(`Person with ID ${personId} not found.`);
        return;
    }
    console.log(`Removing savings with ID: ${savingsId} for person: ${person.name}`);
    // Find the savings object in the selected person's savings array
    const savings = person.savings.find(i => i.id == savingsId); // Get the savings object from the selected person's savings array
    if (!savings) {
        //console.error(`savings with ID ${savingsId} not found for person ${person.name}`);
        return;
    }
    // Remove the savings object from the selected person's savings array
    const savingsIndex = person.savings.indexOf(savings); // Get the index of the savings object in the selected person's savings array
    if (savingsIndex > -1) {
        person.savings.splice(savingsIndex, 1); // Remove the savings object from the selected person's savingss array
        console.log(`Removed savings with ID: ${savingsId} for person: ${person.name}`);
    } else {
        console.error(`savings with ID ${savingsId} not found in person's savingss array.`);
    }
    // Remove the row from the DOM
    savingsRow.remove(); // Remove the row from the DOM
    //reset projection
    let container = document.getElementById('projection-section');
    container.innerHTML = '';
    generateProjection();
}

function generateProjection() {
  const containerId = 'projection-section';
  let container = document.getElementById(containerId);

  if (persons.length === 0) {
    if (container) container.innerHTML = '';
    return;
  }

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'table-responsive my-4';
    document.body.appendChild(container);
  }
  container.innerHTML = '';

  const currentYear = new Date().getFullYear();

  for (const person of persons) {
    const table = document.createElement('table');
    table.className = 'table table-striped table-bordered table-sm';
    table.id = `projection-table-${person.id}`;

    const columns = ['Year', 'Age'];
    person.incomes.forEach(inc => columns.push(inc.name));
    person.savings.forEach(sav =>
      columns.push(sav.taxfree ? `${sav.name}*` : sav.name)
    );

    const thead = document.createElement('thead');
    let headerRow = `<tr><th colspan="${columns.length}"><h3>${person.name}</h3></th></tr><tr>`;
    columns.forEach(col => (headerRow += `<th>${col}</th>`));
    headerRow += '</tr>';
    thead.innerHTML = headerRow;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const incomeAmounts = person.incomes.map(i => i.amount);
    const savingsAmounts = person.savings.map(s => s.amount);
    let rowsHTML = '';

    for (let age = person.age; age <= person.projectionAge; age++) {
      const year = currentYear + (age - person.age);
      let row = `<tr><td>${year}</td><td>${age}</td>`;

      for (let j = 0; j < person.incomes.length; j++) {
        const val = age < person.retirementAge ? incomeAmounts[j].toFixed(0) : '';
        row += `<td>${val}</td>`;
        if (age < person.retirementAge && age < person.projectionAge)
          incomeAmounts[j] *= (1 + person.incomes[j].raise);
      }

      for (let j = 0; j < person.savings.length; j++) {
        row += `<td>${savingsAmounts[j].toFixed(0)}</td>`;
        savingsAmounts[j] *= (1 + person.savings[j].returnRate);
      }

      row += '</tr>';
      rowsHTML += row;
    }

    tbody.innerHTML = rowsHTML;
    table.appendChild(tbody);
    container.appendChild(table);
  }
}


