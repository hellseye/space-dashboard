const BASE_URL = "http://localhost:5000/api";

// 🌍 Initialize map
// const map = L.map("map").setView([20, 0], 2);
const map = L.map("map", {
  center: [20, 0],
  zoom: 2,
  minZoom: 2,
  maxBounds: [
    [-90, -180],
    [90, 180]
  ],
  maxBoundsViscosity: 1.0, // 🔥 locks map
  worldCopyJump: false // ❌ stop repeating world
});
// 🌌 Dark theme map
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap",
  subdomains: "abcd",
  maxZoom: 19,
  noWrap: true
}).addTo(map);


// 🛰️ Custom ISS marker (glow + red core)
const issIcon = L.divIcon({
  className: "",
  html: `
    <div class="iss-wrapper">
      <div class="pulse"></div>
      <div class="core"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// 🌀 Trail setup
let path = [];
const trail = L.polyline(path, { color: "cyan" }).addTo(map);

// 🎯 First load control
let firstLoad = true;

// 📍 Update trail
function updatePath(lat, lon) {
  path.push([lat, lon]);

  if (path.length > 50) path.shift();

  trail.setLatLngs(path);
}

// 🔄 Fetch ISS position
async function fetchISS() {
  try {
    const res = await fetch(`${BASE_URL}/iss`);
    const data = await res.json();

    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);

    issMarker.setLatLng([lat, lon]);

    updatePath(lat, lon);

    if (firstLoad) {
      map.setView([lat, lon], 3);
      firstLoad = false;
    }

    issMarker.bindPopup(`🛰️ ISS<br>Lat: ${lat}<br>Lon: ${lon}`);
  } catch (err) {
    console.error("Error fetching ISS:", err);
  }
}

// ⏱️ Update every 5 sec
setInterval(fetchISS, 5000);
fetchISS();