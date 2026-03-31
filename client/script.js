const BASE_URL = "http://localhost:5000/api";
const time = document.getElementById("time");
const coordsLat = document.getElementById("coords-lat");
const coordsLon = document.getElementById("coords-lon");
const speed = document.getElementById("speed");
const altitude = document.getElementById("altitude");


const map = L.map("map", {
  center: [20, 0],
  zoom: 3,
  minZoom: 2.5,
  maxZoom: 5,
  maxBounds: [
    [-180, -180],
    [90, 180]
  ],
  maxBoundsViscosity: 1.0, 
  worldCopyJump: false
});

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap",
  subdomains: "abcd",
  noWrap: true,
}).addTo(map);

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

let path = [];
const trail = L.polyline(path, { color: "cyan" }).addTo(map);

let firstLoad = true;

function updatePath(lat, lon) {
  path.push([lat, lon]);

  if (path.length > 50) path.shift();

  trail.setLatLngs(path);
}

function updateVal(lat, lon, speed_val, altitude_val){
  coordsLat.innerText = lat
    coordsLon.innerText = lon
    speed.innerText = speed_val
    altitude.innerText = altitude_val
}

async function fetchISS() {
  try {
    const res = await fetch(`${BASE_URL}/iss`);
    const data = await res.json();

    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);
    const speed_val = parseFloat(data.velocity);
    const altitude_val = parseFloat(data.altitude);

    issMarker.setLatLng([lat, lon]);

    updatePath(lat, lon);

    if (firstLoad) {
      map.setView([lat, lon], 3);
      firstLoad = false;
    }

    updateVal(lat, lon, speed_val, altitude_val)


    issMarker.bindPopup(`🛰️ ISS<br>Lat: ${lat}<br>Lon: ${lon}`);
  } catch (err) {
    console.error("Error fetching ISS:", err);
  }
}

function getUTCTime() {
  const now = new Date();

  return now.toUTCString();
}

setInterval(() => {
  time.innerText = getUTCTime()
}, 1000)


setInterval(fetchISS, 5000);
fetchISS();