let expenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
);

let expenseChart;

// ADD EXPENSE FUNCTION
function addExpense() {

    let name = document.getElementById("name").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    if (name === "" || amount <= 0 || date === "") {
        alert("Enter valid expense details!");
        return;
    }

    expenses.push({
        name: name,
        amount: amount,
        category: category,
        date: date
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";

    displayExpenses();
}


// PIE CHART FUNCTION
function drawExpenseChart() {

    const ctx = document.getElementById("expenseChart");

    if (!ctx) return;

    if (expenseChart) {
        expenseChart.destroy();
    }

    const categories = [
        "Food",
        "Travel",
        "Shopping",
        "Education",
        "Other"
    ];

    const totals = categories.map(category =>
        expenses
            .filter(e => e.category === category)
            .reduce((sum, e) => sum + Number(e.amount), 0)
    );

    expenseChart = new Chart(ctx, {
        type: "pie",

        data: {
            labels: categories,

            datasets: [{
                data: totals
            }]
        }
    });
}


// DISPLAY EXPENSES FUNCTION
function displayExpenses() {

    let list = document.getElementById("list");

    let total = 0;
    let monthlyTotal = 0;

    let currentMonth = new Date().toISOString().slice(0, 7);

    list.innerHTML = "";

    let searchText = document.getElementById("search").value.toLowerCase();
    let filter = document.getElementById("filter").value;

    expenses.forEach(function(expense, index) {

        total += Number(expense.amount);

        if (expense.date && expense.date.startsWith(currentMonth)) {
            monthlyTotal += Number(expense.amount);
        }

        if (!expense.name.toLowerCase().includes(searchText)) {
            return;
        }

        if (filter !== "All" && expense.category !== filter) {
            return;
        }

        let item = document.createElement("li");

        item.textContent = expense.name + " - ₹" +
            expense.amount + " (" + expense.category +
            ") - " + (expense.date || "No date");

        let btn = document.createElement("button");

        btn.textContent = "Delete";

        btn.onclick = function() {

            expenses.splice(index, 1);

            localStorage.setItem("expenses", JSON.stringify(expenses));

            displayExpenses();
        };

        item.appendChild(btn);
        list.appendChild(item);

    });


    document.getElementById("total").textContent = total;

    document.getElementById("monthlyTotal").textContent = monthlyTotal;

    document.getElementById("count").textContent = expenses.length;

    drawExpenseChart();
}


// INITIAL DISPLAY
displayExpenses();