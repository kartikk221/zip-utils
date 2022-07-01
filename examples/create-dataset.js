/**
 * This example file goes over creating your own dataset.
 * Note! This example uses the US zip codes dataset from http://download.geonames.org/export/zip/. You may compile any datatset you want into a ZipUtils exported dataset.
 * Note! This code is not optimized for production runs as it should only be ran once to create your exported/compressed dataset file from ZipUtils.
 */

const FileSystem = require('fs');
const ZipUtils = require('../index.js');

// File paths to load into the dataset
const FilesToLoad = ['./data/uncompressed/US'];
const PathToWrite = './data/US-EXPORTED';

// Initialize a new dataset instance
const StartTime = Date.now();
const Dataset = new ZipUtils.Dataset();

FilesToLoad.forEach((path) => {
    // Read the raw dataset file into memory so we can parse the zipcodes
    const start_time = Date.now();
    const content = FileSystem.readFileSync(path, 'utf8');
    console.log(`Read ${path} in ${Date.now() - start_time}ms`);

    // The example dataset stores each zip code on newlines with each component separated by tab spaces
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

        // Do not proceed if the line is empty as our raw dataset has some empty lines
        if (!ZIP_CODE) return;

        // Remove whitespaces from zip code
        // This is not neccessary for the example US dataset as all zip codes are numbers without no whitespaces. Example: 10001
        // But in some countries like Canada, the zip code may have a space between the first and second digits. Example: M5A 1A1
        // Hence removing the whitespaces will ensure "M5A 1A1" will be converted to "M5A11A1" and enforce a consistent format
        ZIP_CODE = ZIP_CODE.replace(/\s/g, '');

        // Our dataset contains duplicate entries for some zip codes with differing accuracy/values
        // We want to use the entry which has the most columns as it is likely the most accurate
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

        // Add this zip code to our ZipUtils dataset
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

        // Increment the number of added zip codes
        added++;
    });

    // Log the number of entries added to the dataset
    console.log(`Imported ${added} Zip Codes From ${path} in ${Date.now() - start_time}ms\n`);
});

// Export the dataset to a file for faster loading time in our applications
// This file will be compressed and memory efficient when loaded in our applications
console.log(`Processed ${FilesToLoad.length} files in ${Date.now() - StartTime}ms`);
Dataset.export(PathToWrite).then(() =>
    console.log(`Exported ${Dataset.zip_codes.size} Zip Codes To ${PathToWrite} In ${Date.now() - StartTime}ms`)
);
