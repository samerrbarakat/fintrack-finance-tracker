// useful functions 
function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
console.log(getDaysInCurrentMonth());

const piecategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];
const pieamounts = [450, 120, 300, 150, 280];
const linelabels = [...Array(getDaysInCurrentMonth()).keys().map(x=>x+1)]; 
const lineexpenses =[120, 45, 230, 90, 310, 60, 180, 25, 220, 70, 160, 130, 90, 300, 40]; 
const linebalance = [3000, 2955, 2725, 2635, 2325, 2265, 2085, 2060, 1840, 1770, 1610, 1480, 1390, 1090, 1050]; 
const piebackgroundColors = [
  '#d62839',
  '#ba324f', 
  '#175676', 
  '#4ba3c3', 
  '#cce6f4'  
];

const pieCtx = document.getElementById('pieChart').getContext('2d');
const ctx = document.getElementById('lineChart').getContext('2d');

const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: linelabels,
    datasets: [
      {
        label: 'Expenses',
        data: lineexpenses,
        borderColor: '#e74c3c',  // Red for expenses
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Balance',
        data: linebalance,
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
        beginAtZero: false  // let y-scale adapt naturally
      }
    }
  }
});

const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: piecategories,
    datasets: [{
      data: pieamounts,
      backgroundColor: piebackgroundColors
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

