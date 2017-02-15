var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("bower_components/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
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
    function debounce(func, wait) {
        if (wait === void 0) { wait = 50; }
        var h;
        return function () {
            clearTimeout(h);
            h = setTimeout(function () { return func(); }, wait);
        };
    }
    exports.debounce = debounce;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    function html(html) {
        var d = document;
        var a = d.createElement("div");
        var b = d.createDocumentFragment();
        a.innerHTML = html;
        while (a.firstChild)
            b.appendChild(a.firstChild);
        return b.firstElementChild;
    }
    exports.html = html;
});
define("ol3-input/ol3-input", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_1) {
    "use strict";
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
        autoChange: false,
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
            if (options.autoChange) {
                input.addEventListener("keypress", common_1.debounce(function () {
                }));
            }
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
            common_1.cssin('ol-input', css);
            // provide computed defaults        
            options = common_1.mixin({
                openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
                closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
            }, options || {});
            // provide static defaults        
            options = common_1.mixin(common_1.mixin({}, defaults), options);
            var element = document.createElement('div');
            element.className = options.className + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var geocoderOptions = common_1.mixin({
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
        Input.prototype.on = function (type, cb) {
            _super.prototype.on.call(this, type, cb);
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
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/base", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    var StyleConverter = (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.fromJson = function (json) {
            return this.deserializeStyle(json);
        };
        StyleConverter.prototype.toJson = function (style) {
            return this.serializeStyle(style);
        };
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        StyleConverter.prototype.setGeometry = function (feature) {
            var geom = feature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                geom = geom.getInteriorPoint();
            }
            return geom;
        };
        StyleConverter.prototype.assign = function (obj, prop, value) {
            //let getter = prop[0].toUpperCase() + prop.substring(1);
            if (value === null)
                return;
            if (value === undefined)
                return;
            if (typeof value === "object") {
                if (Object.keys(value).length === 0)
                    return;
            }
            if (prop === "image") {
                if (value.hasOwnProperty("radius")) {
                    prop = "circle";
                }
                if (value.hasOwnProperty("points")) {
                    prop = "star";
                }
            }
            obj[prop] = value;
        };
        StyleConverter.prototype.serializeStyle = function (style) {
            var _this = this;
            var s = {};
            if (!style)
                return null;
            if (typeof style === "string")
                return style;
            if (typeof style === "number")
                return style;
            if (style.getColor)
                mixin(s, this.serializeColor(style.getColor()));
            if (style.getImage)
                this.assign(s, "image", this.serializeStyle(style.getImage()));
            if (style.getFill)
                this.assign(s, "fill", this.serializeFill(style.getFill()));
            if (style.getOpacity)
                this.assign(s, "opacity", style.getOpacity());
            if (style.getStroke)
                this.assign(s, "stroke", this.serializeStyle(style.getStroke()));
            if (style.getText)
                this.assign(s, "text", this.serializeStyle(style.getText()));
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getOffsetX)
                this.assign(s, "offset-x", style.getOffsetX());
            if (style.getOffsetY)
                this.assign(s, "offset-y", style.getOffsetY());
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getFont)
                this.assign(s, "font", style.getFont());
            if (style.getRadius)
                this.assign(s, "radius", style.getRadius());
            if (style.getRadius2)
                this.assign(s, "radius2", style.getRadius2());
            if (style.getPoints)
                this.assign(s, "points", style.getPoints());
            if (style.getAngle)
                this.assign(s, "angle", style.getAngle());
            if (style.getRotation)
                this.assign(s, "rotation", style.getRotation());
            if (style.getOrigin)
                this.assign(s, "origin", style.getOrigin());
            if (style.getScale)
                this.assign(s, "scale", style.getScale());
            if (style.getSize)
                this.assign(s, "size", style.getSize());
            if (style.getAnchor) {
                this.assign(s, "anchor", style.getAnchor());
                "anchorXUnits,anchorYUnits,anchorOrigin".split(",").forEach(function (k) {
                    _this.assign(s, k, style[k + "_"]);
                });
            }
            // "svg"
            if (style.path) {
                if (style.path)
                    this.assign(s, "path", style.path);
                if (style.getImageSize)
                    this.assign(s, "imgSize", style.getImageSize());
                if (style.stroke)
                    this.assign(s, "stroke", style.stroke);
                if (style.fill)
                    this.assign(s, "fill", style.fill);
                if (style.scale)
                    this.assign(s, "scale", style.scale); // getScale and getImgSize are modified in deserializer               
                if (style.imgSize)
                    this.assign(s, "imgSize", style.imgSize);
            }
            // "icon"
            if (style.getSrc)
                this.assign(s, "src", style.getSrc());
            if (s.points && s.radius !== s.radius2)
                s.points /= 2; // ol3 defect doubles point count when r1 <> r2  
            return s;
        };
        StyleConverter.prototype.serializeColor = function (color) {
            if (color instanceof Array) {
                return {
                    color: ol.color.asString(color)
                };
            }
            else if (color instanceof CanvasGradient) {
                return {
                    gradient: color
                };
            }
            else if (color instanceof CanvasPattern) {
                return {
                    pattern: color
                };
            }
            else if (typeof color === "string") {
                return {
                    color: color
                };
            }
            throw "unknown color type";
        };
        StyleConverter.prototype.serializeFill = function (fill) {
            return this.serializeStyle(fill);
        };
        StyleConverter.prototype.deserializeStyle = function (json) {
            var _this = this;
            var image;
            var text;
            var fill;
            var stroke;
            if (json.circle)
                image = this.deserializeCircle(json.circle);
            else if (json.star)
                image = this.deserializeStar(json.star);
            else if (json.icon)
                image = this.deserializeIcon(json.icon);
            else if (json.svg)
                image = this.deserializeSvg(json.svg);
            else if (json.image && (json.image.img || json.image.path))
                image = this.deserializeSvg(json.image);
            else if (json.image && json.image.src)
                image = this.deserializeIcon(json.image);
            else if (json.image)
                throw "unknown image type";
            if (json.text)
                text = this.deserializeText(json.text);
            if (json.fill)
                fill = this.deserializeFill(json.fill);
            if (json.stroke)
                stroke = this.deserializeStroke(json.stroke);
            var s = new ol.style.Style({
                image: image,
                text: text,
                fill: fill,
                stroke: stroke
            });
            image && s.setGeometry(function (feature) { return _this.setGeometry(feature); });
            return s;
        };
        StyleConverter.prototype.deserializeText = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            var _a = [json["offset-x"] || 0, json["offset-y"] || 0], x = _a[0], y = _a[1];
            {
                var p = new ol.geom.Point([x, y]);
                p.rotate(json.rotation, [0, 0]);
                p.scale(json.scale, json.scale);
                _b = p.getCoordinates(), x = _b[0], y = _b[1];
            }
            return new ol.style.Text({
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke),
                text: json.text,
                font: json.font,
                offsetX: x,
                offsetY: y,
                rotation: json.rotation,
                scale: json.scale
            });
            var _b;
        };
        StyleConverter.prototype.deserializeCircle = function (json) {
            var image = new ol.style.Circle({
                radius: json.radius,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            image.setOpacity(json.opacity);
            return image;
        };
        StyleConverter.prototype.deserializeStar = function (json) {
            var image = new ol.style.RegularShape({
                radius: json.radius,
                radius2: json.radius2,
                points: json.points,
                angle: json.angle,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            doif(json.rotation, function (v) { return image.setRotation(v); });
            doif(json.opacity, function (v) { return image.setOpacity(v); });
            return image;
        };
        StyleConverter.prototype.deserializeIcon = function (json) {
            if (!json.anchor) {
                json.anchor = [json["anchor-x"] || 0.5, json["anchor-y"] || 0.5];
            }
            var image = new ol.style.Icon({
                anchor: json.anchor || [0.5, 0.5],
                anchorOrigin: json.anchorOrigin || "top-left",
                anchorXUnits: json.anchorXUnits || "fraction",
                anchorYUnits: json.anchorYUnits || "fraction",
                //crossOrigin?: string;
                img: undefined,
                imgSize: undefined,
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                scale: json.scale,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                rotation: json.rotation,
                size: json.size,
                src: json.src,
                color: json.color
            });
            image.load();
            return image;
        };
        StyleConverter.prototype.deserializeSvg = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            if (json.img) {
                var symbol = document.getElementById(json.img);
                if (!symbol) {
                    throw "unable to find svg element: " + json.img;
                }
                if (symbol) {
                    // but just grab the path is probably good enough
                    var path = (symbol.getElementsByTagName("path")[0]);
                    if (path) {
                        if (symbol.viewBox) {
                            if (!json.imgSize) {
                                json.imgSize = [symbol.viewBox.baseVal.width, symbol.viewBox.baseVal.height];
                            }
                        }
                        json.path = (json.path || "") + path.getAttribute('d');
                    }
                }
            }
            var canvas = document.createElement("canvas");
            if (json.path) {
                {
                    // rotate a rectangle and get the resulting extent
                    _a = json.imgSize.map(function (v) { return v * json.scale; }), canvas.width = _a[0], canvas.height = _a[1];
                    if (json.stroke && json.stroke.width) {
                        var dx = 2 * json.stroke.width * json.scale;
                        canvas.width += dx;
                        canvas.height += dx;
                    }
                }
                var ctx = canvas.getContext('2d');
                var path2d = new Path2D(json.path);
                // rotate  before it is in the canvas (avoids pixelation)
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(json.scale, json.scale);
                ctx.translate(-json.imgSize[0] / 2, -json.imgSize[1] / 2);
                if (json.fill) {
                    ctx.fillStyle = json.fill.color;
                    ctx.fill(path2d);
                }
                if (json.stroke) {
                    ctx.strokeStyle = json.stroke.color;
                    ctx.lineWidth = json.stroke.width;
                    ctx.stroke(path2d);
                }
            }
            var icon = new ol.style.Icon({
                img: canvas,
                imgSize: [canvas.width, canvas.height],
                rotation: json.rotation,
                scale: 1,
                anchor: json.anchor || [canvas.width / 2, canvas.height],
                anchorOrigin: json.anchorOrigin,
                anchorXUnits: json.anchorXUnits || "pixels",
                anchorYUnits: json.anchorYUnits || "pixels",
                //crossOrigin?: string;
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                size: [canvas.width, canvas.height],
                src: undefined
            });
            return mixin(icon, {
                path: json.path,
                stroke: json.stroke,
                fill: json.fill,
                scale: json.scale,
                imgSize: json.imgSize
            });
            var _a;
        };
        StyleConverter.prototype.deserializeFill = function (json) {
            var fill = new ol.style.Fill({
                color: json && this.deserializeColor(json)
            });
            return fill;
        };
        StyleConverter.prototype.deserializeStroke = function (json) {
            var stroke = new ol.style.Stroke();
            doif(json.color, function (v) { return stroke.setColor(v); });
            doif(json.lineCap, function (v) { return stroke.setLineCap(v); });
            doif(json.lineDash, function (v) { return stroke.setLineDash(v); });
            doif(json.lineJoin, function (v) { return stroke.setLineJoin(v); });
            doif(json.miterLimit, function (v) { return stroke.setMiterLimit(v); });
            doif(json.width, function (v) { return stroke.setWidth(v); });
            return stroke;
        };
        StyleConverter.prototype.deserializeColor = function (fill) {
            if (fill.color) {
                return fill.color;
            }
            if (fill.gradient) {
                var type = fill.gradient.type;
                var gradient_1;
                if (0 === type.indexOf("linear(")) {
                    gradient_1 = this.deserializeLinearGradient(fill.gradient);
                }
                else if (0 === type.indexOf("radial(")) {
                    gradient_1 = this.deserializeRadialGradient(fill.gradient);
                }
                if (fill.gradient.stops) {
                    // preserve
                    mixin(gradient_1, {
                        stops: fill.gradient.stops
                    });
                    var stops = fill.gradient.stops.split(";");
                    stops = stops.map(function (v) { return v.trim(); });
                    stops.forEach(function (colorstop) {
                        var stop = colorstop.match(/ \d+%/m)[0];
                        var color = colorstop.substr(0, colorstop.length - stop.length);
                        gradient_1.addColorStop(parseInt(stop) / 100, color);
                    });
                }
                return gradient_1;
            }
            if (fill.pattern) {
                var repitition = fill.pattern.repitition;
                var canvas = document.createElement('canvas');
                var spacing = canvas.width = canvas.height = fill.pattern.spacing | 6;
                var context = canvas.getContext('2d');
                context.fillStyle = fill.pattern.color;
                switch (fill.pattern.orientation) {
                    case "horizontal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                        }
                        break;
                    case "vertical":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "cross":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "forward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                        }
                        break;
                    case "backward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                    case "diagonal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                }
                return mixin(context.createPattern(canvas, repitition), fill.pattern);
            }
            throw "invalid color configuration";
        };
        StyleConverter.prototype.deserializeLinearGradient = function (json) {
            var rx = /\w+\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], x1 = _a[2], y1 = _a[3];
            var canvas = document.createElement('canvas');
            // not correct, assumes points reside on edge
            canvas.width = Math.max(x0, x1);
            canvas.height = Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createLinearGradient(x0, y0, x1, y1);
            mixin(gradient, {
                type: "linear(" + [x0, y0, x1, y1].join(",") + ")"
            });
            return gradient;
        };
        StyleConverter.prototype.deserializeRadialGradient = function (json) {
            var rx = /radial\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], r0 = _a[2], x1 = _a[3], y1 = _a[4], r1 = _a[5];
            var canvas = document.createElement('canvas');
            // not correct, assumes radial centered
            canvas.width = 2 * Math.max(x0, x1);
            canvas.height = 2 * Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
            mixin(gradient, {
                type: "radial(" + [x0, y0, r0, x1, y1, r1].join(",") + ")"
            });
            return gradient;
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
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
define("ol3-input/examples/ol3-input", ["require", "exports", "openlayers", "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", "ol3-input/ol3-input", "ol3-input/providers/osm", "jquery"], function (require, exports, ol, ol3_symbolizer_1, ol3_input_1, osm_1, $) {
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
                center: center,
                projection: 'EPSG:3857',
                zoom: 6
            })
        });
        var source = new ol.source.Vector();
        var symbolizer = new ol3_symbolizer_1.StyleConverter();
        var vector = new ol.layer.Vector({
            source: source,
            style: function (feature, resolution) {
                return symbolizer.fromJson({
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
                });
            }
        });
        map.addLayer(vector);
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
                        _b = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857"), lon1 = _b[0], lat1 = _b[1];
                        _c = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857"), lon2 = _c[0], lat2 = _c[1];
                        map.getView().fit([lon1, lat1, lon2, lat2], map.getSize());
                        var extent = [lon1, lat1, lon2, lat2];
                        var feature = new ol.Feature(new ol.geom.Polygon([[
                                ol.extent.getBottomLeft(extent),
                                ol.extent.getTopLeft(extent),
                                ol.extent.getTopRight(extent),
                                ol.extent.getBottomRight(extent),
                                ol.extent.getBottomLeft(extent)
                            ]]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                    }
                    else {
                        var _d = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _d[0], lat = _d[1];
                        map.getView().setCenter([lon, lat]);
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                    }
                    return true;
                    var _b, _c;
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
            placeholderText: "Feature Finder",
            autoClear: true,
            autoCollapse: false,
            canCollapse: false,
            hideButton: true,
            autoChange: true,
            onChange: function (args) {
                var value = args.value.toLocaleLowerCase();
                source.forEachFeature(function (feature) {
                    var text = feature.get("text");
                    if (!text)
                        return;
                    if (-1 < text.toLocaleLowerCase().indexOf(value)) {
                        map.getView().animate({
                            center: feature.getGeometry().getClosestPoint(map.getView().getCenter()),
                            duration: 1000
                        });
                        return true;
                    }
                });
            }
        }));
        var topLeft = ol3_input_1.Input.create({
            className: 'ol-input top-4 left',
            expanded: false,
            placeholderText: "Top Left Search",
            onChange: changeHandler
        });
        map.addControl(topLeft);
        topLeft.on("change", function (args) {
            console.log("value", args.value, args.type, args.target);
        });
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