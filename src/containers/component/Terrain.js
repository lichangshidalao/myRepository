import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { cameraPosition } from "../CesiumViewer/cameraPosition"
//const viewer
class TerrainMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        // Create the Cesium Viewer
        const viewer = viewerInit(this.refs.map)
        let mapStyle = Cesium.BingMapsStyle.AERIAL
        addBingMapLayer(viewer, mapStyle)
        viewer.terrainProvider = Cesium.createWorldTerrain()
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-122.17039148808765, 46.268964568975825, 3634.0751319), // 设置位置
            orientation: {
                heading: Cesium.Math.toRadians(191.33645721607235), // 方向
                pitch: Cesium.Math.toRadians(-0.2715277692998441),// 倾斜角度
                roll: 6.282501220859469
            }
        });
        cameraPosition(viewer)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default TerrainMap