export declare module OpenStreet {
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
export declare class OpenStreet {
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
