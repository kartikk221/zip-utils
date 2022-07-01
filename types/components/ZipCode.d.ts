export class ZipCode {
    /**
     * The specific array of symbols associated with this zip code.
     * @returns {Array<String>}
     */
    get symbols(): string[];

    /**
     * Returns the zip code.
     * @returns {String}
     */
    get zip(): string;

    /**
     * Returns the estimated latitude coordinate for this zip code.
     * @returns {Number}
     */
     get latitude(): number;

    /**
     * Returns the estimated longitude coordinate for this zip code.
     * @returns {Number}
     */
    get longitude(): number;

    /**
     * Returns the country code for this zip code.
     * @returns {String}
     */
    get country_code(): string;

    /**
     * Returns the city name for this zip code.
     * @returns {String}
     */
    get city_name(): string;

    /**
     * Returns the state name for this zip code.
     * @returns {String}
     */
    get state_name(): string;

    /**
     * Returns the state code for this zip code.
     * @returns {String}
     */
    get state_code(): string;

    /**
     * Returns the county name for this zip code.
     * @returns {String}
     */
    get county_name(): string;

    /**
     * Returns the county code for this zip code.
     * @returns {String}
     */
    get county_code(): string;
}