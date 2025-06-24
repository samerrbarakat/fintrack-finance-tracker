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
    /////
    renderCurrentMonthTransactions(); // Re-render after deletion
    updateDashboard(); // To refresh overview and charts
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

let editingTransactionId = null;

function handleEditTransaction(tx) {
  editingTransactionId = tx.id;

  document.getElementById("edit-date").value = tx.date;
  document.getElementById("edit-description").value = tx.description;
  document.getElementById("edit-amount").value = tx.amount;
  document.getElementById("edit-type").value = tx.type; // Set type dropdown

  // Now populate categories based on type
  updateEditCategoryOptions(tx.type, tx.category);

  editPopup.style.display = "flex";
}

function updateEditCategoryOptions(type, selectedCategory = "") {
  const editCategorySelect = document.getElementById("edit-category");
  const key = type === "income" ? "incomeCategories" : "expenseCategories";
  const categories = JSON.parse(localStorage.getItem(key)) || [];

  editCategorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    editCategorySelect.appendChild(option);
  });
}

// Dynamically update categories in edit form when type is changed
document.getElementById("edit-type").addEventListener("change", () => {
  const selectedType = document.getElementById("edit-type").value;
  updateEditCategoryOptions(selectedType);
});



editForm.addEventListener("submit", function (e) {
  e.preventDefault();
const updatedTransaction = {
  description: document.getElementById("edit-description").value,
  amount: parseFloat(document.getElementById("edit-amount").value),
  category: document.getElementById("edit-category").value,
  date: document.getElementById("edit-date").value,
  type: document.getElementById("edit-type").value  // ← CORRECTED LINE
};

  const success = updateTransactionById(editingTransactionId, updatedTransaction);
  if (success) {
    renderCurrentMonthTransactions();
    updateDashboard();
    editPopup.style.display = "none";
    editingTransactionId = null;
  }
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
// Update savings button 
const bucketButton = document.getElementById('bucket-button');
const BucketsForm = document.getElementById('BucketsForm');
const bcloseBtn = document.getElementById('bsav_closeBtn');

bucketButton.addEventListener('click', () => {
  BucketsForm.style.display = 'flex';
});

bcloseBtn.addEventListener('click', () => {
  BucketsForm.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === BucketsForm) {
    BucketsForm.style.display = 'none';
  }
});

document.getElementById("savForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("savingsAmount").value);
  updateSavings(amount);
  updateSavingsDisplay();
  this.reset();
  document.getElementById("BucketsForm").style.display = "none";
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
    .sort((a, b) => b.id - a.id) // Optional: newest first
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

document.getElementById("bucketForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("bucketDescription").value;
  const amount = parseFloat(document.getElementById("bucketAmount").value);
  const priority = document.getElementById("bucketPriority").value;

  const item = {
    id: Date.now().toString(),
    description,
    amount,
    priority
  };

  addBucketItem(item);
  this.reset();
  document.getElementById("BucketsForm").style.display = "none";
  renderBucketList(); // Optional: if you have a function that shows them on the UI
});

function renderBucketList() {
  const bucketList = getBucketList();
  const tbody = document.getElementById("BucketListBody");
  tbody.innerHTML = "";

  bucketList.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.description}</td>
      <td>$${item.amount}</td>
      <td>${item.priority}</td>
      <td>
        <button class="edit-bucket-button">
          <img class="img-edit" src="img/edit.png" alt="Edit">
        </button>
      </td>
      <td>
        <button class="delete-bucket-button">
          <img class="img-edit" src="img/bin.png" alt="Delete">
        </button>
      </td>
    `;

    row.querySelector(".edit-bucket-button").addEventListener("click", () => {
      updateBucketItemById(item); // your function
    });

    row.querySelector(".delete-bucket-button").addEventListener("click", () => {
      deleteBucketItemById(item.id);
      renderBucketList();
    });

    tbody.appendChild(row);
  });
}


//////////////// Editing a transaction. 
// Calling these functions 
// clearLocalStorage();
initializeLocalStorage();
renderCurrentMonthTransactions() 
updateCategoryOptions();
updateDashboard();
renderBucketList(); 