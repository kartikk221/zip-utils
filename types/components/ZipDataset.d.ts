import * as zlib from 'zlib';
import * as stream from 'stream';
import { ZipCode } from './ZipCode';

interface ConstructorOptions {
    delimiter?: string
}

interface LoadOptions {
    readable: stream.ReadableOptions,
    decompression: boolean | zlib.ZlibOptions,
}

interface ExportOptions {
    compression: boolean | zlib.ZlibOptions,
}

export class ZipDataset {
    /**
     * Initializes a new zip codes dataset instance.
     *
     * @param {Object} options
     * @param {String} options.delimiter - The delimiter to use when parsing the dataset. Defaults to '\t'
     */
    constructor(options?: ConstructorOptions);

    /**
     * Adds/updates the given zip code to this dataset.
     * Note! This method will automatically compress various fields into symbolized indices for effiency.
     *
     * @param {String} zip
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {String=} country_code
     * @param {String=} city_name
     * @param {String=} state_name
     * @param {String=} state_code
     * @param {String=} county_name
     * @param {String=} county_code
     */
    add(
        zip: string,
        latitude?: number,
        longitude?: number,
        country_code?: string,
        city_name?: string,
        state_name?: string,
        state_code?: string,
        county_name?: string,
        county_code?: string
    ): void;

    /**
     * Reads the given stream to populate this dataset with zip codes.
     *
     * @param {stream.Readable} stream - The stream to read the dataset from
     * @returns {Promise<void>}
     */
    async stream(stream: stream.Readable): Promise<void>;

    /**
     * Loads the given file path to populate this dataset with zip codes.
     *
     * @param {String} path - The path to the dataset file to load
     * @param {Object} options
     * @param {stream.ReadableOptions=} options.readable - Options to pass to the fs.createReadStream() method
     * @param {(zlib.ZlibOptions|Boolean)=} options.decompression - Options to pass to the zlip decompression stream
     * @returns {Promise<void>}
     */
    load(path: string, options?: LoadOptions): Promise<void>;

    /**
     * Exports this dataset to the given file path.
     *
     * @param {String} path - The path to the dataset file to export
     * @param {Object} options
     * @param {(zlib.ZlibOptions|Boolean)=} options.compression - Options to pass to the zlip compression stream
     * @returns {Promise<void>}
     */
    export(path: string, options?: ExportOptions): Promise<void>;

        /* ZipDataset Getters */

    /**
     * The set of symbol arrays for this dataset.
     * @returns {Array<Array<String>>}
     */
     get symbols(): string[][];

    /**
     * The dictionary of zip codes for this dataset.
     * @returns {Map<String, ZipCode>}
     */
    get zip_codes(): Map<string, ZipCode>;
}