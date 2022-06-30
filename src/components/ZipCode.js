class ZipCode {
    #zip;
    #latitude;
    #longitude;
    #country_code;
    #city_name;
    #state_name;
    #state_code;
    #county_name;
    #county_code;

    /**
     * Initializes a new zip code instance with the provided components.
     * Note! You
     *
     * @param {String} zip
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {(String|Number)=} country_code
     * @param {(String|Number)=} city_name
     * @param {(String|Number)=} state_name
     * @param {(String|Number)=} state_code
     * @param {(String|Number)=} county_name
     * @param {(String|Number)=} county_code
     */
    constructor(
        zip,
        latitude,
        longitude,
        country_code = '',
        city_name = '',
        state_name = '',
        state_code = '',
        county_name = '',
        county_code = ''
    ) {
        this.#zip = zip;
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#country_code = country_code;
        this.#city_name = city_name;
        this.#state_name = state_name;
        this.#state_code = state_code;
        this.#county_name = county_name;
        this.#county_code = county_code;
    }

    #symbols;
    /**
     * Provides a symbols array to be used for resolving index values.
     *
     * @private
     * @param {Array<String>} symbols - The symbol set to use for resolving index values
     */
    _use_symbols(symbols) {
        this.#symbols = symbols;
    }

    /**
     * Converts the provided symbol index to the corresponding value.
     * NO-OP when provided a string.
     *
     * @private
     * @param {String|Number} original
     * @returns {String}
     */
    _to_value(original) {
        // If the original is a string, return it as-is.
        if (typeof original === 'string') return original;

        // If the original is a number, return the corresponding symbol.
        return this.#symbols[original];
    }

    /**
     * The specific array of symbols associated with this zip code.
     * @returns {Array<String>}
     */
    get symbols() {
        return this.#symbols;
    }

    /**
     * Returns the zip code.
     * @returns {String}
     */
    get zip() {
        return this.#zip;
    }

    /**
     * Returns the estimated latitude coordinate for this zip code.
     * @returns {Number}
     */
    get latitude() {
        return this.#latitude;
    }

    /**
     * Returns the estimated longitude coordinate for this zip code.
     * @returns {Number}
     */
    get longitude() {
        return this.#longitude;
    }

    /**
     * Returns the country code for this zip code.
     * @returns {String}
     */
    get country_code() {
        return this._to_value(this.#country_code);
    }

    /**
     * Returns the city name for this zip code.
     * @returns {String}
     */
    get city_name() {
        return this._to_value(this.#city_name);
    }

    /**
     * Returns the state name for this zip code.
     * @returns {String}
     */
    get state_name() {
        return this._to_value(this.#state_name);
    }

    /**
     * Returns the state code for this zip code.
     * @returns {String}
     */
    get state_code() {
        return this._to_value(this.#state_code);
    }

    /**
     * Returns the county name for this zip code.
     * @returns {String}
     */
    get county_name() {
        return this._to_value(this.#county_name);
    }

    /**
     * Returns the county code for this zip code.
     * @returns {String}
     */
    get county_code() {
        return this._to_value(this.#county_code);
    }
}

module.exports = ZipCode;
