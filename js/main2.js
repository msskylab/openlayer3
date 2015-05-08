(function () {
    $(function () {
        // Declare a Tile layer with an OSM source
        var osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
// Create latitude and longitude and convert them to default projection
        var birmingham = ol.proj.transform([-1.81185, 52.44314], 'EPSG:4326', 'EPSG:3857');
        var padang = ol.proj.transform([100.30217175557286, -1.0494630451740992], 'EPSG:4326', 'EPSG:3857');
// Create a View, set it center and zoom level
        var view = new ol.View({
            center: padang,
            zoom: 10
        });
// Instanciate a Map, set the object target to the map DOM id
        var map = new ol.Map({
            target: 'map'
        });
// Add the created layer to the Map
        map.addLayer(osmLayer);
        map.on("click", function (e) {
            var koor = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
            var viewProjection = view.getProjection();
            var viewResolution = view.getResolution();
            console.log("View Resolution : " + viewResolution);
            console.log(viewProjection);
            $("#koordinat").text(koor);
        });
// Set the view for the map
        map.setView(view);
    });
}());

