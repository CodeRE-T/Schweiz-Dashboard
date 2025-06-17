var map = L.map('map').setView([46.8, 8.2], 8); // Schweiz zentriert

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Lade Werte (z. B. Mietpreise)
let gemeindeWerte = {};

fetch("data/gemeinde_werte.json")
  .then(res => res.json())
  .then(data => {
    gemeindeWerte = data;

    // Lade GeoJSON und zeichne Gemeinden
    fetch("data/schweiz_gemeinden.geojson")
      .then(res => res.json())
      .then(geoData => {
        L.geoJSON(geoData, {
          style: feature => {
            const name = feature.properties.GEMEINDENAME;
            const value = gemeindeWerte[name];
            return {
              fillColor: getColor(value),
              weight: 1,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties.GEMEINDENAME;
            const value = gemeindeWerte[name] || "Keine Daten";
            layer.bindPopup(`<b>${name}</b><br>Wert: ${value}`);
          }
        }).addTo(map);
      });
  });

function getColor(value) {
  if (value > 26) return '#800026';
  if (value > 24) return '#BD0026';
  if (value > 22) return '#E31A1C';
  if (value > 20) return '#FC4E2A';
  if (value > 18) return '#FD8D3C';
  if (value > 16) return '#FEB24C';
  if (value > 14) return '#FED976';
  return '#FFEDA0';
}

