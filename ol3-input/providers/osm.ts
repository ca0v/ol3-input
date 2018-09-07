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
    public dataType = "json";
    public method = "GET";

    private settings = {
        url: "//nominatim.openstreetmap.org/search/",
        params: {
            q: "",
            format: "json",
            addressdetails: 1,
            limit: 10,
            countrycodes: "",
            "accept-language": "en-US"
        }
    };

    getParameters(options: { query: string; limit: number; countrycodes: string; lang: string }) {
        return {
            url: this.settings.url,
            params: {
                q: options.query,
                format: "json",
                addressdetails: 1,
                limit: options.limit || this.settings.params.limit,
                countrycodes: options.countrycodes || this.settings.params.countrycodes,
                "accept-language": options.lang || this.settings.params["accept-language"]
            }
        };
    }

    handleResponse(args: Response) {
        return args.sort((v) => v.importance || 1).map(
            (result) =>
                <Result<typeof result>>{
                    original: result,
                    lon: parseFloat(result.lon),
                    lat: parseFloat(result.lat),
                    address: {
                        name: result.address.neighbourhood || "",
                        road: result.address.road || "",
                        postcode: result.address.postcode,
                        city: result.address.city || result.address.town,
                        state: result.address.state,
                        country: result.address.country
                    }
                }
        );
    }
}
