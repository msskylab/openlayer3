(function () {
    //var vectorSource = new ol.source.GeoJSON({
    //    projection: 'EPSG:3857',
    //    url: 'http://openlayers.org/en/v3.4.0/examples/data/geojson/countries.geojson'
    //});

    //var vectorLayer = new ol.layer.Vector({
    //    source: vectorSource
    //});


    var padang = ol.proj.transform([100.30217175557286, -1.0494630451740992], 'EPSG:4326', 'EPSG:3857');
    var view = new ol.View({
        center: padang ,
        zoom: 10
    });


    var map = new ol.Map({
        target: "map",
        view: view
    });

    var layerOsm = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    //
    var pdamLayer = new ol.layer.Vector({
        title: "PDAM Info Layer",
        source: new ol.source.GeoJSON({
            projection: "EPSG:3857",
            url: "http://localhost:8080/geoserver/pel_pdam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pel_pdam%3Ainfo&maxFeatures=500&outputformat=application%2Fjson"
            //url :"http://localhost:8080/geoserver/usa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=usa%3Astates&maxFeatures=50&outputformat=application%2Fjson"
        })
    });

    var wmsSource = new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {'LAYERS': 'pel_pdam:info'},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });
    var wmsLayer = new ol.layer.Tile({
        source: wmsSource
    });
    //var mapOverview = new ol.control.OverviewMap();

    var geoLocation = new ol.Geolocation({
        projection: view.getProjection(),
        tracking: true
    });


    var accuracyFeature = new ol.Feature();
    accuracyFeature.bindTo('geometry', geoLocation, 'accuracyGeometry');

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));
    positionFeature.bindTo('geometry', geoLocation, 'position')
        .transform(function () {
        }, function (coordinates) {
            return coordinates ? new ol.geom.Point(coordinates) : null;
        });


    var featuresOverlay = new ol.FeatureOverlay({
        map: map,
        features: [accuracyFeature, positionFeature]
    });

    map.addLayer(layerOsm);
    ////map.addLayer(pdamLayer);
    //map.addLayer(wmsLayer);
    ////map.addControl(mapOverview);
    //
    //
    $(function () {

        $("#zoomin").on("click", function () {
            var curzoom = map.getView().getZoom();
            map.getView().setZoom(curzoom + 1);
        });
        $("#zoomout").on("click", function () {
            var curzoom = map.getView().getZoom();
            map.getView().setZoom(curzoom - 1);
        });
        $("#addLayer").on("click", function () {
            map.addLayer(vectorLayer);
        });
        $("#remLayer").on("click", function () {
            map.removeLayer(vectorLayer);
        });
        $("#findme").on("click", function () {
            var koor = ol.proj.transform(geoLocation.getPosition(), 'EPSG:3857', 'EPSG:4326');
            console.log(koor);
            $("#lat").text("Lat : " + koor[0]);
            $("#lng").text("Lng : " + koor[1]);
            map.getView().setCenter(geoLocation.getPosition());
            map.getView().setZoom(15);
        });


        map.on('singleclick', function (evt) {
            $("#detail").innerHTML = '';
            var viewResolution = /** @type {number} */ (view.getResolution());
            var url = wmsSource.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857',
                {'INFO_FORMAT': 'text/html'});
            console.log(url);
            if (url) {
                //document.getElementById('detail').innerHTML =
                //    "<iframe src='" + url + "'></iframe>";
                $("#detail").html("<iframe src='" + url + "'></iframe>");
            }
        });
    });
}());

