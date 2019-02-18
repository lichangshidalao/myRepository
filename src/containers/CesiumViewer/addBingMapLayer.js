import Cesium from "cesium/Cesium";


const addBingMapLayer = (viewer, mapStyle = Cesium.BingMapsStyle.CANVAS_GRAY) => {
    const bing = new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: 'AgjKy3osU8lBgDgzRhiPXB5PrF5-MoJVo560u06NulrhXqyHQ92r83e7B2iZiEJ7',
        mapStyle: mapStyle
    });
    viewer.imageryLayers.addImageryProvider(bing)
}

export { addBingMapLayer }