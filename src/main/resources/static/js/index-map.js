// Home Page Map

let map;
let binMarkers = [];

async function initMap() {
  console.log("Map Loaded (Home – Leaflet)");

  map = L.map('map', {
    maxBounds: MAP_BOUNDS,
    maxBoundsViscosity: 1.0,
    minZoom: 17,
    maxZoom: 21
  }).setView(CENTER_LOCATION, 17);

  L.tileLayer(TILE_LAYER_URL, TILE_LAYER_OPTIONS).addTo(map);

  // Force correct sizing after flex layout
  map.invalidateSize();

  await loadAndRenderBins();
  setInterval(loadAndRenderBins, 5000);
}

async function loadAndRenderBins() {
  try {
    const response = await fetch("/api/bins");
    const bins = await response.json();

    binMarkers.forEach(marker => map.removeLayer(marker));
    binMarkers = [];

    bins.forEach(bin => {
      const marker = L.marker([bin.latitude, bin.longitude], {
        icon: createBinIcon(getBinIcon(bin.fillLevel)),
        title: "Bin ID: " + bin.binId + " | Fill: " + bin.fillLevel + "%"
      }).addTo(map);

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

// Start the map when the page is ready
document.addEventListener('DOMContentLoaded', initMap);
