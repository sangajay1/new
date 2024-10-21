document.getElementById('details-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    console.log(`Name: ${name}, Age: ${age}, Weight: ${weight}, Height: ${height}`);
});

document.getElementById('health-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const diseases = document.getElementById('diseases').value.split(',');
    console.log(`Diseases: ${diseases}`);
    generateDietChart(diseases);
});

function generateDietChart(diseases) {
    const dietList = document.getElementById('diet-list');
    dietList.innerHTML = '';
    const dietItems = ['Apple', 'Banana', 'Carrot', 'Broccoli']; // Example items
    dietItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        dietList.appendChild(li);
    });
}

document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const orderItem = document.getElementById('order-item').value;
    const dietItems = Array.from(document.getElementById('diet-list').children).map(li => li.textContent);
    if (dietItems.includes(orderItem)) {
        alert(`You have ordered: ${orderItem}`);
    } else {
        alert('This item is not in your diet chart.');
    }
});