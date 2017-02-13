var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// http://www.w3schools.com/charsets/ref_utf_arrows.asp
define("ol3-input/ol3-input", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.innerText = css;
            document.head.appendChild(styleTag);
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    var css = "\n    .ol-input {\n        position:absolute;\n    }\n    .ol-input.top {\n        top: 0.5em;\n    }\n    .ol-input.top-1 {\n        top: 1.5em;\n    }\n    .ol-input.top-2 {\n        top: 2.5em;\n    }\n    .ol-input.top-3 {\n        top: 3.5em;\n    }\n    .ol-input.top-4 {\n        top: 4.5em;\n    }\n    .ol-input.left {\n        left: 0.5em;\n    }\n    .ol-input.left-1 {\n        left: 1.5em;\n    }\n    .ol-input.left-2 {\n        left: 2.5em;\n    }\n    .ol-input.left-3 {\n        left: 3.5em;\n    }\n    .ol-input.left-4 {\n        left: 4.5em;\n    }\n    .ol-input.bottom {\n        bottom: 0.5em;\n    }\n    .ol-input.bottom-1 {\n        bottom: 1.5em;\n    }\n    .ol-input.bottom-2 {\n        bottom: 2.5em;\n    }\n    .ol-input.bottom-3 {\n        bottom: 3.5em;\n    }\n    .ol-input.bottom-4 {\n        bottom: 4.5em;\n    }\n    .ol-input.right {\n        right: 0.5em;\n    }\n    .ol-input.right-1 {\n        right: 1.5em;\n    }\n    .ol-input.right-2 {\n        right: 2.5em;\n    }\n    .ol-input.right-3 {\n        right: 3.5em;\n    }\n    .ol-input.right-4 {\n        right: 4.5em;\n    }\n    .ol-input button {\n        min-height: 1.375em;\n        min-width: 1.375em;\n        width: auto;\n        display: inline;\n    }\n    .ol-input.left button {\n        float:right;\n    }\n    .ol-input.right button {\n        float:left;\n    }\n    .ol-input input {\n        height: 2.175em;\n        width: 16em;\n        border: none;\n        padding: 0;\n        margin: 0;\n        margin-left: 2px;\n        margin-top: 2px;\n        vertical-align: top;\n    }\n    .ol-input input.ol-hidden {\n        width: 0;\n        margin: 0;\n    }\n";
    var olcss = {
        CLASS_CONTROL: 'ol-control',
        CLASS_UNSELECTABLE: 'ol-unselectable',
        CLASS_UNSUPPORTED: 'ol-unsupported',
        CLASS_HIDDEN: 'ol-hidden'
    };
    var expando = {
        right: '»',
        left: '«'
    };
    var defaults = {
        className: 'ol-input bottom left',
        expanded: false,
        autoClear: false,
        autoCollapse: true,
        autoSelect: true,
        canCollapse: true,
        hideButton: false,
        closedText: expando.right,
        openedText: expando.left,
        placeholderText: 'Search'
    };
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(options) {
            var _this = this;
            if (options.hideButton) {
                options.canCollapse = false;
                options.autoCollapse = false;
                options.expanded = true;
            }
            _this = _super.call(this, {
                element: options.element,
                target: options.target
            }) || this;
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.placeholderText;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var input = _this.input = document.createElement('input');
            input.placeholder = options.placeholderText;
            options.element.appendChild(input);
            button.addEventListener("click", function () {
                options.expanded ? _this.collapse(options) : _this.expand(options);
            });
            input.addEventListener("keypress", function (args) {
                if (args.key === "Enter") {
                    button.focus();
                    options.autoCollapse && _this.collapse(options);
                }
            });
            input.addEventListener("change", function () {
                var args = {
                    type: "change",
                    value: input.value
                };
                if (options.autoSelect) {
                    input.select();
                }
                if (options.autoClear) {
                    input.value = "";
                }
                _this.dispatchEvent(args);
                if (options.onChange)
                    options.onChange(args);
            });
            input.addEventListener("blur", function () {
                //this.collapse(options);
            });
            options.expanded ? _this.expand(options) : _this.collapse(options);
            return _this;
        }
        Input.create = function (options) {
            cssin('ol-input', css);
            // provide computed defaults        
            options = mixin({
                openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
                closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
            }, options || {});
            // provide static defaults        
            options = mixin(mixin({}, defaults), options);
            var element = document.createElement('div');
            element.className = options.className + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var geocoderOptions = mixin({
                element: element,
                target: options.target,
                expanded: false
            }, options);
            return new Input(geocoderOptions);
        };
        Input.prototype.collapse = function (options) {
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.input.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.innerHTML = options.closedText;
        };
        Input.prototype.expand = function (options) {
            options.expanded = true;
            this.input.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.innerHTML = options.openedText;
            this.input.focus();
            this.input.select();
        };
        return Input;
    }(ol.control.Control));
    exports.Input = Input;
});
define("index", ["require", "exports", "ol3-input/ol3-input"], function (require, exports, Input) {
    "use strict";
    return Input;
});
define("ol3-input/examples/index", ["require", "exports"], function (require, exports) {
    "use strict";
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-input/examples/";
        var labs = "\n    index\n    ol3-input\n    ";
        var styles = document.createElement("style");
        document.head.appendChild(styles);
        styles.innerText += "\n    #map {\n        display: none;\n    }\n    .test {\n        margin: 20px;\n    }\n    ";
        var html = labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .map(function (lab) { return "<div class='test'><a href='" + path + lab + "&debug=0'>" + lab + "</a></div>"; })
            .join("\n");
        html += "<a href='" + l.origin + l.pathname + "?run=ol3-input/tests/index'>tests</a>";
        document.write(html);
    }
    exports.run = run;
    ;
});
// https://github.com/jonataswalker/ol3-geocoder/blob/master/src/js/providers/osm.js
define("ol3-input/providers/osm", ["require", "exports"], function (require, exports) {
    "use strict";
    var OpenStreet = (function () {
        function OpenStreet() {
            this.dataType = 'json';
            this.method = 'GET';
            this.settings = {
                url: '//nominatim.openstreetmap.org/search/',
                params: {
                    q: '',
                    format: 'json',
                    addressdetails: 1,
                    limit: 10,
                    countrycodes: '',
                    'accept-language': 'en-US'
                }
            };
        }
        OpenStreet.prototype.getParameters = function (options) {
            return {
                url: this.settings.url,
                params: {
                    q: options.query,
                    format: 'json',
                    addressdetails: 1,
                    limit: options.limit || this.settings.params.limit,
                    countrycodes: options.countrycodes || this.settings.params.countrycodes,
                    'accept-language': options.lang || this.settings.params['accept-language']
                }
            };
        };
        OpenStreet.prototype.handleResponse = function (args) {
            return args.sort(function (v) { return v.importance || 1; }).map(function (result) { return ({
                original: result,
                lon: parseFloat(result.lon),
                lat: parseFloat(result.lat),
                address: {
                    name: result.address.neighbourhood || '',
                    road: result.address.road || '',
                    postcode: result.address.postcode,
                    city: result.address.city || result.address.town,
                    state: result.address.state,
                    country: result.address.country
                }
            }); });
        };
        return OpenStreet;
    }());
    exports.OpenStreet = OpenStreet;
});
define("ol3-input/examples/ol3-input", ["require", "exports", "openlayers", "ol3-input/ol3-input", "ol3-input/providers/osm", "jquery"], function (require, exports, ol, ol3_input_1, osm_1, $) {
    "use strict";
    function run() {
        var searchProvider = new osm_1.OpenStreet();
        var center = ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857');
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: [-0.92, 52.96],
                projection: 'EPSG:4326',
                zoom: 6
            })
        });
        var changeHandler = function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            var searchArgs = searchProvider.getParameters({
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
            }).then(function (json) {
                var results = searchProvider.handleResponse(json);
                results.some(function (r) {
                    console.log(r);
                    if (r.original.boundingbox) {
                        var _a = r.original.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                        map.getView().fit([lon1, lat1, lon2, lat2], map.getSize());
                    }
                    else {
                        map.getView().setCenter([r.lon, r.lat]);
                    }
                    return true;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        };
        // vertical elipsis: &#x22EE;
        var geocoder = ol3_input_1.Input.create({
            closedText: "+",
            openedText: "−",
            placeholderText: "Bottom Left Search",
            onChange: changeHandler
        });
        map.addControl(geocoder);
        map.addControl(ol3_input_1.Input.create({
            className: 'ol-input bottom-2 right',
            expanded: true,
            placeholderText: "Bottom Right Search",
            onChange: changeHandler
        }));
        map.addControl(ol3_input_1.Input.create({
            className: 'ol-input top right',
            expanded: true,
            openedText: "?",
            placeholderText: "Top Right",
            autoClear: true,
            autoCollapse: false,
            canCollapse: false,
            hideButton: true,
            onChange: changeHandler
        }));
        map.addControl(ol3_input_1.Input.create({
            className: 'ol-input top-4 left',
            expanded: false,
            placeholderText: "Top Left Search",
            onChange: changeHandler
        }));
    }
    exports.run = run;
});
define("ol3-input/tests/index", ["require", "exports"], function (require, exports) {
    "use strict";
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-input/tests/";
        var labs = "\n    index\n    ";
        document.writeln("\n    <p>\n    Watch the console output for failed assertions (blank is good).\n    </p>\n    ");
        document.writeln(labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .sort()
            .map(function (lab) { return "<a href=\"" + path + lab + "&debug=0\">" + lab + "</a>"; })
            .join("<br/>"));
    }
    exports.run = run;
    ;
});
//# sourceMappingURL=index.js.map