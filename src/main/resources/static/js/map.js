// ============================================================
// Map Configuration (formerly map-config.js)
// ============================================================

const CENTER_LOCATION = {
  lat: 6.89750097275343,
  lng: 79.92163713948294,
};

const MAP_BOUNDS = {
  north: 6.915475969479552,
  south: 6.884254212845257,
  west: 79.91083465764962,
  east: 79.92962417368192,
};

const MAP_STYLES = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function getBinIcon(fillLevel) {
  if (fillLevel < 50) return "/images/bin-icon-green.png";
  if (fillLevel < 75) return "/images/bin-icon-orange.png";
  return "/images/bin-icon-red.png";
}

// ============================================================
// Map Initialisation & Logic (formerly map.js)
// ============================================================

let map;
let binMarkers = [];

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

  google.maps.event.trigger(map, 'resize');

  await loadAndRenderBins();
  setInterval(loadAndRenderBins, 5000);
}

async function loadAndRenderBins() {
  try {
    const response = await fetch("/api/bins");
    const bins = await response.json();

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
