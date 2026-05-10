// Shared Map Configuration & Helpers

// Default starting location (used by both pages)
const CENTER_LOCATION = [6.902191543490325, 79.91958508722796];

// Map boundaries – Leaflet format [[south, west], [north, east]]
const MAP_BOUNDS = [
  [6.884254212845257, 79.91083465764962],
  [6.915475969479552, 79.92962417368192]
];

// Tile layer – free, no API key needed
const TILE_LAYER_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
const TILE_LAYER_OPTIONS = {
  maxZoom: 22,
  attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
};

// Returns the correct bin icon path based on fill level
function getBinIcon(fillLevel) {
  if (fillLevel < 50) return "/images/bin-icon-green.png";
  if (fillLevel < 75) return "/images/bin-icon-orange.png";
  return "/images/bin-icon-red.png";
}

// Creates a Leaflet icon object from an image URL
function createBinIcon(iconUrl) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 30],     // center of the icon
    popupAnchor: [0, -30]
  });
}
