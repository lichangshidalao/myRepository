import * as Cesium from "cesium/Cesium";
const getLonLat = (cartesian) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height
    return [longitudeString, latitudeString, height]
}

const GetDistance = (lat1, lng1, lat2, lng2) => {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}
//path =[{lat:,lng:}],[{lat:,lng:}],[{lat:,lng:}]
const computeSignedArea = (path) => {
    let radius = 6371009
    let len = path.length;
    if (len < 3) return 0;
    let total = 0;
    let prev = path[len - 1];
    let prevTanLat = Math.tan(((Math.PI / 2 - prev.lat / 180 * Math.PI) / 2));
    let prevLng = (prev.lng) / 180 * Math.PI;
    for (let i in path) {
        let tanLat = Math.tan((Math.PI / 2 -
            (path[i].lat) / 180 * Math.PI) / 2);
        let lng = (path[i].lng) / 180 * Math.PI;
        total += polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
        prevTanLat = tanLat;
        prevLng = lng;
    }
    return Math.abs(total * (radius * radius));
}
function polarTriangleArea(tan1, lng1, tan2, lng2) {
    let deltaLng = lng1 - lng2;
    let t = tan1 * tan2;
    return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
}

export { getLonLat, GetDistance, computeSignedArea }