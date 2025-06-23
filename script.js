// useful functions 
function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
console.log(getDaysInCurrentMonth());



const pieCtx = document.getElementById('pieChart').getContext('2d');
const ctx = document.getElementById('lineChart').getContext('2d');

const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Expenses',
        data: [],
        borderColor: '#e74c3c',  // Red for expenses
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Balance',
        data: [],
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
function updateCharts() {
  const expenseData = getDailyExpensesThisMonth();  
  const balanceData = getDailyBalanceVariation();  
  const categoryData = getExpenseCategoryDistribution(); 

  lineChart.data.labels = [...Array(expenseData.length).keys()].map(i => i + 1);
  lineChart.data.datasets[0].data = expenseData;
  lineChart.data.datasets[1].data = balanceData;
  lineChart.update();

  pieChart.data.labels = Object.keys(categoryData);
  pieChart.data.datasets[0].data = Object.values(categoryData);
  pieChart.update();
}

const pieChart = new Chart(pieCtx, {
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
function updateBalanceDisplay() {
  document.querySelector(".fastdiv:nth-child(4) h5").textContent = `+ ${getBalance()}$`;
}
function updateSavingsDisplay() {
  document.querySelector(".fastdiv:nth-child(5) h5").textContent = `+ ${getSavings()}$`;
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

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("Category").value;
    const date = new Date().toISOString().split('T')[0];

    const transaction = { description, amount, type, category, date };

    processTransaction(transaction);  
    updateBalance(transaction);     
    updateLastIncomeExpense();    
    updateCharts();           

    this.reset();
    document.getElementById("popupForm").style.display = "none";
});

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
  updateBalanceDisplay();
  updateSavingsDisplay();
  updateLastIncomeExpense();
  updateCharts();
}

// Calling these functions 
initializeLocalStorage();
updateDashboard();