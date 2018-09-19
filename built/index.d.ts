/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList | HTMLCollectionOf<Element>): T[];
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/css" {
    export function cssin(name: string, css: string): () => void;
    export function loadCss(options: {
        name: string;
        url?: string;
        css?: string;
    }): () => void;
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(value: {
        lon: number;
        lat: number;
    }): string;
    export function parse(value: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/ol3-fun/slowloop" {
    export function slowloop(functions: Array<Function>, interval?: number, cycles?: number): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/is-primitive" {
    export function isPrimitive(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/is-cyclic" {
    export function isCyclic(a: any): boolean;
}
declare module "node_modules/ol3-fun/ol3-fun/deep-extend" {
    export interface TraceItem {
        path?: Path;
        target: Object;
        key: string | number;
        value: any;
        was: any;
    }
    type History = Array<object>;
    type Path = Array<any>;
    export function extend<A extends object>(a: A, b?: Partial<A>, trace?: Array<TraceItem>, history?: History): A;
}
declare module "node_modules/ol3-fun/ol3-fun/extensions" {
    export class Extensions {
        private hash;
        isExtended(o: any): boolean;
        extend<T extends object, U extends any>(o: T, ext?: U): U;
        bind(o1: any, o2: any): void;
    }
}
declare module "node_modules/ol3-fun/index" {
    import { asArray, debounce, defaults, doif, getParameterByName, getQueryParameters, html, mixin, pair, parse, range, shuffle, toggle, uuid } from "node_modules/ol3-fun/ol3-fun/common";
    import { cssin, loadCss } from "node_modules/ol3-fun/ol3-fun/css";
    import { zoomToFeature } from "node_modules/ol3-fun/ol3-fun/navigation";
    import { parse as dmsParse } from "node_modules/ol3-fun/ol3-fun/parse-dms";
    import { slowloop } from "node_modules/ol3-fun/ol3-fun/slowloop";
    import { extend as deepExtend } from "node_modules/ol3-fun/ol3-fun/deep-extend";
    import { Extensions } from "node_modules/ol3-fun/ol3-fun/extensions";
    let index: {
        asArray: typeof asArray;
        cssin: typeof cssin;
        loadCss: typeof loadCss;
        debounce: typeof debounce;
        defaults: typeof defaults;
        doif: typeof doif;
        deepExtend: typeof deepExtend;
        getParameterByName: typeof getParameterByName;
        getQueryParameters: typeof getQueryParameters;
        html: typeof html;
        mixin: typeof mixin;
        pair: typeof pair;
        parse: typeof parse;
        range: typeof range;
        shuffle: typeof shuffle;
        toggle: typeof toggle;
        uuid: typeof uuid;
        slowloop: typeof slowloop;
        dms: {
            parse: typeof dmsParse;
            fromDms: (dms: string) => {
                lon: number;
                lat: number;
            };
            fromLonLat: (o: {
                lon: number;
                lat: number;
            }) => string;
        };
        navigation: {
            zoomToFeature: typeof zoomToFeature;
        };
        Extensions: typeof Extensions;
    };
    export = index;
}
declare module "ol3-input/providers/osm" {
    import { Response } from "./@types/osm";
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
                "accept-language": string;
            };
        };
        handleResponse(args: Response): Result<import("../ol3-input/providers/@types/osm").ResponseItem>[];
    }
}
declare module "ol3-input/ol3-input" {
    import ol = require("openlayers");
    import { olx } from "openlayers";
    import { OpenStreet } from "ol3-input/providers/osm";
    export interface InputOptions extends olx.control.ControlOptions {
        map?: ol.Map;
        className?: string;
        position?: string;
        expanded?: boolean;
        hideButton?: boolean;
        autoChange?: boolean;
        autoClear?: boolean;
        autoCollapse?: boolean;
        autoSelect?: boolean;
        canCollapse?: boolean;
        changeDelay?: number;
        closedText?: string;
        openedText?: string;
        target?: HTMLElement;
        regex?: RegExp;
        placeholderText?: string;
        provider?: typeof OpenStreet;
        source?: ol.source.Vector;
    }
    export class Input extends ol.control.Control {
        static DEFAULT_OPTIONS: InputOptions;
        static create(options?: InputOptions): Input;
        button: HTMLButtonElement;
        input: HTMLInputElement;
        options: InputOptions;
        handlers: Array<() => void>;
        private constructor();
        destroy(): void;
        getValue(): string;
        setValue(v: string): void;
        setPosition(position: string): void;
        cssin(): void;
        collapse(options: InputOptions): void;
        expand(options: InputOptions): void;
        on(type: string, cb: Function): (ol.EventsKey | ol.EventsKey[]);
        on(type: "change", cb: (args: {
            type: string;
            target: Input;
            value: string;
        }) => void): (ol.EventsKey | ol.EventsKey[]);
    }
}
declare module "index" {
    import { Input, InputOptions } from "ol3-input/ol3-input";
    import { OpenStreet as OsmSearchProvider, Result as OsmSearchResult } from "ol3-input/providers/osm";
    export { Input, InputOptions, OsmSearchProvider, OsmSearchResult };
}
