import ol = require("openlayers");
import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
import { Input } from "../ol3-input";
import { OpenStreet } from "../providers/osm";
import $ = require("jquery");

export function run() {

    let searchProvider = new OpenStreet();

    let center = ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857');

    let mapContainer = document.getElementsByClassName("map")[0];

    let map = new ol.Map({
        target: mapContainer,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: center,
            projection: 'EPSG:3857',
            zoom: 6
        })
    });

    let source = new ol.source.Vector();

    let symbolizer = new StyleConverter();

    let vector = new ol.layer.Vector({
        source: source,
        style: (feature: ol.Feature, resolution: number) =>
            symbolizer.fromJson({
                fill: {
                    color: "rgba(33, 33, 33, 0.2)"
                },
                stroke: {
                    color: "#F00"
                },
                text: {
                    text: feature.get("text")
                }
            }) || new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "#CCC"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(255,0,0,1)"
                }),
                text: new ol.style.Text({
                    text: feature.get("text")
                })
            })
    });

    map.addLayer(vector);

    let changeHandler = (args: { value: string }) => {
        if (!args.value) return;
        console.log("search", args.value);

        let searchArgs = searchProvider.getParameters({
            query: args.value,
            limit: 1,
            countrycodes: 'us',
            lang: 'en'
        });

        $.ajax({
            url: searchArgs.url,
            method: searchProvider.method || 'GET',
            data: searchArgs.params,
            dataType: searchProvider.dataType || 'json'
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                console.log(r);
                if (r.original.boundingbox) {
                    let [lat1, lat2, lon1, lon2] = r.original.boundingbox.map(v => parseFloat(v));
                    [lon1, lat1] = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857");
                    [lon2, lat2] = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857");
                    map.getView().fit([lon1, lat1, lon2, lat2], map.getSize());
                    let extent = <ol.Extent>[lon1, lat1, lon2, lat2];

                    let feature = new ol.Feature(new ol.geom.Polygon([[
                        ol.extent.getBottomLeft(extent),
                        ol.extent.getTopLeft(extent),
                        ol.extent.getTopRight(extent),
                        ol.extent.getBottomRight(extent),
                        ol.extent.getBottomLeft(extent)
                    ]]));

                    feature.set("text", r.original.display_name);
                    source.addFeature(feature);
                } else {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    map.getView().setCenter([lon, lat]);
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.display_name);
                    source.addFeature(feature);
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    };

    // vertical elipsis: &#x22EE;
    let geocoder = Input.create({
        closedText: "+",
        openedText: "−",
        placeholderText: "Bottom Left Search",
        onChange: changeHandler
    });
    map.addControl(geocoder);

    map.addControl(Input.create({
        className: 'ol-input bottom-2 right',
        expanded: true,
        placeholderText: "Bottom Right Search",
        onChange: changeHandler
    }));

    map.addControl(Input.create({
        className: 'ol-input top right',
        expanded: true,
        openedText: "?",
        placeholderText: "Feature Finder",
        autoClear: true,
        autoCollapse: false,
        canCollapse: false,
        hideButton: true,
        autoChange: true,
        onChange: args => {
            let value = args.value.toLocaleLowerCase();
            source.forEachFeature(feature => {
                let text = <string>feature.get("text");
                if (!text) return;
                if (-1 < text.toLocaleLowerCase().indexOf(value)) {
                    map.getView().animate({
                        center: feature.getGeometry().getClosestPoint(map.getView().getCenter()),
                        duration: 1000
                    })
                    return true;
                }
            })
        }
    }));

    let topLeft = Input.create({
        className: 'ol-input top-4 left',
        expanded: false,
        placeholderText: "Top Left Search",
        onChange: changeHandler
    });

    map.addControl(topLeft);

    topLeft.on("change", args => {
        console.log("value", args.value, args.type, args.target);
    });

}