# ZipDataset
Below is a breakdown of the `ZipDataset` component which is used to load and work with large amounts of Zip Codes in memory.

#### ZipDataset Properties
| Property  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `symbols` | `String[][]`  | Set of symbol arrays for loaded zip code values. |
| `zip_codes` | `Map<String, ZipCode>`  | All loaded zip codes in the dataset. |

#### ZipDataset Methods
* `add(...9 Parameters)`: Manually adds / updates the zip code with the provided values.
    * **Parameters** must be specified in the order below.
        * `zip` [`String`]: The zip code value and identifier.
        * `latitude` [`Number`]: The latitude of this zip code. (**Optional**)
        * `longitude` [`Number`]: The longitude of this zip code. (**Optional**)
        * `country_code` [`String`]: The country code of this zip code. (**Optional**)
        * `city_name` [`String`]: The city name of this zip code. (**Optional**)
        * `state_name` [`String`]: The state name of this zip code. (**Optional**)
        * `state_code` [`String`]: The state code of this zip code. (**Optional**)
        * `county_name` [`String`]: The county name of this zip code. (**Optional**)
        * `county_code` [`String`]: The county code of this zip code. (**Optional**)
* `stream(stream: ReadableStream)`: Reads the given stream to populate this dataset with zip codes.
    * **Returns** a `Promise` which is resolved to `void`.
* `load(path: string, options?: Object)`: Loads the given file to populate this dataset with zip codes.
    * **Returns** a `Promise` which is resolved to `void`.
    * `options` [`Object`]
        * `readable` [`ReadableOptions`]: Constructor options to pass to the `fs.createReadStream()` method.
        * `decompression` [`ZlibOptions`]: Constructor options to pass to the `zlib` decompression stream.
* `export(path: string, options?: Object)`: Exports this dataset to the given file path.
    * **Returns** a `Promise` which is resolved to `void`.
    * `options` [`Object`]
        * `compression` [`ZlibOptions`]: Constructor options to pass to the `zlib` compression stream.
* See [`> [FileSystem]`](https://nodejs.org/api/fs.html) and [`> [Zlib]`](https://nodejs.org/api/zlib.html) for more documentation streaming options.