const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

// 1. Load expenses from server
async function fetchExpenses() {
    const res = await fetch('/api/expenses');
    const data = await res.json();
    renderUI(data);
}

// 2. Add new expense
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;

    const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount })
    });

    if (res.ok) {
        form.reset();
        fetchExpenses();
    }
});

// 3. Delete expense
async function deleteExpense(id) {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
}

// 4. Update UI
function renderUI(expenses) {
    list.innerHTML = '';
    let total = 0;

    expenses.forEach(exp => {
        total += exp.amount;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${exp.name}: <strong>$${exp.amount.toFixed(2)}</strong></span>
            <button onclick="deleteExpense(${exp.id})">Delete</button>
        `;
        list.appendChild(li);
    });

    totalDisplay.innerText = total.toFixed(2);
}

fetchExpenses();