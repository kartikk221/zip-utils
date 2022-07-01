/**
 * This example file goes over creating your own dataset.
 * Note! This code is not optimized as it should only be ran once to create your exported dataset file.
 */

const ZipUtils = require('../index.js');
const FileSystem = require('fs');

// File paths to load into the dataset
const FilesToLoad = ['./data/uncompressed/US'];
const PathToWrite = './data/US-EXPORTED';

// Initialize a new dataset instance
const StartTime = Date.now();
const Dataset = new ZipUtils.Dataset();

// Read the files to load into the dataset into memory
FilesToLoad.forEach((path) => {
    // Read the file's text content into memory
    const start_time = Date.now();
    const content = FileSystem.readFileSync(path, 'utf8');
    console.log(`Read ${path} in ${Date.now() - start_time}ms`);

    // Iterate through each line of the file
    let added = 0;
    content.split('\n').forEach((line) => {
        // Split the line into its components according to the format of our raw dataset
        const COLUMNS = line.split('\t');
        let [
            COUNTRY_CODE,
            ZIP_CODE,
            CITY_NAME,
            STATE_NAME,
            STATE_CODE,
            COUNTY_NAME,
            COUNTY_CODE,
            _,
            __,
            LATITUDE,
            LONGITUDE,
        ] = COLUMNS;

        // Do not proceed if the line is empty
        if (!ZIP_CODE) return;

        // Remove whitespaces from zip code
        ZIP_CODE = ZIP_CODE.replace(/\s/g, '');

        // Our dataset contains duplicate entries for some zip codes
        // We want to use the entry which has the most columns to represent the correct entry
        // You may not need to do this if you are using a dataset that doesn't have duplicate entries
        const current = Dataset.zip_codes.get(ZIP_CODE);
        if (current) {
            const num_columns = [
                current.zip,
                current.latitude,
                current.longitude,
                current.country_code,
                current.city_name,
                current.state_name,
                current.state_code,
                current.county_name,
                current.county_code,
            ].filter((v) => v).length;

            // Do not update the entry if it has more columns than the current entry
            if (num_columns > COLUMNS.length) return;
        }

        // Add the zip code to the dataset
        Dataset.add(
            ZIP_CODE,
            LATITUDE,
            LONGITUDE,
            COUNTRY_CODE,
            CITY_NAME,
            STATE_NAME,
            STATE_CODE,
            COUNTY_NAME,
            COUNTY_CODE
        );

        added++;
    });

    console.log(`Imported ${added} Zip Codes From ${path} in ${Date.now() - start_time}ms\n`);
});

console.log(`Processed ${FilesToLoad.length} files in ${Date.now() - StartTime}ms`);

Dataset.export(PathToWrite).then(() =>
    console.log(`Exported ${Dataset.zip_codes.size} Zip Codes To ${PathToWrite} In ${Date.now() - StartTime}ms`)
);
