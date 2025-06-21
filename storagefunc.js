// Here I have all the functions that deal with the local storage
// Storage will have : 
// - balance always there
// - The array of all trnsaction n. 
// - a place to keep the last income (value and description only ) 
// - same for last income transaction.
// - a list of all the Buccket lists and their attributes

function initializeLocalStorage() {
  if (localStorage.getItem("balance") === null) {
    localStorage.setItem("balance", "0");
  }

  if (localStorage.getItem("transactions") === null) {
    localStorage.setItem("transactions", JSON.stringify([]));
  }

  if (localStorage.getItem("lastIncome") === null) {
    localStorage.setItem("lastIncome", JSON.stringify({ description: "", value: 0 }));
  }

  if (localStorage.getItem("lastExpense") === null) {
    localStorage.setItem("lastExpense", JSON.stringify({ description: "", value: 0 }));
  }

  if (localStorage.getItem("bucketList") === null) {
    localStorage.setItem("bucketList", JSON.stringify([]));
  }
}

function processTransaction(transaction){
    if (!transaction.id) {
    transaction.id = Date.now().toString();
    }
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    let currBalance = parseFloat(localStorage.getItem("balance"));
    if (transaction.type === "income") {
    localStorage.setItem("lastIncome", JSON.stringify({
        description: transaction.description,
        value: transaction.amount
    }));
    currBalance += transaction.amount; 
    localStorage.setItem("balance", currBalance.toString());
} else if (transaction.type === "expense") {
    localStorage.setItem("lastExpense", JSON.stringify({
        description: transaction.description,
        value: transaction.amount
    }));
    currBalance -= transaction.amount; 
    localStorage.setItem("balance", currBalance.toString());
}
}

function getCurrentMonthExpenses() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based (Jan = 0)

  return transactions.filter(tx => {
    if (tx.type !== "expense") return false;

    const txDate = new Date(tx.date);
    return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
  });
}
//////////////////////////////
function getDailyBalanceVariation() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let startingBalance = 0;
  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate.getFullYear() < year || 
       (txDate.getFullYear() === year && txDate.getMonth() < month)) {
      startingBalance += (tx.type === "income" ? tx.amount : -tx.amount);
    }
  });

  const dailyBalances = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const dayTransactions = transactions.filter(tx => tx.date === dateStr);
    let dailyChange = 0;
    dayTransactions.forEach(tx => {
      dailyChange += (tx.type === "income" ? tx.amount : -tx.amount);
    });
    if (day === 1) {
      dailyBalances.push(startingBalance + dailyChange);
    } else {
      dailyBalances.push(dailyBalances[day - 2] + dailyChange);
    }
  }
  return dailyBalances; 
}

function getBalance() {
  return parseFloat(localStorage.getItem("balance")) || 0;
}

function getLastIncome() {
  return JSON.parse(localStorage.getItem("lastIncome")) || { description: "", value: 0 };
}

function getLastExpense() {
  return JSON.parse(localStorage.getItem("lastExpense")) || { description: "", value: 0 };
}
function getBucketList() {
  return JSON.parse(localStorage.getItem("bucketList")) || [];
}
function getAllTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}
function deleteTransactionById(id) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const filtered = transactions.filter(tx => tx.id !== id);
  localStorage.setItem("transactions", JSON.stringify(filtered));
  recalculateBalanceAndLastTransactions(filtered);
}

function updateTransactionById(id, updatedTransaction) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const index = transactions.findIndex(tx => tx.id === id);
  if (index === -1) return false;

  updatedTransaction.id = id;
  transactions[index] = updatedTransaction;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  recalculateBalanceAndLastTransactions(transactions);
  return true;
}

function recalculateBalanceAndLastTransactions(transactions) {
  let balance = 0;
  let lastIncome = { description: "", value: 0, date: null };
  let lastExpense = { description: "", value: 0, date: null };

  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount);
    const txDate = new Date(tx.date);

    if (tx.type === "income") {
      balance += amount;
      if (!lastIncome.date || txDate > new Date(lastIncome.date)) {
        lastIncome = { description: tx.description, value: amount, date: tx.date };
      }
    } else if (tx.type === "expense") {
      balance -= amount;
      if (!lastExpense.date || txDate > new Date(lastExpense.date)) {
        lastExpense = { description: tx.description, value: amount, date: tx.date };
      }
    }
  });

  localStorage.setItem("balance", balance.toString());
  localStorage.setItem("lastIncome", JSON.stringify({ description: lastIncome.description, value: lastIncome.value }));
  localStorage.setItem("lastExpense", JSON.stringify({ description: lastExpense.description, value: lastExpense.value }));
}
