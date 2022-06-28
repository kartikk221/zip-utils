const FileSystem = require('fs');

// Each Line: ZIP,LONGITUDE,LATITUDE
const DATASET = {
    loaded: false,
    path: '../data/',
    content: {},
};

/**
 * Returns whether the dataset is loaded or not.
 * @returns {Boolean}
 */
function is_dataset_loaded() {
    return DATASET.loaded;
}

let load_promise = null;

/**
 * Loads the dataset into memory.
 * @returns {Promise}
 */
function load_dataset() {
    // Instantly resolve if dataset is already loaded
    if (is_dataset_loaded()) return Promise.resolve();

    // Return the promise if it's already loading
    if (load_promise) return load_promise;

    // Create a new promise
    load_promise = new Promise((resolve_dataset, reject_dataset) => {
        // Retrieve all files in the dataset folder
        FileSystem.readdir(
            DATASET.path,
            {
                withFileTypes: true,
            },
            (directory_error, files) => {
                // Reject if there was an error reading the directory
                if (directory_error) return reject_dataset(directory_error);

                // Load each file into memory with mapped promises
                const file_promises = files
                    .filter((file) => file.isFile())
                    .map(
                        (file) =>
                            new Promise((resolve_file, reject_file) => {
                                // Read the file content
                                FileSystem.readFile(DATASET.path + file.name, 'utf8', (file_error, file_content) => {
                                    // Reject if there was an error reading the file
                                    if (file_error) return reject_file(file_error);

                                    // Split the file content into lines
                                    file_content.split('\n').forEach((line) => {
                                        // Split the line into fields zip,longitude,latitude
                                        const [ZIP, LONGITUDE, LATITUDE] = line.split(',');

                                        // Write each zip code to the dataset
                                        DATASET.content[ZIP] = [LONGITUDE, LATITUDE];
                                    });

                                    // Resolve the file as all content is loaded
                                    resolve_file();
                                });
                            })
                    );

                // Resolve the dataset promise once all file promises are resolved
                Promise.all(file_promises).then(resolve_dataset);
            }
        );
    });

    // Nullify the promise once it's finished
    load_promise.finally(() => (load_promise = null));

    // Return the promise
    return load_promise;
}

function get_dataset() {
    return DATASET.content;
}

load_dataset()
    .then(() => console.log(get_dataset()))
    .catch(console.error);
