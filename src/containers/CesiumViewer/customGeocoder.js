import * as Cesium from "cesium/Cesium";
function OpenStreetMapNominatimGeocoder() {
}
OpenStreetMapNominatimGeocoder.prototype.geocode = function (input) {
    var endpoint = 'https://nominatim.openstreetmap.org/search';
    var resource = new Cesium.Resource({
        url: endpoint,
        queryParameters: {
            format: 'json',
            q: input
        }
    });

    return resource.fetchJson()
        .then(function (results) {
            var bboxDegrees;
            return results.map(function (resultObject) {
                bboxDegrees = resultObject.boundingbox;
                return {
                    displayName: resultObject.display_name,
                    destination: Cesium.Rectangle.fromDegrees(
                        bboxDegrees[2],
                        bboxDegrees[0],
                        bboxDegrees[3],
                        bboxDegrees[1]
                    )
                };
            });
        });
};
export {OpenStreetMapNominatimGeocoder}