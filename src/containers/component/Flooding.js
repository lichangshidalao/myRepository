import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { addTdtMap } from "../CesiumViewer/addTdtMap";
//const viewer
class TerrainMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        // Create the Cesium Viewer
        const viewer = viewerInit(this.refs.map)
        let startTime = Cesium.JulianDate.now();
        viewer.clock.startTime = startTime
        viewer.clock.shouldAnimate = true
        let mapStyle = Cesium.BingMapsStyle.AERIAL
        addTdtMap(viewer, "TDT_IMG_W")
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
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        viewer.terrainProvider = Cesium.createWorldTerrain()
        //cameraPosition(viewer)
        let postionArray = [
            106.27366743416906, 29.7408655868975, 0,
            107.13185094511114, 29.739476133945672, 0,
            107.16407614626132, 29.373802419410154, 0,
            106.2864953449763, 29.360395582986783, 0
        ]
        let isConstant = false
        let entity = viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(postionArray),
                extrudedHeight: new Cesium.CallbackProperty((time, result) => {
                    let number = 200 + Cesium.JulianDate.secondsDifference(time, startTime)*10;
                    console.log(number)
                    if (number > 500) {
                        isConstant = true
                    }
                    return number > 500 ? 500 : number
                }, isConstant),
                perPositionHeight: true,
                //material: river,
                material: new Cesium.Color(0, 69 / 256, 107 / 256, 0.8),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
            }
        })
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(106.61555630933752, 29.57325490506234, 28000), // 设置位置
            orientation: {
                heading: Cesium.Math.toRadians(191.33645721607235), // 方向
                // pitch: Cesium.Math.toRadians(-0.2715277692998441),// 倾斜角度
                // roll: 6.282501220859469
            }
        });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default TerrainMap