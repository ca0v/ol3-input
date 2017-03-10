import ol = require("openlayers");
import $ = require("jquery");

import { cssin, mixin, debounce } from "ol3-fun/ol3-fun/common";
import { pair, range } from "ol3-fun/ol3-fun/common";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";
import { OpenStreet } from "./providers/osm";

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
    position?: string;
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
        className: 'ol-input',
        position: 'bottom left',
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

        // provide computed defaults        
        options = mixin({
            openedText: options.position && -1 < options.position.indexOf("left") ? expando.left : expando.right,
            closedText: options.position && -1 < options.position.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, Input.DEFAULT_OPTIONS), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${options.position} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let geocoderOptions = mixin({
            element: element,
            target: options.target,
            expanded: false
        }, options);

        let input = new Input(geocoderOptions);
        input.handlers.push(() => element.remove());

        if (options.map) {
            options.map.addControl(input);
        }

        return input;
    }

    button: HTMLButtonElement;
    input: HTMLInputElement;
    options: InputOptions;
    public handlers: Array<() => void>;

    private constructor(options: InputOptions) {

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
        this.handlers = [];

        this.cssin();

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

            input.addEventListener("blur", () => {
                this.collapse(options);
            });

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

    destroy() {
        this.handlers.forEach(h => h());
        this.setTarget(null);
    }

    setPosition(position: string) {
        this.options.position.split(' ')
            .forEach(k => this.options.element.classList.remove(k));

        position.split(' ')
            .forEach(k => this.options.element.classList.add(k));

        this.options.position = position;
    }

    cssin() {
        let className = this.options.className;
        let positions = pair("top left right bottom".split(" "), range(24))
            .map(pos => `.${className}.${pos[0] + (-pos[1] || '')} { ${pos[0]}:${0.5 + pos[1]}em; }`);

        this.handlers.push(cssin(className, `
            .${className} {
                position: absolute;
                background-color: rgba(255,255,255,.4);
            }
            .${className}.active {
                background-color: white;
            }
            .${className}:hover {
                background-color: white;
            }
            .${className} input[type="button"] {
                color: rgba(0,60,136,1);
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }            
            .${className} button {
                min-height: 1.375em;
                min-width: 1.375em;
                width: auto;
                display: inline;
            }

            .${className}.left button {
                float:right;
            }

            .${className}.right button {
                float:left;
            }

            .${className} input {
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

            .${className} input.ol-hidden {
                width: 0;
                margin: 0;
            }
            
            ${positions.join('\n')}
        `));
    }

    collapse(options: InputOptions) {
        if (!options.canCollapse) return;
        options.expanded = false;
        this.input.classList.add(olcss.CLASS_HIDDEN);
        this.button.classList.remove(olcss.CLASS_HIDDEN);
        this.button.innerHTML = options.closedText;
    }

    expand(options: InputOptions) {
        options.expanded = true;
        this.input.classList.remove(olcss.CLASS_HIDDEN);
        this.button.classList.add(olcss.CLASS_HIDDEN);
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