import ol = require("openlayers");
import $ = require("jquery");

import { cssin, mixin, debounce } from "ol3-fun/ol3-fun/common";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";
import { OpenStreet } from "./providers/osm";

const css = `
    .ol-input {
        position:absolute;
    }
    .ol-input.top {
        top: 0.5em;
    }
    .ol-input.top-1 {
        top: 1.5em;
    }
    .ol-input.top-2 {
        top: 2.5em;
    }
    .ol-input.top-3 {
        top: 3.5em;
    }
    .ol-input.top-4 {
        top: 4.5em;
    }
    .ol-input.left {
        left: 0.5em;
    }
    .ol-input.left-1 {
        left: 1.5em;
    }
    .ol-input.left-2 {
        left: 2.5em;
    }
    .ol-input.left-3 {
        left: 3.5em;
    }
    .ol-input.left-4 {
        left: 4.5em;
    }
    .ol-input.bottom {
        bottom: 0.5em;
    }
    .ol-input.bottom-1 {
        bottom: 1.5em;
    }
    .ol-input.bottom-2 {
        bottom: 2.5em;
    }
    .ol-input.bottom-3 {
        bottom: 3.5em;
    }
    .ol-input.bottom-4 {
        bottom: 4.5em;
    }
    .ol-input.right {
        right: 0.5em;
    }
    .ol-input.right-1 {
        right: 1.5em;
    }
    .ol-input.right-2 {
        right: 2.5em;
    }
    .ol-input.right-3 {
        right: 3.5em;
    }
    .ol-input.right-4 {
        right: 4.5em;
    }
    .ol-input button {
        min-height: 1.375em;
        min-width: 1.375em;
        width: auto;
        display: inline;
    }
    .ol-input.left button {
        float:right;
    }
    .ol-input.right button {
        float:left;
    }
    .ol-input input {
        height: 2.175em;
        width: 16em;
        border: none;
        padding: 0;
        margin: 0;
        margin-left: 2px;
        margin-top: 2px;
        vertical-align: top;
        transition: width 0.25s;
    }
    .ol-input input.ol-hidden {
        width: 0;
        margin: 0;
    }
`;

let olcss = {
    CLASS_CONTROL: 'ol-control',
    CLASS_UNSELECTABLE: 'ol-unselectable',
    CLASS_UNSUPPORTED: 'ol-unsupported',
    CLASS_HIDDEN: 'ol-hidden'
};

function changeHandlerFactor(input: Input) {
    let options = input.options;

    let searchProvider = new OpenStreet();

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
                    let extent = <ol.Extent>[lon1, lat1, lon2, lat2];

                    let feature = new ol.Feature(new ol.geom.Polygon([[
                        ol.extent.getBottomLeft(extent),
                        ol.extent.getTopLeft(extent),
                        ol.extent.getTopRight(extent),
                        ol.extent.getBottomRight(extent),
                        ol.extent.getBottomLeft(extent)
                    ]]));

                    feature.set("text", r.original.display_name);
                    options.source && options.source.addFeature(feature);
                    zoomToFeature(options.map, feature);
                } else {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.display_name);
                    options.source && options.source.addFeature(feature);
                    zoomToFeature(options.map, feature);
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    };

    return changeHandler;
}

export interface InputOptions extends olx.control.ControlOptions {
    map?: ol.Map;
    // what css class name to assign to the main element
    className?: string;
    expanded?: boolean;
    hideButton?: boolean;
    autoChange?: boolean;
    autoClear?: boolean;
    autoCollapse?: boolean;
    autoSelect?: boolean;
    canCollapse?: boolean;
    closedText?: string;
    openedText?: string;
    target?: HTMLElement;
    regex?: RegExp;
    // what to show on the tooltip
    placeholderText?: string;
    provider?: typeof OpenStreet;
    source?: ol.source.Vector;
}

const expando = {
    right: '»',
    left: '«'
};

export class Input extends ol.control.Control {

    static DEFAULT_OPTIONS: InputOptions = {
        className: 'ol-input bottom left',
        expanded: false,
        autoChange: false,
        autoClear: false,
        autoCollapse: true,
        autoSelect: true,
        canCollapse: true,
        hideButton: false,
        closedText: expando.right,
        openedText: expando.left,
        provider: OpenStreet,
        placeholderText: 'Search',
        regex: /\S{2,}/,
    };

    static create(options?: InputOptions): Input {

        cssin('ol-input', css);

        // provide computed defaults        
        options = mixin({
            openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
            closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, Input.DEFAULT_OPTIONS), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let geocoderOptions = mixin({
            element: element,
            target: options.target,
            expanded: false
        }, options);

        let input = new Input(geocoderOptions);

        if (options.map) {
            options.map.addControl(input);
        }

        return input;
    }

    button: HTMLButtonElement;
    input: HTMLInputElement;
    options: InputOptions;

    constructor(options: InputOptions) {

        if (options.hideButton) {
            options.canCollapse = false;
            options.autoCollapse = false;
            options.expanded = true;
        }

        super({
            element: options.element,
            target: options.target
        });

        this.options = options;

        // have a provider and a source, go for it!
        if (options.provider && options.source) {
            this.on("change", changeHandlerFactor(this));
        }

        let button = this.button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.title = options.placeholderText;
        options.element.appendChild(button);
        if (options.hideButton) {
            button.style.display = "none";
        }

        let input = this.input = document.createElement('input');
        input.placeholder = options.placeholderText;

        options.element.appendChild(input);

        button.addEventListener("click", () => {
            options.expanded ? this.collapse(options) : this.expand(options);
        });

        if (options.autoCollapse) {
            input.addEventListener("keydown", (args: KeyboardEvent) => {
                if (args.key === "Enter") {
                    button.focus();
                    this.collapse(options);
                }
            });
        }

        input.addEventListener("keypress", (args: KeyboardEvent) => {
            if (args.key === "Enter") {
                button.focus();
            }
        });

        if (options.autoChange) {

            input.addEventListener("keypress", debounce(() => {

                if (options.regex && !options.regex.test(input.value)) return;
                let args = {
                    type: "change",
                    value: input.value
                };

                options.autoSelect && this.input.select();

                this.dispatchEvent(args);

            }, 500));
        }

        input.addEventListener("change", () => {

            if (options.regex && !options.regex.test(input.value)) return;

            let args = {
                type: "change",
                value: input.value
            };

            options.autoSelect && input.select();

            if (options.autoClear) {
                input.value = "";
            }

            this.dispatchEvent(args);
        });

        if (options.autoSelect) {
            input.addEventListener("focus", () => {
                input.select();
            });
        }

        options.expanded ? this.expand(options) : this.collapse(options);
    }

    collapse(options: InputOptions) {
        if (!options.canCollapse) return;
        options.expanded = false;
        this.input.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.innerHTML = options.closedText;
    }

    expand(options: InputOptions) {
        options.expanded = true;
        this.input.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.innerHTML = options.openedText;
        this.input.focus();
        options.autoSelect && this.input.select();
    }

    on(type: string, cb: Function);
    on(type: "change", cb: (args: {
        type: string;
        target: Input;
        value: string;
    }) => void);
    on(type: string, cb: Function) {
        super.on(type, cb);
    }
}