
const input = document.getElementById('brandInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const messageDiv = document.getElementById('message');
const spinner = document.getElementById('spinner');


searchBtn.addEventListener('click', handleSearch);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.className = isError ? 'message error' : 'message';
}

function clearUI() {
    resultsDiv.innerHTML = '';
    messageDiv.textContent = '';
}

async function handleSearch() {
    const brand = input.value.trim();

    if (!brand) {
        showMessage('Please enter a car brand.', true);
        resultsDiv.innerHTML = '';
        return;
    }

    clearUI();
    spinner.style.display = 'block';

    try {
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(brand)}?format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('API request failed with status ' + response.status);
        }

        const data = await response.json();
        console.log(data);


        spinner.style.display = 'none';

        if (!data.Results || data.Results.length === 0) {
            showMessage('No models found for this brand.');
            return;
        }

        const limitedResults = data.Results.slice(0, 15);

        showMessage(`Showing top ${limitedResults.length} models for "${brand.toUpperCase()}"`);

        displayResults(limitedResults);

    } catch (error) {
        spinner.style.display = 'none';
        showMessage('Something went wrong. Please try again later.', true);
        console.error(error);
    }
}


function displayResults(models) {
    models.forEach((model, index) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.style.setProperty('--delay', `${index * 0.05}s`);

        const makeEl = document.createElement('div');
        makeEl.className = 'card-make';
        makeEl.textContent = model.Make_Name;

        const modelEl = document.createElement('div');
        modelEl.className = 'card-model';
        modelEl.textContent = model.Model_Name;

        card.appendChild(makeEl);
        card.appendChild(modelEl);
        resultsDiv.appendChild(card);
    });
}
