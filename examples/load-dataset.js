/**
 * This example file goes over creating your own dataset.
 * Note! This code is not optimized as it should only be ran once to create your exported dataset file.
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

    console.log(`Loaded ${FilesToLoad.length} files in ${Date.now() - StartTime}ms`);

    console.log(Dataset.zip_codes.size);
    console.log(Dataset.zip_codes.get('10307').city_name);
    console.log(Dataset.zip_codes.get('10312').state_name);
})();
