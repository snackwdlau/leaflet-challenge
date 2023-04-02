//Create map object
var myMap = L.map("map", {
    center: [38.9, -117.5],
    zoom: 5
}); 

//Earthquakes overlay
var earthquakes; 

//Map layer
var street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Load earthquakes data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then((data) => {
    console.log(data); 
    createFeatures(data); //Create function
}); 

//Create features
function createFeatures(data) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h2>${feature.properties.place}</h2><hr>
        <p><strong>Date:</strong> ${new Date(feature.properties.time).toLocaleDateString()}</p> 
        <p><strong>Time:</strong> ${new Date(feature.properties.time).toLocaleTimeString()}</p> 
        <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
        <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]}</p>` 
        ); 
    }

    //Define magnitude radius/size
    function getRadius(mag) {
        return mag*4;
    }

    //Define depth colors
    function getColor(dep) {
        return dep >= -10 && dep <10 ? "#7CFC00"
        : dep >=10 && dep <30 ? "#e6e600"
        : dep >=30 && dep <50 ? "#ffcc33"
        : dep >=50 && dep <70 ? "#ffa31a"
        : dep >=70 && dep <90 ? "#ff8000"
        : "#ff4000"; 
    }

    //Create earthquakes overlay
    earthquakes = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000", 
            weight: .5,
            opacity: .5,
            fillOpacity: .75
          });
        },
        onEachFeature: onEachFeature
    }).addTo(myMap);

    //Create legend
    var legend = L.control({position: "bottomright"}); 
    legend.onAdd = (map) => {
      var div = L.DomUtil.create('div', 'info legend');
      labels = ['<h3><strong>Depths</strong></h3>'];
      categories = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
      color = ["#7CFC00", "#e6e600", "#ffcc33", "#ffa31a", "#ff8000", "#ff4000"];
  
      for (var i=0; i < categories.length; i++) {
        div.innerHTML +=
        labels.push(
          '<i style="background:' + color[i] + '"></i>' + (categories[i]? categories[i]: "+")
        ); 
      }
      div.innerHTML = labels.join("<br>");
      return div;
    };
    legend.addTo(myMap);
}