var map = L.map('map').setView([46.8, 8.2], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let gemeindeWerte = {};

fetch("gemeinde_werte_dummy.json")
  .then(res => res.json())
  .then(data => {
    gemeindeWerte = data;

    fetch("schweiz_gemeinden_dummy.geojson")
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
  return '#FFEDA0';
}
// Example: Swiss Real Estate Bar Chart (dummy data)
document.addEventListener('DOMContentLoaded', function () {
  var trace = {
    x: ['Zurich', 'Geneva', 'Bern', 'Basel', 'Lausanne'],
    y: [12000, 10500, 9000, 9500, 9800], // Example prices per m²
    type: 'bar',
    marker: { color: '#FC4E2A' }
  };

  var layout = {
    title: 'Durchschnittliche Immobilienpreise (CHF/m²)',
    xaxis: { title: 'Stadt' },
    yaxis: { title: 'Preis (CHF/m²)' }
  };

  Plotly.newPlot('real-estate-visualization', [trace], layout);
});