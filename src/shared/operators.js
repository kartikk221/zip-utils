const stream = require('stream'); // lgtm [js/unused-local-variable]
const readline = require('readline');

/**
 * Returns the compressed symbol index for the given string.
 * Tracks the symbols through the provided array and translations map.
 *
 * @param {Array<String>} array - The array to track the symbols through
 * @param {Map<String, Number>} translations - The map to track the symbol translations through
 * @param {String} string - The string to compress into a symbol
 * @returns {Number} The compressed symbol index
 */
function to_compressed_symbol(array, translations, string) {
    // Check if a translation symbol exists for the given string
    if (translations.has(string)) return translations.get(string);

    // Store the new symbol index for this string
    translations.set(string, array.length);

    // Add the string to the symbol set
    array.push(string);

    // Return the new symbol index
    return translations.get(string);
}

/**
 * Streams each line from the given stream to the given callback.
 *
 * @param {stream.Readable} stream
 * @param {function(string):void} callback
 * @returns {Promise}
 */
function stream_each_line(stream, callback) {
    // Create a new readline instance
    const interface = readline.createInterface({
        input: stream,
    });

    // Pipe the readline events to the callback
    interface.on('line', callback);

    // Return a promise that resolves once interface closes
    return new Promise((resolve) => interface.on('close', resolve));
}

module.exports = {
    to_compressed_symbol,
    stream_each_line,
};
