declare module "bower_components/ol3-fun/ol3-fun/common" {
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function cssin(name: string, css: string): () => void;
    export function debounce(func: () => void, wait?: number): () => void;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
}
declare module "ol3-input/ol3-input" {
    import ol = require("openlayers");
    export interface IOptions {
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
        source?: HTMLElement;
        target?: HTMLElement;
        placeholderText?: string;
        onChange?: (args: {
            value: string;
        }) => void;
    }
    export class Input extends ol.control.Control {
        static create(options?: IOptions): Input;
        private button;
        private input;
        constructor(options: IOptions & {
            element: HTMLElement;
            target: HTMLElement;
        });
        collapse(options: IOptions): void;
        expand(options: IOptions): void;
        on(type: string, cb: Function): any;
        on(type: "change", cb: (args: {
            type: string;
            target: Input;
            value: string;
        }) => void): any;
    }
}
declare module "index" {
    /**
     * forces 'ol3-popup' namespace
     */
    import Input = require("ol3-input/ol3-input");
    export = Input;
}
declare module "ol3-input/examples/index" {
    export function run(): void;
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/base" {
    /**
     * implemented by all style serializers
     */
    export interface IConverter<T> {
        fromJson: (json: T) => ol.style.Style;
        toJson(style: ol.style.Style): T;
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer" {
    import ol = require("openlayers");
    import Serializer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/base");
    export namespace Format {
        type Color = number[] | string;
        type Size = number[];
        type Offset = number[];
        type LineDash = number[];
        interface Fill {
            color?: string;
        }
        interface Stroke {
            color?: string;
            width?: number;
            lineCap?: string;
            lineJoin?: string;
            lineDash?: LineDash;
            miterLimit?: number;
        }
        interface Style {
            fill?: Fill;
            image?: Image;
            stroke?: Stroke;
            text?: Text;
            zIndex?: number;
        }
        interface Image {
            opacity?: number;
            rotateWithView?: boolean;
            rotation?: number;
            scale?: number;
            snapToPixel?: boolean;
        }
        interface Circle {
            radius: number;
            stroke?: Stroke;
            fill?: Fill;
            snapToPixel?: boolean;
        }
        interface Star extends Image {
            angle?: number;
            fill?: Fill;
            points?: number;
            stroke?: Stroke;
            radius?: number;
            radius2?: number;
        }
        interface Icon extends Image {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: "fraction" | "pixels";
            anchorYUnits?: "fraction" | "pixels";
            color?: Color;
            crossOrigin?: string;
            src?: string;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            size?: Size;
        }
        interface Text {
            fill?: Fill;
            font?: string;
            offsetX?: number;
            offsetY?: number;
            rotation?: number;
            scale?: number;
            stroke?: Stroke;
            text?: string;
            textAlign?: string;
            textBaseline?: string;
        }
    }
    export namespace Format {
        interface Style {
            image?: Icon & Svg;
            icon?: Icon;
            svg?: Svg;
            star?: Star;
            circle?: Circle;
            text?: Text;
            fill?: Fill;
            stroke?: Stroke;
        }
        interface Icon {
            "anchor-x"?: number;
            "anchor-y"?: number;
        }
        interface Text {
            "offset-x"?: number;
            "offset-y"?: number;
        }
        interface Circle {
            opacity?: number;
        }
        interface Svg {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: string;
            anchorYUnits?: string;
            color?: Color;
            crossOrigin?: string;
            img?: string;
            imgSize?: Size;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            path?: string;
            stroke?: Stroke;
            fill?: Fill;
        }
    }
    export class StyleConverter implements Serializer.IConverter<Format.Style> {
        fromJson(json: Format.Style): ol.style.Style;
        toJson(style: ol.style.Style): Format.Style;
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        setGeometry(feature: ol.Feature): ol.geom.Geometry;
        private assign(obj, prop, value);
        private serializeStyle(style);
        private serializeColor(color);
        private serializeFill(fill);
        private deserializeStyle(json);
        private deserializeText(json);
        private deserializeCircle(json);
        private deserializeStar(json);
        private deserializeIcon(json);
        private deserializeSvg(json);
        private deserializeFill(json);
        private deserializeStroke(json);
        private deserializeColor(fill);
        private deserializeLinearGradient(json);
        private deserializeRadialGradient(json);
    }
}
declare module "ol3-input/providers/osm" {
    export module OpenStreet {
        interface Address {
            road: string;
            state: string;
            country: string;
        }
        interface Address {
            neighbourhood: string;
            postcode: string;
            city: string;
            town: string;
        }
        interface Address {
            peak: string;
            county: string;
            country_code: string;
            sports_centre: string;
        }
        interface ResponseItem {
            place_id: string;
            licence: string;
            osm_type: string;
            osm_id: string;
            boundingbox: string[];
            lat: string;
            lon: string;
            display_name: string;
            class: string;
            type: string;
            importance: number;
            icon: string;
            address: Address;
        }
        type Response = ResponseItem[];
    }
    export interface Result<T> {
        lon: number;
        lat: number;
        address: {
            name: string;
            road: string;
            postcode: string;
            city: string;
            state: string;
            country: string;
        };
        original: T;
    }
    export class OpenStreet {
        dataType: string;
        method: string;
        private settings;
        getParameters(options: {
            query: string;
            limit: number;
            countrycodes: string;
            lang: string;
        }): {
            url: string;
            params: {
                q: string;
                format: string;
                addressdetails: number;
                limit: number;
                countrycodes: string;
                'accept-language': string;
            };
        };
        handleResponse(args: OpenStreet.Response): Result<OpenStreet.ResponseItem>[];
    }
}
declare module "ol3-input/examples/ol3-input" {
    export function run(): void;
}
declare module "ol3-input/tests/index" {
    export function run(): void;
}
