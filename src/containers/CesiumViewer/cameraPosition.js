import Cesium from "cesium/Cesium";
//获取相机位置
const cameraPosition = (viewer) => {
    let cameraLongitude = 0,
        cameraLatitude = 0,
        cameraHeight = 0,
        cameraHeading = 0;
    //添加相机位置改变事件
    let camera = viewer.scene.camera;
    camera.percentageChanged = 0.1;
    let cameraArray = []
    camera.changed.addEventListener(function () {
        cameraArray = []
        cameraHeading = Cesium.Math.toDegrees(camera.heading) + "°";
        var p = Cesium.Cartographic.fromCartesian(camera.position);
        cameraLongitude = Cesium.Math.toDegrees(p.longitude) + "°";;
        cameraLatitude = Cesium.Math.toDegrees(p.latitude) + "°";;
        cameraHeight = p.height + "米";
        cameraArray.push(cameraLongitude)
        cameraArray.push(cameraLatitude)
        cameraArray.push(cameraHeight)
        cameraArray.push(cameraHeading)
        cameraArray.push(camera.pitch)
        cameraArray.push(camera.roll)
    });
    let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    let pickArray = []
    pickhandle.setInputAction((momvent) => {
        let cartesian = viewer.scene.pickPosition(momvent.position)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height
        pickArray.push(longitudeString)
        pickArray.push(latitudeString)
        pickArray.push(height)
        console.log(pickArray)
        console.log(cameraArray)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

export { cameraPosition }