let myChart; // Declare a variable to hold your chart instance

document.getElementById('details-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const userDetails = {
        user_name: document.getElementById('user_name').value,
        user_age: document.getElementById('user_age').value,
        user_height: document.getElementById('user_height').value,
        user_weight: document.getElementById('user_weight').value,
        user_gender: document.getElementById('user_gender').value
    };
    console.log(userDetails);
    document.getElementById('response-message').textContent = 'User details submitted successfully!';
});

document.getElementById('health-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const diseases = document.getElementById('diseases').value.split(',');
    console.log(`Diseases: ${diseases}`);
    fetchDietRecommendations(diseases);
});

async function fetchDietRecommendations(diseases) {
    const userDetails = {
        user_name: document.getElementById('user_name').value,
        user_age: document.getElementById('user_age').value,
        user_height: document.getElementById('user_height').value,
        user_weight: document.getElementById('user_weight').value,
        user_gender: document.getElementById('user_gender').value,
        diseases: diseases
    };

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAiEAtNGZoCaNpipwLnni_W448ESb84zhg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Provide a structured list of 5 food groups with percentage recommendations for a balanced diet plan in JSON format. My name is ${userDetails.user_name}, I am ${userDetails.user_age} years old, weigh ${userDetails.user_weight} kg, and have a height of ${userDetails.user_height} cm. List the 5 food groups (Fruits, Vegetables, Grains, Protein, Dairy) along with recommended daily percentages and brief reasons why each group is important.`
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        console.log('API Response:', data); // Log the API response to verify its contents
        const dietData = parseDietData(data);
        console.log('Parsed Diet Data:', dietData); // Log the parsed diet data to verify its contents
        displayDietChart(dietData);
    } catch (error) {
        console.error('Error fetching diet recommendations:', error);
    }
}

function parseDietData(data) {
    const text = data.candidates[0].content.parts[0].text;
    console.log('Response Text:', text); // Log the response text to verify its contents

    // Extract the JSON part from the response text
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex);

    // Attempt to parse the JSON from the extracted string
    let dietData;
    try {
        dietData = JSON.parse(jsonString).diet_plan.food_groups;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
    }

    // Ensure the data is in the expected format
    if (!Array.isArray(dietData) || dietData.some(item => !item.group || !item.percentage)) {
        console.error('Invalid data format:', dietData);
        return [];
    }

    // Map the data to the expected format
    return dietData.map(item => ({
        name: item.group,
        percentage: item.percentage
    }));
}

function displayDietChart(dietData) {
    if (!dietData.length) {
        console.error('No diet data to display');
        return;
    }

    // Check if a chart already exists
    if (myChart) {
        myChart.destroy(); // Destroy the existing chart
    }

    const ctx = document.getElementById('dietChart').getContext('2d');
    const chartData = {
        labels: dietData.map(item => item.name),
        datasets: [{
            data: dietData.map(item => item.percentage),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
    };

    console.log('Chart Data:', chartData); // Log the chart data to verify its contents

    myChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Recommended Diet Chart'
                }
            }
        }
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