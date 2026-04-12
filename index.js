import { API_KEY } from "./config.js";

let currentResults = [];

let isAscending = true;

document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('brandInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
});

document.getElementById('sortBtn').addEventListener('click', () => {
    if (currentResults.length === 0) return;

    isAscending = !isAscending;
    const sortBtn = document.getElementById('sortBtn');
    sortBtn.textContent = isAscending ? "Sorted: High to Low" : "Sorted: Low to High";

    currentResults.sort((a, b) => isAscending ? b.price - a.price : a.price - b.price);
    renderResults();
});

const modal = document.getElementById('carModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}


function getVehicleStats(price) {
    const p = price || 50000;

    const topSpeed = Math.min(95, Math.floor(30 + (p / 250000) * 65));
    const acceleration = Math.min(92, Math.floor(20 + (p / 200000) * 72));
    const braking = Math.min(88, Math.floor(40 + (p / 300000) * 48));
    const traction = Math.floor(40 + Math.random() * 50);

    return { topSpeed, acceleration, braking, traction };
}

function getAveragePrice(listings) {
    let total = 0;
    let count = 0;
    listings.forEach(car => {
        if (car.price) {
            total += car.price;
            count++;
        }
    });
    return count === 0 ? 0 : Math.floor(total / count);
}

function createCarCard(car, index) {
    const label = car.price > 100000 ? "legendary" : "stock";
    return `
        <div class="car-card" onclick="openDetails(${index})">
            <div class="card-label">${label}</div>
            <img src="${car.image}" class="card-img" alt="${car.name}"/>
            <div class="card-info">
                <div class="card-name">${car.name}</div>
                <div class="card-price">$${car.price.toLocaleString()}</div>
            </div>
        </div>
    `;
}

window.openDetails = function (index) {
    const car = currentResults[index];
    if (!car) return;

    const stats = getVehicleStats(car.price);

    modalBody.innerHTML = `
        <div class="modal-grid">
            <div class="details-left">
                <h2>${car.name}</h2>
                <div class="desc">
                    Born in the fires of design and tested on the world's most demanding roads. 
                    This ${car.trim} edition is a statement of intent. Completely legal, 
                    completely fast, and waiting for you to take the wheel.
                </div>
                
                <div class="stats-container">
                    <div class="stat-row">
                        <span class="stat-label">Top Speed</span>
                        <div class="stat-bar"><div class="stat-fill" style="width: ${stats.topSpeed}%"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Acceleration</span>
                        <div class="stat-bar"><div class="stat-fill" style="width: ${stats.acceleration}%"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Braking</span>
                        <div class="stat-bar"><div class="stat-fill" style="width: ${stats.braking}%"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Traction</span>
                        <div class="stat-bar"><div class="stat-fill" style="width: ${stats.traction}%"></div></div>
                    </div>
                </div>

                <button class="order-btn" onclick="simulateOrder(${car.price})">ORDER NOW</button>
            </div>
            <div class="details-right">
                <img src="${car.image}" alt="Primary Image"/>
                <div style="margin-top: 10px; font-size: 12px; color: #fff; text-align: center; font-style: italic;">
                    Listing found via MarketCheck. Actual availability may vary.
                </div>
            </div>
        </div>
    `;
    modal.style.display = "block";
};

window.simulateOrder = function (price) {
    const bankEl = document.getElementById('bankAmount');
    let currentBank = parseInt(bankEl.textContent.replace('$', '').replace(/,/g, ''));

    if (currentBank < price) {
        alert("INSUFFICIENT FUNDS IN BANK ACCOUNT");
        return;
    }

    const newAmount = currentBank - price;
    bankEl.textContent = `$${newAmount.toLocaleString()}`;

    // Visual feedback
    const btn = document.querySelector('.order-btn');
    btn.textContent = "SOLDOUT";
    btn.style.background = "#333";
    btn.disabled = true;

    alert("ORDER PROCESSED: SHIPMENT EN ROUTE TO YOUR GARAGE");
};

async function fetchMarketData(make, model) {
    try {
        const response = await fetch(`https://api.marketcheck.com/v2/search/car/active?make=${make}&model=${model}&api_key=${API_KEY}`);
        if (!response.ok) return null;
        const data = await response.json();
        const listings = data.listings?.slice(0, 10);
        if (!listings || listings.length === 0) return null;
        const avgPrice = getAveragePrice(listings);
        const listing = listings[0];
        return {
            name: listing.build?.year ? `${listing.build.year} ${listing.build.make} ${listing.build.model}` : `${make} ${model}`,
            trim: listing.build?.trim || 'Base',
            price: avgPrice || listing.price || 0,
            mileage: listing.miles || 0,
            image: listing.media?.photo_links?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500',
            link: listing.vdp_url || '#'
        };
    } catch (err) {
        console.error("Marketcheck error:", err);
        return null;
    }
}

async function handleSearch() {
    const input = document.getElementById('brandInput').value.trim();
    const resultsGrid = document.getElementById('resultsGrid');
    const messageBox = document.getElementById('messageBox');
    const spinner = document.getElementById('loadingSpinner');

    if (!input) {
        messageBox.textContent = "ENTER A BRAND NAME TO SEARCH.";
        return;
    }

    resultsGrid.innerHTML = '';
    messageBox.textContent = `CONTACTING SERVERS FOR ${input.toUpperCase()} DATA...`;
    spinner.classList.add('active');

    try {
        const vpicRes = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${input}?format=json`);
        if (!vpicRes.ok) throw new Error("Connection failed");
        const data = await vpicRes.json();
        let models = data.Results || [];

        if (models.length === 0) {
            messageBox.textContent = `NO SHIPMENTS FOUND FOR "${input.toUpperCase()}".`;
            spinner.classList.remove('active');
            return;
        }

        messageBox.textContent = `MODELS ACQUIRED... FETCHING LIVE MARKET VALUE...`;
        models = models.slice(0, 12);

        currentResults = [];
        for (let modelData of models) {
            const carData = await fetchMarketData(modelData.Make_Name, modelData.Model_Name);
            if (carData && carData.price > 0) {
                currentResults.push(carData);
            }
        }

        if (currentResults.length === 0) {
            spinner.classList.remove('active');
            messageBox.textContent = "NO RECENT MARKET DATA FOUND. TRY ANOTHER BRAND.";
            return;
        }

        currentResults.sort((a, b) => isAscending ? b.price - a.price : a.price - b.price);

        spinner.classList.remove('active');
        messageBox.textContent = `PREMIUM INVENTORY FOR ${input.toUpperCase()} LOADED.`;

        renderResults();

    } catch (error) {
        spinner.classList.remove('active');
        messageBox.textContent = "SERVER CONNECTION TIMEOUT. PLEASE RETRY.";
        console.error(error);
    }
}

function renderResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    let gridHTML = "";
    currentResults.forEach((car, index) => {
        gridHTML += createCarCard(car, index);
    });
    resultsGrid.innerHTML = gridHTML;
}
