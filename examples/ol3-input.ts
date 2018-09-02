import ol = require("openlayers");
import $ = require("jquery");

import { Input } from "../ol3-input/ol3-input";
import { cssin } from "ol3-fun/ol3-fun/common";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";

export function run() {

    cssin("examples/ol3-input", `

.ol-input.top.right > input {
    width: 18em;
}

.ol-input.top.right > input:hover {
    width: 18em;
    border: 1px solid blue;
}

.ol-input input {
    height: 1.75em !important;
}

.ol-input.statecode > input {
    text-transform: uppercase;
    width: 2em;
    text-align: center;
}
    `);

    let searchProvider = new Input.DEFAULT_OPTIONS.provider();

    let center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');

    let mapContainer = document.getElementsByClassName("map")[0];

    let map = new ol.Map({
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true,
        target: mapContainer,
        layers: [
        ],
        view: new ol.View({
            center: center,
            projection: 'EPSG:3857',
            zoom: 6
        })
    });

    let source = new ol.source.Vector();

    let vector = new ol.layer.Vector({
        source: source,
        style: (feature: ol.Feature, resolution: number) => {
            let style = feature.getStyle();
            if (!style) {
                console.log(feature.getGeometry());
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 4,
                        fill: new ol.style.Fill({
                            color: "rgba(33, 33, 33, 0.2)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#F00"
                        })
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(33, 33, 33, 0.2)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#F00",
                        width: 1
                    }),
                    text: new ol.style.Text({
                        text: feature.get("text"),
                        fill: new ol.style.Fill({
                            color: "rgba(33, 33, 33, 0.2)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#F00",
                            width: 1
                        }),
                    })
                });
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
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
            crossDomain: true,
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
                    zoomToFeature(map, feature);
                } else {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.display_name);
                    source.addFeature(feature);
                    zoomToFeature(map, feature);
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    };

    // always perform a new search using default provider
    Input.create({
        map: map,
        //className: 'ol-input bottom-2 right',
        //expanded: true,
        placeholderText: "Default Handler",
        source: source // render result here
    });

    // Search the 'text' attribute of existing features and center
    // on feature, otherwise perform outside search via change handler
    Input
        .create({
            map: map,
            className: 'ol-input',
            position: 'top right',
            expanded: true,
            openedText: "?",
            placeholderText: "Search (text)",
            autoClear: true,
            autoCollapse: false,
            canCollapse: false,
            hideButton: true,
            autoChange: true,
            provider: null // prevent using default provider
        })
        .on("change", args => {
            let value = args.value.toLocaleLowerCase();
            let feature = source.forEachFeature(feature => {
                let text = <string>feature.get("text");
                if (!text) return;
                if (-1 < text.toLocaleLowerCase().indexOf(value)) {
                    return feature;
                }
            });
            if (feature) {
                map.getView().animate({
                    center: feature.getGeometry().getClosestPoint(map.getView().getCenter()),
                    duration: 1000
                });
            } else {
                changeHandler({ value: value });
            }
        });

}