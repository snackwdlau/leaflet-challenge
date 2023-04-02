//Tectonic Plates overlay
var plates;

//Map layer 
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Load plates data
const plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
d3.json(plateUrl).then((plateData) => {
    console.log(plateData);

   plates = L.geoJSON(plateData, {
        style: function (feature) {
          return {
            color: "orange",
            weight: 2
          };
        }
    });
    createMap(earthquakes, plates);
});

//Create map 
function createMap(earthquakes, plates) {
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": street,
        "Topo": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes,
      TectonicPlates: plates
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}