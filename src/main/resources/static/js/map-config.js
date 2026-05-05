// Shared Google Maps configuration
// Default starting location
const CENTER_LOCATION = {
  lat: 6.89750097275343,
  lng: 79.92163713948294,
};

// Map limits
const MAP_BOUNDS = {
  north: 6.915475969479552,
  south: 6.884254212845257,
  west: 79.91083465764962,
  east: 79.92962417368192,
};

// Map appearence
const MAP_STYLES = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

// Returns the correct bin icon path based on fill level
function getBinIcon(fillLevel) {
  if (fillLevel < 50) return "/images/bin-icon-green.png";
  if (fillLevel < 75) return "/images/bin-icon-orange.png";
  return "/images/bin-icon-red.png";
}
