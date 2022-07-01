/**
 * This example file goes over loading an exported dataset from ZipUtils.
 */

const ZipUtils = require('../index.js');

// File paths to load into the dataset
const FilesToLoad = ['./data/US-EXPORTED'];

(async () => {
    // Initialize a new dataset instance
    const StartTime = Date.now();
    const Dataset = new ZipUtils.Dataset();

    for (let i = 0; i < FilesToLoad.length; i++) {
        // Simply provide the path of the dataset file to load
        // Note! This operation occurs through file streaming and is non-blocking / optimized for large datasets.
        // Note! For large datasets, this operation may take a while to complete as a lot of data has to be gradually processed.
        // You may still periodocially check the Dataset.zip_codes to see If your specific zip code has been loaded as this method actively populates the dataset.
        await Dataset.load(FilesToLoad[i]);
        console.log(`Loaded ${FilesToLoad[i]} in ${Date.now() - StartTime}ms`);
    }

    // Log how many total zip codes were loaded
    console.log(`Loaded ${Dataset.zip_codes.size} Zip Codes In ${Date.now() - StartTime}ms`);
})();
