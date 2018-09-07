export interface Address {
    road: string;
    state: string;
    country: string;
}
export interface Address {
    neighbourhood: string;
    postcode: string;
    city: string;
    town: string;
}
export interface Address {
    peak: string;
    county: string;
    country_code: string;
    sports_centre: string;
}
export interface ResponseItem {
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
export type Response = ResponseItem[];
