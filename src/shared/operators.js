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

/**
 * Returns the distance between the two given coordinates using the Haversine formula.
 *
 * @param {Number} lat1
 * @param {Number} lon1
 * @param {Number} lat2
 * @param {Number} lon2
 * @param {('K'|'M'|'N')} unit Kilometers, Miles, or Nautical Miles
 * @returns
 */
function haversine_distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    } else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = dist * 1.609344;
        }
        if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }
}

module.exports = {
    to_compressed_symbol,
    stream_each_line,
    haversine_distance,
};
