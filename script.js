// useful functions 
function getDaysInCurrentMonth() { // gets the number of days in current month 
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
console.log(getDaysInCurrentMonth());

const pieCtx = document.getElementById('pieChart').getContext('2d'); // reference ot pie chart 
const ctx = document.getElementById('lineChart').getContext('2d');// reference to line chart 

const lineChart = new Chart(ctx, {// initialize line chart 
  type: 'line',
  data: {
    labels: [], // initialli empty 
    datasets: [
      {
        label: 'Expenses',
        data: [],  // initialli empty 
        borderColor: '#e74c3c',  // Red for expenses
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Balance',
        data: [], // initially empty 
        borderColor: '#2ecc71',  // Green for balance
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false  
      }
    }
  }
});

const pieChart = new Chart(pieCtx, { // initialize the pie chart 
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
  '#d62839',
  '#ba324f', 
  '#175676', 
  '#4ba3c3', 
  '#cce6f4'  
], 
    }]
  },
  options: {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#f1f1f1',  
        font: {
          size: 14
        }
      }
    }
  }
}
});

function updateCharts() { // render the updated data of both charts. 
  const expenseData = getDailyExpensesThisMonth(); // storage function 
  const balanceData = getDailyBalanceVariation();  // storage function 
  const categoryData = getExpenseCategoryDistribution(); // storage function 

  lineChart.data.labels = [...Array(expenseData.length).keys()].map(i => i + 1);
  lineChart.data.datasets[0].data = expenseData;
  lineChart.data.datasets[1].data = balanceData;
  lineChart.update();

  pieChart.data.labels = Object.keys(categoryData);
  pieChart.data.datasets[0].data = Object.values(categoryData);
  pieChart.update();
}
function updateLastIncomeExpense() {
  const income = getLastIncome();
  const expense = getLastExpense();
  document.querySelector(".fastdiv:nth-child(2) h5").textContent = `+ ${income.value}$`;
  document.querySelector(".fastdiv:nth-child(2) p").textContent = income.description;
  document.querySelector(".fastdiv:nth-child(1) h5").textContent = `- ${expense.value}$`;
  document.querySelector(".fastdiv:nth-child(1) p").textContent = expense.description;
}

// New transaction button
const openBtn = document.getElementById("new-transaction-button");
const closeBtn = document.getElementById("closePopupBtn");
const popup = document.getElementById("popupForm");

openBtn.addEventListener("click", () => {
popup.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
popup.style.display = "none";
});

window.addEventListener("click", (e) => {
if (e.target === popup) {
    popup.style.display = "none";
}
});


document.getElementById("transactionForm").addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Transaction processing started"); 
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("Category").value;
    const date = new Date().toISOString().split('T')[0];
    const id = Date.now(); // Generate unique ID

    const transaction = { id, description, amount, type, category, date };

    processTransaction(transaction);  // storage function 
    updateDashboard() ;     // UI function 

    this.reset();
    document.getElementById("popupForm").style.display = "none";
    console.log("Transaction processing ended"); 

});

function updateBalanceDisplay() {
  document.querySelector("#balance-box h5").textContent = `${getBalance()}$`;
}

function updateSavingsDisplay() {
  document.querySelector("#savings-box h5").textContent = `${getSavings()}$`;
}

function updateLastIncomeExpense() {
  const lastIncome = getLastIncome();   // { description, value }
  const lastExpense = getLastExpense(); // { description, value }

  if (lastIncome) {
    document.querySelector("#last-income-box h5").textContent = `+${lastIncome.value}$`;
    document.querySelector("#last-income-box p").textContent = lastIncome.description;
  }

  if (lastExpense) {
    document.querySelector("#last-expense-box h5").textContent = `-${lastExpense.value}$`;
    document.querySelector("#last-expense-box p").textContent = lastExpense.description;
  }
} ; 


const editPopup = document.getElementById("editPopup");
const closeEditBtn = document.getElementById("closeEditPopupBtn");
const editForm = document.getElementById("editTransactionForm");

let editingRow = null;

document.querySelectorAll(".edit-transaction-button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");

    // Fill the transaction edit form
    document.getElementById("edit-date").value = cells[0].innerText.trim();
    document.getElementById("edit-description").value = cells[1].innerText.trim();
    document.getElementById("edit-amount").value = cells[2].innerText.replace("$", "").trim();
    document.getElementById("edit-category").value = cells[3].innerText.trim();

    editingRow = row;
    editPopup.style.display = "flex";
  });
});


  // Handle form submission
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!editingRow) return;

    const cells = editingRow.querySelectorAll("td");
    cells[0].innerText = document.getElementById("edit-date").value;
    cells[1].innerText = document.getElementById("edit-description").value;
    cells[2].innerText = `$${parseFloat(document.getElementById("edit-amount").value).toFixed(2)}`;
    cells[3].innerText = document.getElementById("edit-category").value;

    editPopup.style.display = "none";
    editingRow = null;
  });

  // Close popup
  closeEditBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
    editingRow = null;
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editPopup) {
      editPopup.style.display = "none";
      editingRow = null;
    }
  });
