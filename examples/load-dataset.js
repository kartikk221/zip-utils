/**
 * This example file goes over loading a previously exported dataset from ZipUtils.
 */

const ZipUtils = require('../index.js');

// File paths to load into the dataset
const FilesToLoad = ['./data/US-EXPORTED'];

(async () => {
    // Initialize a new dataset instance
    const StartTime = Date.now();
    const Dataset = new ZipUtils.Dataset();

    // Load the files into the dataset
    for (let i = 0; i < FilesToLoad.length; i++) {
        await Dataset.load(FilesToLoad[i]);
        console.log(`Loaded ${FilesToLoad[i]} in ${Date.now() - StartTime}ms`);
    }

    console.log(`Loaded ${Dataset.zip_codes.size} Zip Codes In ${Date.now() - StartTime}ms`);
})();
