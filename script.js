var map = L.map('map').setView([46.8, 8.3], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let werte = {};

fetch("data/werte.json")
  .then(res => res.json())
  .then(data => {
    werte = data;
    return fetch("data/gemeinden.geojson");
  })
  .then(res => res.json())
  .then(geoData => {
    L.geoJSON(geoData, {
      style: feature => {
        const name = feature.properties.GEMEINDENAME;
        const val = werte[name];
        return {
          fillColor: getColor(val),
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.GEMEINDENAME;
        const val = werte[name] || "Keine Daten";
        layer.bindPopup(`<b>${name}</b><br>Wert: ${val}`);
      }
    }).addTo(map);
  });

function getColor(value) {
  if (value > 26) return '#800026';
  if (value > 24) return '#BD0026';
  if (value > 22) return '#E31A1C';
  if (value > 20) return '#FC4E2A';
  if (value > 18) return '#FD8D3C';
  return '#FFEDA0';
}

function openEgrid() {
  const egrid = document.getElementById("egridInput").value.trim();
  if (egrid) {
    const url = `https://oerebviewer.geo.admin.ch/oereb/viewer/pdf?EGRID=${encodeURIComponent(egrid)}`;
    const iframe = document.getElementById("oerebFrame");
    iframe.src = url;
    iframe.style.display = "block";
  }
}
