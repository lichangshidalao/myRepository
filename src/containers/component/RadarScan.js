import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addRadarScan } from "../CesiumViewer/addRadarScan";
//const viewer
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {
            buttonstatus: true
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        const radarScan1 = addRadarScan(viewer, {
            lon: 114.26,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(1.0, 0.1, 0.1, 1),//红，绿，蓝，透明度
            r: 400,//扫描半径
            interval: 4000//时间间隔
        });
        const radarScan2 = addRadarScan(viewer, {
            lon: 114.27,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(0.1, 1, 0.1, 1),//红，绿，蓝，透明度
            r: 400,//扫描半径
            interval: 4000//时间间隔
        });
        const radarScan3 = addRadarScan(viewer, {
            lon: 114.28,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(0.1, 0.1, 1, 1),//红，绿，蓝，透明度
            r: 400,//扫描半径
            interval: 4000//时间间隔
        });
        const camera = viewer.scene.camera;
        camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(114.27, 30.60, 3000),
            easingFunction: Cesium.EasingFunction.LINEAR_NONE
        });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map