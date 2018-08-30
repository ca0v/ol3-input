import ol = require("openlayers");
import $ = require("jquery");

import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";
import { Input } from "../../ol3-input/index";
import { cssin } from "ol3-fun/ol3-fun/common";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";
import { ArcGisVectorSourceFactory } from "ol3-symbolizer/ol3-symbolizer/ags/ags-source";

export function run() {

    cssin("examples/ol3-input", `

.ol-grid.statecode .ol-grid-container {
    background-color: white;
    width: 10em;
}

.ol-grid .ol-grid-container.ol-hidden {
}

.ol-grid .ol-grid-container {
    width: 15em;
}

.ol-input.top.right > input {
    width: 18em;
}

.ol-grid-table {
    width: 100%;
}

table.ol-grid-table {
    border-collapse: collapse;
    width: 100%;
}

table.ol-grid-table > td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
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
        style: (feature: ol.Feature, resolution: number) => {
            let style = feature.getStyle();
            if (!style) {
                style = symbolizer.fromJson({
                    circle: {
                        radius: 4,
                        fill: {
                            color: "rgba(33, 33, 33, 0.2)"
                        },
                        stroke: {
                            color: "#F00"
                        }
                    },
                    text: {
                        text: feature.get("text")
                    }
                });
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
    });

    ArcGisVectorSourceFactory.create({
        map: map,
        serviceType: "MapServer",
        services: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services',
        serviceName: 'USA_States_Generalized',
        layers: [0]
    }).then(layers => {
        layers.forEach(layer => {

            layer.setStyle((feature: ol.Feature, resolution) => {
                let style = <ol.style.Style>feature.getStyle();
                if (!style) {
                    style = symbolizer.fromJson({
                        fill: {
                            color: "rgba(200,200,200,0.5)"
                        },
                        stroke: {
                            color: "rgba(33,33,33,0.8)",
                            width: 3
                        },
                        text: {
                            text: feature.get("STATE_ABBR")
                        }
                    });
                    feature.setStyle(style);
                }
                return style;
            });

            map.addLayer(layer);

            // search for a state using 2 character state code
            let input = Input.create({
                map: map,
                className: "ol-input statecode",
                position: "top left-2",
                closedText: "+",
                openedText: "−",
                autoChange: true,
                autoSelect: true,
                autoClear: false,
                autoCollapse: false,
                placeholderText: "XX",
                provider: null, // do not auto-search
                regex: /^\w{2}$/m
            });
            input.input.maxLength = 2;

            // search existing features for STATE_ABBR, zoom to first one found
            // if none found, invoke change handler
            input.on("change", args => {
                let value = args.value.toLocaleLowerCase();
                let feature = layer.getSource().forEachFeature(feature => {
                    let text = <string>feature.get("STATE_ABBR");
                    if (!text) return;
                    if (-1 < text.toLocaleLowerCase().indexOf(value)) {
                        return feature;
                    }
                });
                if (feature) {
                    zoomToFeature(map, feature);
                } else {
                    changeHandler({ value: value });
                }
            });

        });
    }).then(() => {
        map.addLayer(vector);
    });

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