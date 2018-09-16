import ol = require("openlayers");
import { olx } from "openlayers";

import { cssin, mixin } from "ol3-fun/index";

export class MapMaker {
	static DEFAULT_OPTIONS: olx.MapOptions = {};
	static create(options: { target?: Element; center: [number, number]; projection: string; zoom: number }) {
		if (!options.target) {
			let target = document.getElementById("map");
			if (!target) target = document.getElementsByClassName("map")[0] as HTMLElement;
			if (!target) {
				target = document.createElement("div");
				target.id = target.className = "map";
				document.body.appendChild(target);
			}
			options.target = target;
		}

		options = mixin(mixin({}, MapMaker.DEFAULT_OPTIONS), options);

		options.target.classList.add("ol-map");
		cssin(
			"mapmaker",
			`
        .ol-map {
            top: 0;
            left: 0;
            right: 0;
            bottom:0;
            position: absolute;
        }
        .ol-scale-line {
            left: auto;
            right: 1em;
        }
        `
		);

		let osm = new ol.layer.Tile({
			opacity: 0.8,
			source: new ol.source.TileDebug({
				projection: "EPSG:3857",
				tileGrid: ol.tilegrid.createXYZ({
					tileSize: 256
				})
			})
		});

		let view = new ol.View({
			projection: options.projection,
			center: options.center,
			zoom: options.zoom
		});

		let map = new ol.Map({
			target: options.target,
			keyboardEventTarget: document,
			loadTilesWhileAnimating: true,
			loadTilesWhileInteracting: true,
			controls: ol.control.defaults({ attribution: false }).extend([
				new ol.control.ScaleLine(),
				new ol.control.OverviewMap({
					layers: [osm],
					view: new ol.View({
						projection: options.projection
					})
				})
			]),
			view: view,
			layers: [osm]
		});
		return map;
	}
}