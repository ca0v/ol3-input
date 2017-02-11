declare module "ol3-input/ol3-input" {
    import ol = require("openlayers");
    export function cssin(name: string, css: string): () => void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export interface IOptions {
        className?: string;
        expanded?: boolean;
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
        dispose(): void;
        collapse(options: IOptions): void;
        expand(options: IOptions): void;
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
