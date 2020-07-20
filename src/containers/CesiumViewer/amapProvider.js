import * as Cesium from "cesium/Cesium";


const createAMapByUrl = (options) => {
    options = Cesium.defaultValue(options, {});

    let templateUrl = Cesium.defaultValue(options.url, 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}');

    let trailingSlashRegex = /\/$/;
    let defaultCredit = new Cesium.Credit('AMap');

    let tilingScheme = new Cesium.WebMercatorTilingScheme({ ellipsoid: options.ellipsoid });

    let tileWidth = 256;
    let tileHeight = 256;

    let minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
    let maximumLevel = Cesium.defaultValue(options.minimumLevel, 18);

    let rectangle = Cesium.defaultValue(options.rectangle, tilingScheme.rectangle);

    // Check the number of tiles at the minimum level.  If it's more than four,
    // throw an exception, because starting at the higher minimum
    // level will cause too many tiles to be downloaded and rendered.
    let swTile = tilingScheme.positionToTileXY(Cesium.Rectangle.southwest(rectangle), minimumLevel);
    let neTile = tilingScheme.positionToTileXY(Cesium.Rectangle.northeast(rectangle), minimumLevel);
    let tileCount = (Math.abs(neTile.x - swTile.x) + 1) * (Math.abs(neTile.y - swTile.y) + 1);
    //>>includeStart('debug', pragmas.debug);
    if (tileCount > 4) {
        throw new Cesium.DeveloperError('The rectangle and minimumLevel indicate that there are ' + tileCount + ' tiles at the minimum level. Imagery providers with more than four tiles at the minimum level are not supported.');
    }
    //>>includeEnd('debug');

    let credit = Cesium.defaultValue(options.credit, defaultCredit);
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit);
    }

    return new Cesium.UrlTemplateImageryProvider({
        url: templateUrl,
        proxy: options.proxy,
        credit: credit,
        tilingScheme: tilingScheme,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        minimumLevel: minimumLevel,
        maximumLevel: maximumLevel,
        rectangle: rectangle
    });
}

export { createAMapByUrl }
