import Cesium from "cesium/Cesium";
import { OpenStreetMapNominatimGeocoder } from "../CesiumViewer/customGeocoder"
import { addTdtMap } from "../CesiumViewer/addTdtMap"
const viewerInit = (cesiumContain) => {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNTVjZjRlZS1mYTY2LTQyZTAtOWY1Ny1mOWM5MjY0ODE5ZWQiLCJpZCI6NTgzOSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NDQyNjczNn0.KPT4FCM796s36bHKerYvZghrRm-w44uoYYZOOw1y8eY"
    //Cesium.Ion.defaultAccessToken = ion_Token
    // Create the Cesium Viewer
    const viewer = new Cesium.Viewer(cesiumContain, {
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: true,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: true,
        navigationInstructionsInitiallyVisible: false,
        automaticallyTrackDataSourceClocks: false,
        fullscreenButton: false,
        geocoder: new OpenStreetMapNominatimGeocoder()
    });
    //去除cesium logo 水印
    viewer.cesiumWidget.creditContainer.style.display = 'none'
    //bug
    viewer.scene.debugShowFramesPerSecond = true
    //深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true
    //变焦时摄像机位置的最小幅度（以米为单位）
    //viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10
    viewer.scene.screenSpaceCameraController.inertiaTranslate = 0 //相机惯性
    //3dtiles 调试
    //viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
    addTdtMap(viewer)
    return viewer
}

export default viewerInit