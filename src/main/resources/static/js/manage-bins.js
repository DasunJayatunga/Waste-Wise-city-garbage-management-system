// Manage Bins Page

const API_URL = "/api/bins";

let manageMap;
let selectionMarker = null;   // marker shown when choosing a location
let binMarkers = [];

// Initialise the map when DOM is ready
document.addEventListener('DOMContentLoaded', initManageMap);

function initManageMap() {
  manageMap = L.map('manage-map', {
    maxBounds: MAP_BOUNDS,
    maxBoundsViscosity: 1.0,
    minZoom: 16,        // slightly looser than the public map
    maxZoom: 20
  }).setView(CENTER_LOCATION, 16);

  L.tileLayer(TILE_LAYER_URL, TILE_LAYER_OPTIONS).addTo(manageMap);

  manageMap.invalidateSize();

  // Handle click on the map to set location
  manageMap.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    document.getElementById('latitude').value = lat.toFixed(10);
    document.getElementById('longitude').value = lng.toFixed(10);

    // Place or move the selection marker
    if (selectionMarker) {
      selectionMarker.setLatLng(e.latlng);
    } else {
      selectionMarker = L.marker(e.latlng, {
        icon: L.icon({
          iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        }),
        title: 'New bin location'
      }).addTo(manageMap);
    }
  });

  // Load existing bins immediately and then every 5 seconds
  loadBins();
  setInterval(loadBins, 5000);
}

// Center the map on a specific bin (called from the list)
function centerOnBin(latitude, longitude) {
  if (manageMap) {
    manageMap.setView([latitude, longitude], 18);
  }
}

// Render bin markers on the map
function renderBinMarkers(bins) {
  // Remove old markers
  binMarkers.forEach(marker => manageMap.removeLayer(marker));
  binMarkers = [];

  bins.forEach(bin => {
    const marker = L.marker([bin.latitude, bin.longitude], {
      icon: createBinIcon(getBinIcon(bin.fillLevel)),
      title: `Bin #${bin.binId} | ${bin.deviceId || "No sensor"} | Fill: ${bin.fillLevel}%`
    }).addTo(manageMap);

    marker.bindPopup(`
      <b>Bin #${bin.binId}</b><br/>
      ${bin.deviceId ? 'Device: ' + bin.deviceId + '<br/>' : '<span style="color:#aaa">No sensor</span><br/>'}
      Lat: ${bin.latitude.toFixed(6)}<br/>
      Lng: ${bin.longitude.toFixed(6)}<br/>
      Fill: ${bin.fillLevel}%
    `);

    binMarkers.push(marker);
  });
}

// Fetch bins and update map + list
async function loadBins() {
  try {
    const response = await fetch(API_URL);
    const bins = await response.json();
    renderBinMarkers(bins);
    renderBinList(bins);
  } catch (error) {
    console.error('Error loading bins:', error);
    document.getElementById('bin-list').innerHTML =
      '<p style="color:red;">Failed to load bins.</p>';
  }
}

// Render the bin list in the side panel
function renderBinList(bins) {
  const container = document.getElementById('bin-list');
  if (bins.length === 0) {
    container.innerHTML = '<p class="loading-text">No bins found.</p>';
    return;
  }

  container.innerHTML = bins.map(bin => {
    let fillClass = 'fill-low';
    if (bin.fillLevel >= 50 && bin.fillLevel < 75) fillClass = 'fill-medium';
    else if (bin.fillLevel >= 75) fillClass = 'fill-high';

    return `
      <div class="bin-item" onclick="centerOnBin(${bin.latitude}, ${bin.longitude})">
        <div class="bin-info">
          <strong>Bin #${bin.binId}</strong><br>
          ${bin.deviceId ? "Device: " + bin.deviceId + "<br>" : '<span class="no-device">No sensor</span><br>'}
          Lat: ${bin.latitude.toFixed(6)}<br>
          Lng: ${bin.longitude.toFixed(6)}<br>
          <span class="fill-badge ${fillClass}">${bin.fillLevel}% full</span>
        </div>
        <button class="btn-delete" onclick="deleteBin(event, ${bin.binId})">Remove</button>
      </div>`;
  }).join('');
}

// Add a new bin (POST)
async function addBin() {
  const deviceId = document.getElementById('deviceId').value.trim();
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const fillLevel = 0;   // always default to 0

  if (isNaN(latitude) || isNaN(longitude)) {
    alert("Please click on the map to select a location first.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, latitude, longitude, fillLevel })
    });
    if (!response.ok) throw new Error('Server error');

    // Clear the form
    document.getElementById('deviceId').value = '';
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    if (selectionMarker) {
      manageMap.removeLayer(selectionMarker);
      selectionMarker = null;
    }
    loadBins();
  } catch (error) {
    console.error('Add bin error:', error);
    alert("Failed to add bin.");
  }
}

// Delete a bin (DELETE)
async function deleteBin(event, binId) {
  event.stopPropagation(); // prevent list item click (centering)
  if (!confirm(`Remove Bin #${binId}?`)) return;

  try {
    const response = await fetch(`${API_URL}/${binId}`, { method: "DELETE" });
    if (response.ok) {
      loadBins();
    } else {
      alert("Delete failed.");
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert("Delete failed.");
  }
}
