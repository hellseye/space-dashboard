/**
 * Legendary Motorsport - Car MarketPlace Logic
 * Features: Live API search, performance stats engine, simulated banking system.
 */

import { API_KEY } from "./config.js";

// --- State Management ---
let currentResults = [];
let isAscending = true;

// --- Event Listeners ---
document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('brandInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
});

/**
 * Toggles price sorting between High-to-Low and Low-to-High
 */
document.getElementById('sortBtn').addEventListener('click', () => {
    if (currentResults.length === 0) return;

    isAscending = !isAscending;
    const sortBtn = document.getElementById('sortBtn');
    sortBtn.textContent = isAscending ? "Sorted: High to Low" : "Sorted: Low to High";

    currentResults.sort((a, b) => isAscending ? b.price - a.price : a.price - b.price);
    renderResults();
});

// --- Modal Logic ---
const modal = document.getElementById('carModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

/**
 * Generates randomized but price-anchored performance stats
 * @param {number} price - The market value of the vehicle
 * @returns {object} Object containing topSpeed, acceleration, braking, traction
 */
function getVehicleStats(price) {
    const p = price || 50000;
    
    // GTA-style normalization (0-100 scale)
    const topSpeed = Math.min(95, Math.floor(30 + (p / 250000) * 65));
    const acceleration = Math.min(92, Math.floor(20 + (p / 200000) * 72));
    const braking = Math.min(88, Math.floor(40 + (p / 300000) * 48));
    const traction = Math.floor(40 + Math.random() * 50);

    return { topSpeed, acceleration, braking, traction };
}

/**
 * Calculates average price from a set of listings
 * @param {Array} listings - Array of listing objects
 * @returns {number} Averaged price
 */
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

/**
 * Creates a car card HTML string
 */
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

/**
 * Renders the detailed view modal for a vehicle
 */
window.openDetails = function (index) {
    const car = currentResults[index];
    if (!car) return;

    const stats = getVehicleStats(car.price);
    const build = car.build || {};
    
    modalBody.innerHTML = `
        <div class="modal-header-info">
            <h2>${car.name}</h2>
            <div class="modal-price">$${car.price.toLocaleString()}</div>
        </div>
        
        <div class="modal-grid">
            <div class="details-left">
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

                <div class="modal-actions">
                    <button class="order-btn" onclick="simulateOrder(${car.price})">ORDER NOW</button>
                    <a href="${car.link}" target="_blank" class="vdp-link">VIEW LISTING</a>
                </div>
            </div>
            <div class="details-right">
                <div class="main-image-container">
                    <img src="${car.image}" alt="Primary Image" class="main-detail-img"/>
                </div>
                <div class="seller-info">
                    SOLD BY: <span>${car.seller}</span>
                </div>
            </div>
        </div>

        <div class="specs-section">
            <h3 class="specs-title">Technical Specifications</h3>
            <div class="specs-grid">
                <div class="spec-item"><span class="spec-label">Transmission</span><span class="spec-value">${build.transmission || 'N/A'}</span></div>
                <div class="spec-item"><span class="spec-label">Drivetrain</span><span class="spec-value">${build.drivetrain || 'N/A'}</span></div>
                <div class="spec-item"><span class="spec-label">Engine Size</span><span class="spec-value">${build.engine_size ? build.engine_size + 'L' : 'N/A'}</span></div>
                <div class="spec-item"><span class="spec-label">Cylinders</span><span class="spec-value">${build.cylinders || 'N/A'}</span></div>
                <div class="spec-item"><span class="spec-label">Fuel Type</span><span class="spec-value">${build.fuel_type || 'N/A'}</span></div>
                <div class="spec-item"><span class="spec-label">Mileage</span><span class="spec-value">${car.mileage.toLocaleString()} miles</span></div>
                <div class="spec-item"><span class="spec-label">Exterior Color</span><span class="spec-value">${car.ext_color}</span></div>
                <div class="spec-item"><span class="spec-label">Interior Color</span><span class="spec-value">${car.int_color}</span></div>
                <div class="spec-item"><span class="spec-label">City/Hwy MPG</span><span class="spec-value">${build.city_mpg || '?'}/${build.highway_mpg || '?'}</span></div>
            </div>
        </div>
    `;
    modal.style.display = "block";
};

/**
 * Simulates a banking transaction for ordering a car
 */
window.simulateOrder = function (price) {
    const bankEl = document.getElementById('bankAmount');
    let currentBank = parseInt(bankEl.textContent.replace('$', '').replace(/,/g, ''));

    if (currentBank < price) {
        alert("INSUFFICIENT FUNDS IN BANK ACCOUNT");
        return;
    }

    const newAmount = currentBank - price;
    bankEl.textContent = `$${newAmount.toLocaleString()}`;

    const btn = document.querySelector('.order-btn');
    btn.textContent = "SOLDOUT";
    btn.style.background = "#333";
    btn.disabled = true;

    alert("ORDER PROCESSED: SHIPMENT EN ROUTE TO YOUR GARAGE");
};

/**
 * Fetches market info from Marketcheck API
 */
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
            link: listing.vdp_url || '#',
            build: listing.build || {},
            ext_color: listing.exterior_color || 'Unknown',
            int_color: listing.interior_color || 'Unknown',
            seller: listing.dealer?.name || 'Private Seller'
        };
    } catch (err) {
        console.error("Marketcheck error:", err);
        return null;
    }
}

/**
 * Main Search Handler
 */
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

/**
 * Updates the UI grid with the current result set
 */
function renderResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    let gridHTML = "";
    currentResults.forEach((car, index) => {
        gridHTML += createCarCard(car, index);
    });
    resultsGrid.innerHTML = gridHTML;
}