// Update savings button 
const editButton = document.getElementById('edit-button');
const savingsForm = document.getElementById('savingsForm');
const scloseBtn = document.getElementById('sav_closeBtn');

editButton.addEventListener('click', () => {
  savingsForm.style.display = 'flex';
});

scloseBtn.addEventListener('click', () => {
  savingsForm.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === savingsForm) {
    savingsForm.style.display = 'none';
  }
});


document.getElementById("savForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("savingsAmount").value);
  updateSavings(amount);
  updateSavingsDisplay();
  this.reset();
  document.getElementById("savingsForm").style.display = "none";
});

function updateDashboard() {
  updateBalanceDisplay(); // UI func
  updateSavingsDisplay(); // UI func
  updateLastIncomeExpense(); // UI func
  updateCharts(); // UI func 
}
////////////// 
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("Category");

function updateCategoryOptions() {
  let categories = [];
  if (typeSelect.value === "income") {
    categories = JSON.parse(localStorage.getItem("incomeCategories")) || [];
  } else if (typeSelect.value === "expense") {
    categories = JSON.parse(localStorage.getItem("expenseCategories")) || [];
  }
  
  // Clear existing options
  categorySelect.innerHTML = "";
  
  // Populate new options
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}
typeSelect.addEventListener("change", () => {
  updateCategoryOptions();
});
////////////////////////////////////
const categoryPopup = document.getElementById("categoryPopup");
const closeCategoryPopup = document.getElementById("closeCategoryPopup");
const categoryForm = document.getElementById("categoryForm");
// Close popup
document.getElementById("addCategoryBtn").addEventListener("click", () => {
  categoryPopup.style.display = "flex";
});
closeCategoryPopup.addEventListener("click", () => {
  categoryPopup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === categoryPopup) {
    categoryPopup.style.display = "none";
  }
});

// Handle form submission
categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("categoryType").value;
  const name = document.getElementById("categoryName").value.trim();
  
  if (!name) {
    alert("Category name cannot be empty.");
    return;
  }
  
  const key = type === "income" ? "incomeCategories" : "expenseCategories";
  const categories = JSON.parse(localStorage.getItem(key)) || [];
  
  if (categories.includes(name)) {
    alert("Category already exists.");
    return;
  }
  
  categories.push(name);
  localStorage.setItem(key, JSON.stringify(categories));
  alert(`Category "${name}" added successfully.`);
  
  categoryPopup.style.display = "none";
  categoryForm.reset();
  
  // Optional: update category dropdown in your transaction form if open
  if (document.getElementById("type").value === type) {
    updateCategoryOptions();
  }
});
// rendering transadctions : 
function renderCurrentMonthTransactions() {
  const transactions = getAllTransactions(); // from storage
  const tbody = document.getElementById("transactionsBody");
  tbody.innerHTML = ""; // Clear existing rows

  const now = new Date();
  const currMonth = now.getMonth();
  const currYear = now.getFullYear();

  transactions
    .filter(tx => {
      const date = new Date(tx.date);
      return date.getMonth() === currMonth && date.getFullYear() === currYear;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Optional: newest first
    .forEach(tx => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td>${tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}$</td>
        <td>${tx.category}</td>
        <td><button class="edit-transaction-button"><img class="img-edit" src="img/edit.png" alt="Edit"></button></td>
        <td><button class="delete-transaction-button"><img class="img-edit" src="img/bin.png" alt="bin"></button></td>
      `;

      // Add event listeners (editing, deleting)
      row.querySelector(".edit-transaction-button").addEventListener("click", () => {
        handleEditTransaction(tx);
      });

      row.querySelector(".delete-transaction-button").addEventListener("click", () => {
        deleteTransactionById(tx.id);
        renderCurrentMonthTransactions(); // Re-render after deletion
        updateDashboard(); // To refresh overview and charts
      });

      tbody.appendChild(row);
    });
}

// Calling these functions 
// clearLocalStorage();
initializeLocalStorage();
renderCurrentMonthTransactions() 
updateCategoryOptions();
updateDashboard();