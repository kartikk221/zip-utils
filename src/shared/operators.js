const stream = require('stream'); // lgtm [js/unused-local-variable]
const EventStream = require('event-stream');

/**
 * Returns the compressed symbol index for the given string.
 * Tracks the symbols through the provided array and translations map.
 *
 * @param {Array<String>} array
 * @param {Map<String, Number>} translations
 * @param {String} string
 * @returns {Number}
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
    // Pipe the readable stream to a splitable stream which splits by line
    const splitable = stream.pipe(EventStream.split());

    // Pipe the splitable stream to a synchornous map stream
    splitable.pipe(EventStream.mapSync(callback));

    // Return a promise which resolves when the stream is finished
    return new Promise((resolve) => splitable.once('end', resolve));
}

module.exports = {
    to_compressed_symbol,
    stream_each_line,
};
