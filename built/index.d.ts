/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function cssin(name: string, css: string): () => void;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
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
