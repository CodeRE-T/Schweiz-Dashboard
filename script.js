var map = L.map('map').setView([46.8, 8.2], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let gemeindeWerte = {};

// Dummy-Daten für Immobilienpreise (CHF/m²) pro Stadt
const realEstateData = {
  "Zürich": 12000,
  "Genf": 10500,
  "Bern": 9000,
  "Basel": 9500,
  "Lausanne": 9800,
  "Luzern": 8500,
  "Winterthur": 8000,
  "St. Gallen": 7800,
  "Chur": 7600,
  "Biel": 7400
};

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

            // Highlight im Plotly-Chart beim Klick auf die Region
            layer.on('click', function() {
              highlightBar(name);
            });
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

// Plotly-Balkendiagramm mit passenden Städtenamen
const barCities = [
  "Zürich", "Genf", "Bern", "Basel", "Lausanne", "Luzern", "Winterthur", "St. Gallen", "Chur", "Biel"
];
const barValues = barCities.map(city => realEstateData[city] || 0);

var trace = {
  x: barCities,
  y: barValues,
  type: 'bar',
  marker: { color: barCities.map(() => '#FC4E2A') }
};

var layout = {
  title: 'Durchschnittliche Immobilienpreise (CHF/m²)',
  xaxis: { title: 'Stadt' },
  yaxis: { title: 'Preis (CHF/m²)' }
};

Plotly.newPlot('real-estate-visualization', [trace], layout);

// Funktion zum Hervorheben eines Balkens im Plotly-Chart
function highlightBar(cityName) {
  const colors = barCities.map(city =>
    city === cityName ? '#800026' : '#FC4E2A'
  );
  Plotly.restyle('real-estate-visualization', { 'marker.color': [colors] });
}