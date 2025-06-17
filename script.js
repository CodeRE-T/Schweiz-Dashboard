var map = L.map('map').setView([46.8, 8.2], 8); // Schweiz zentriert

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// GeoJSON hinzufügen
fetch('data/bern.geojson')
  .then(res => res.json())
  .then(geoData => {
    L.geoJSON(geoData).addTo(map);

// Lade Werte (z. B. Mietpreise)
let gemeindeWerte = {};

fetch("data/gemeinde_werte_dummy.json")
  .then(res => res.json())
  .then(data => {
    gemeindeWerte = data;

    // Lade GeoJSON und zeichne Gemeinden
    fetch("data/schweiz_gemeinden_dummy.geojson")
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

  
// Chart.js
const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Breitenrain', 'Mattenhof', 'Kirchenfeld'],
    datasets: [{
      label: 'CHF/m²',
      data: [24.1, 20.3, 26.0],
      backgroundColor: 'rgba(0, 123, 255, 0.5)'
    }]

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

