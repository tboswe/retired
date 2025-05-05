
//
// Place any custom JS here
//

import * as bootstrap from 'bootstrap'

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
  };