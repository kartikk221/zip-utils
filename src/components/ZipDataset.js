const fs = require('fs');
const zlib = require('zlib');
const stream = require('stream'); // lgtm [js/unused-local-variable]

const ZipCode = require('./ZipCode.js');
const { to_compressed_symbol, stream_each_line } = require('../shared/operators.js');

class ZipDataset {
    #symbols = [];
    #zip_codes;
    #delimiter = '\t';

    /**
     * Initializes a new zip codes dataset instance.
     *
     * @param {Object} options
     * @param {String} options.delimiter - The delimiter to use when parsing the dataset. Defaults to '\t'
     */
    constructor(options) {
        // Destructure the provided options
        const { delimiter } = options || {};

        // Set the delimiter if provided
        if (typeof delimiter == 'string') this.#delimiter = delimiter;

        // Initialize the zip codes map
        this.#zip_codes = new Map();
    }

    /**
     * Adds/updates the given zip code to this dataset.
     * Note! This method will automatically compress various fields into symbolized indices for effiency.
     *
     * @param {String} zip
     * @param {Number=} latitude
     * @param {Number=} longitude
     * @param {String=} country_code
     * @param {String=} city_name
     * @param {String=} state_name
     * @param {String=} state_code
     * @param {String=} county_name
     * @param {String=} county_code
     */
    add(
        zip,
        latitude = 0,
        longitude = 0,
        country_code = '',
        city_name = '',
        state_name = '',
        state_code = '',
        county_name = '',
        county_code = ''
    ) {
        // Throw an error if zip code is not a string
        if (!zip || typeof zip !== 'string') throw new Error('ZipDataset.add(zip, ...) -> zip must be a valid string');

        // Create a new zip code instance which stores raw string values
        const instance = new ZipCode(
            zip,
            latitude,
            longitude,
            country_code,
            city_name,
            state_name,
            state_code,
            county_name,
            county_code
        );

        // Add the zip code to the dataset map
        this.#zip_codes.set(zip, instance);
    }

    /**
     * Reads the given stream to populate this dataset with zip codes.
     *
     * @param {stream.Readable} stream - The stream to read the dataset from
     * @returns {Promise<void>}
     */
    async stream(stream) {
        let offset;
        let cursor = 0;
        let scope = this;
        await stream_each_line(stream, (line) => {
            // Split the line into components with the delimiter
            const components = line.split(scope.#delimiter);

            // The first line is always the list of symbols
            if (cursor === 0) {
                // Store the symbol set offset as the length of the symbols container
                offset = scope.#symbols.length;

                // Add the symbols to the symbols container
                scope.#symbols.push(components);
            } else {
                // Parse the components into a zip code
                const instance = new ZipCode(
                    components[0],
                    +components[1],
                    +components[2],
                    +components[3],
                    +components[4],
                    +components[5],
                    +components[6],
                    +components[7],
                    +components[8]
                );

                // Provide the symbol set to use for resolving index values for this zip code
                instance._use_symbols(scope.#symbols[offset]);

                // Add the zip code to the dataset map
                scope.#zip_codes.set(instance.zip, instance);
            }

            // Increment the cursor
            cursor++;
        });
    }

    /**
     * Loads the given file path to populate this dataset with zip codes.
     *
     * @param {String} path - The path to the dataset file to load
     * @param {Object} options
     * @param {stream.ReadableOptions=} options.readable - Options to pass to the fs.createReadStream() method
     * @param {(zlib.ZlibOptions|Boolean)=} options.decompression - Options to pass to the zlip decompression stream
     * @returns {Promise<void>}
     */
    load(path, options = {}) {
        const scope = this;
        return new Promise((resolve) => {
            // Destructure the options
            const { readable, decompression } = options;

            // Initialize the readable stream to read the file
            let reader = fs.createReadStream(path, readable);

            // Initialize and pipe the readable into a zlib decompression stream
            if (decompression !== false)
                reader = reader.pipe(zlib.createInflate(typeof decompression == 'object' ? decompression : undefined));

            // Load the dataset from the stream
            scope.stream(reader).then(resolve);
        });
    }

    /**
     * Exports this dataset to the given file path.
     *
     * @param {String} path - The path to the dataset file to export
     * @param {Object} options
     * @param {(zlib.ZlibOptions|Boolean)=} options.compression - Options to pass to the zlip compression stream
     * @returns {Promise<void>}
     */
    export(path, options = {}) {
        const scope = this;
        return new Promise((resolve) => {
            // Initialize the symbols map and lines array to hold output dataset structure
            let lines = [
                [''], // This will hold the symbols - the first empty line represents undefined values
            ];

            // Helper function to convert a string to a compressed symbol index
            const translations = new Map();
            const symbolize = (string) => to_compressed_symbol(lines[0], translations, string);

            // Iterate through all the zip codes in the dataset
            for (const [zip, instance] of scope.#zip_codes) {
                // Destructure the zip code instance
                const {
                    latitude,
                    longitude,
                    country_code,
                    city_name,
                    state_name,
                    state_code,
                    county_name,
                    county_code,
                } = instance;

                // Add the compiled/delimited zip code to the lines array
                lines.push(
                    [
                        zip,
                        latitude,
                        longitude,
                        symbolize(country_code),
                        symbolize(city_name),
                        symbolize(state_name),
                        symbolize(state_code),
                        symbolize(county_name),
                        symbolize(county_code),
                    ].join(scope.#delimiter)
                );
            }

            // Compile the symbols into a single line separated by the delimiter
            lines[0] = lines[0].join(scope.#delimiter);

            // Initialize a readable stream to write the dataset to the file
            let cursor = 0;
            let readable = new stream.Readable({
                read() {
                    // Check if there are more lines to read
                    if (cursor < lines.length) {
                        this.push(lines[cursor] + (cursor < lines.length - 1 ? '\n' : ''));
                        cursor++;
                    } else {
                        this.push(null);
                    }
                },
            });

            // Initialize and pipe the readable into a zlib compression stream
            if (options.compression !== false)
                readable = readable.pipe(
                    zlib.createDeflate(typeof options.compression == 'object' ? options.compression : undefined)
                );

            // Initialize a writable stream to write the dataset to the file
            const writable = fs.createWriteStream(path);

            // Pipe the readable into the writable
            readable.pipe(writable);

            // When the writable stream is finished, resolve the promise
            writable.once('finish', resolve);
        });
    }

    /* ZipDataset Getters */

    /**
     * The set of symbol arrays for this dataset.
     * @returns {Array<Array<String>>}
     */
    get symbols() {
        return this.#symbols;
    }

    /**
     * The dictionary of zip codes for this dataset.
     * @returns {Map<String, ZipCode>}
     */
    get zip_codes() {
        return this.#zip_codes;
    }
}

module.exports = ZipDataset;
