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
    // Process form data here...
    alert("Transaction added!");
    popup.style.display = "none";
});
