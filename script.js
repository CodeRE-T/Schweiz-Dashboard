// Leaflet-Karte initialisieren
const map = L.map('map').setView([46.8, 8.2], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Dummy-Daten für Immobilienpreise (CHF/m²) pro Stadt
const realEstateData = {
  "Zürich": 12000, "Genf": 10500, "Bern": 9000, "Basel": 9500, "Lausanne": 9800,
  "Luzern": 8500, "Winterthur": 8000, "St. Gallen": 7800, "Chur": 7600, "Biel": 7400
};

// Plotly-Balkendiagramm
const barCities = Object.keys(realEstateData);
const barValues = barCities.map(city => realEstateData[city]);

const trace = {
  x: barCities,
  y: barValues,
  type: 'bar',
  marker: { color: barCities.map(() => '#FC4E2A') }
};
const layout = {
  title: 'Durchschnittliche Immobilienpreise (CHF/m²)',
  xaxis: { title: 'Stadt' },
  yaxis: { title: 'Preis (CHF/m²)' }
};
Plotly.newPlot('real-estate-visualization', [trace], layout);

// Balken hervorheben
function highlightBar(cityName) {
  const colors = barCities.map(city => city === cityName ? '#800026' : '#FC4E2A');
  Plotly.restyle('real-estate-visualization', { 'marker.color': [colors] });
}

// Farben für Polygone
function getColor(value) {
  if (value > 26000) return '#800026';
  if (value > 24000) return '#BD0026';
  if (value > 22000) return '#E31A1C';
  if (value > 20000) return '#FC4E2A';
  if (value > 18000) return '#FD8D3C';
  if (value > 16000) return '#FEB24C';
  return '#FFEDA0';
}

// Layer für Gemeinden
let gemeindeLayer = null;
let gemeindeWerte = {};

// Checkbox zum Ein-/Ausblenden der Polygone erzeugen
const controlDiv = document.createElement('div');
controlDiv.innerHTML = `<label><input type="checkbox" id="togglePolygons" checked> Gemeinden anzeigen</label>`;
document.getElementById('map').appendChild(controlDiv);

// Daten laden und Layer erzeugen
fetch("gemeinde_werte_dummy.json")
  .then(res => res.json())
  .then(data => {
    gemeindeWerte = data;
    fetch("schweiz_gemeinden_dummy.geojson")
      .then(res => res.json())
      .then(geoData => {
        gemeindeLayer = L.geoJSON(geoData, {
          style: feature => {
            const name = feature.properties?.GEMEINDENAME;
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
            const name = feature.properties?.GEMEINDENAME;
            const value = gemeindeWerte[name] || "Keine Daten";
            layer.bindPopup(`<b>${name}</b><br>Wert: ${value}`);
            layer.on('click', () => highlightBar(name));
          }
        }).addTo(map);
      });
  });

// Checkbox-Event zum Ein-/Ausblenden
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('togglePolygons').addEventListener('change', function() {
    if (gemeindeLayer) {
      if (this.checked) {
        gemeindeLayer.addTo(map);
      } else {
        map.removeLayer(gemeindeLayer);
      }
    }
  });
});