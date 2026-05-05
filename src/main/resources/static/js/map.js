let map;
let binMarkers = []; // Tracks all markers so we can refresh them

async function initMap() {
  console.log("Map Loaded");

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: CENTER_LOCATION,
    minZoom: 10,
    maxZoom: 20,
    restriction: {
      latLngBounds: MAP_BOUNDS,
      strictBounds: true,
    },
    styles: MAP_STYLES,
  });

  // Initial load
  await loadAndRenderBins();

  // Poll the API every 5 seconds and redraw markers
  setInterval(loadAndRenderBins, 5000);
}

// Fetch bins and redraw all markers
async function loadAndRenderBins() {
  try {
    const response = await fetch("/api/bins");
    const bins = await response.json();

    // Clear existing markers
    binMarkers.forEach((marker) => marker.setMap(null));
    binMarkers = [];

    bins.forEach((bin) => {
      const marker = new google.maps.Marker({
        position: { lat: bin.latitude, lng: bin.longitude },
        map: map,
        title: "Bin ID: " + bin.binId + " | Fill: " + bin.fillLevel + "%",
        icon: {
          url: getBinIcon(bin.fillLevel),
          scaledSize: new google.maps.Size(60, 60),
        },
      });
      binMarkers.push(marker);
    });
  } catch (error) {
    console.error("Error loading bins:", error);
  }
}
