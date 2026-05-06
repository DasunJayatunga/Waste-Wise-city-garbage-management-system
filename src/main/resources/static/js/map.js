// Configuration 
const CENTER_LOCATION = [6.902191543490325, 79.91958508722796]; // [lat, lng]

// Map boundaries
const MAP_BOUNDS = [
  [6.884254212845257, 79.91083465764962],   // south, west
  [6.915475969479552, 79.92962417368192]    // north, east
];

// Tile layer URL – Stadia Maps free, no key needed
const TILE_LAYER_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
const TILE_LAYER_OPTIONS = {
  maxZoom: 22,
  attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
};

// Bin icon helper
function getBinIcon(fillLevel) {
  if (fillLevel < 50) return "/images/bin-icon-green.png";
  if (fillLevel < 75) return "/images/bin-icon-orange.png";
  return "/images/bin-icon-red.png";
}

// Create a Leaflet marker icon from the image path
function createBinIcon(iconUrl) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 60],       // same as your scaledSize
    iconAnchor: [30, 30],     // center the icon
    popupAnchor: [0, -30]
  });
}

// Map & Markers
let map;
let binMarkers = [];

async function initMap() {
  console.log("Map Loaded (Leaflet)");

  // Create map and set view
  map = L.map('map', {
    maxBounds: MAP_BOUNDS,                // restrict panning
    maxBoundsViscosity: 1.0,              // solid boundary
    minZoom: 17,
    maxZoom: 21
  }).setView(CENTER_LOCATION, 16);

  // Add tile layer
  L.tileLayer(TILE_LAYER_URL, TILE_LAYER_OPTIONS).addTo(map);

  // Force correct sizing after flex layout
  map.invalidateSize();

  // Initial load
  await loadAndRenderBins();

  // Refresh markers every 5 seconds
  setInterval(loadAndRenderBins, 5000);
}

async function loadAndRenderBins() {
  try {
    const response = await fetch("/api/bins");
    const bins = await response.json();

    // Clear existing markers
    binMarkers.forEach(marker => map.removeLayer(marker));
    binMarkers = [];

    // Add new markers
    bins.forEach(bin => {
      const marker = L.marker([bin.latitude, bin.longitude], {
        icon: createBinIcon(getBinIcon(bin.fillLevel)),
        title: "Bin ID: " + bin.binId + " | Fill: " + bin.fillLevel + "%"
      }).addTo(map);

      // Simple popup
      marker.bindPopup(`
        <b>Bin ID:</b> ${bin.binId}<br/>
        <b>Fill level:</b> ${bin.fillLevel}%
      `);

      binMarkers.push(marker);
    });
  } catch (error) {
    console.error("Error loading bins:", error);
  }
}

initMap();
