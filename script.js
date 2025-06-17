// Leaflet-Karte
var map = L.map('map').setView([46.948, 7.447], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// GeoJSON hinzufügen
fetch('data/bern.geojson')
  .then(res => res.json())
  .then(geoData => {
    L.geoJSON(geoData).addTo(map);
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
  }
});
