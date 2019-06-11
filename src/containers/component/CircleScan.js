import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { tileset3dtilesUrl } from "../../config/data.config";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { cameraPosition } from "../CesiumViewer/cameraPosition";
import { addCircleScan } from "../CesiumViewer/addCircleScan";
//const viewer
let viewer, tileset
class Map extends Component {
    constructor() {
        super()
        this.state = {
            buttonstatus: true
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        cameraPosition(viewer)
        addTdtMap(viewer, "TDT_VEC_W")
        tileset = add3dtiles(viewer, tileset3dtilesUrl.cityModel[3].url, false)
        tileset.style = new Cesium.Cesium3DTileStyle({
            color: 'vec4(0.5,0.5,0.5,1)'
        });
        const initialPosition = Cesium.Cartesian3.fromDegrees(114.27, 30.60, 1500);
        let headings = Cesium.Math.toRadians(0)
        let pitchs = Cesium.Math.toRadians(-30.0)
        const circleScan1 = addCircleScan(viewer, {
            lon: 114.27,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(0.5, 0.5, 0.5, 1),
            r: 1500,//扫描半径
            interval: 4000//时间间隔
        });
        const circleScan2 = addCircleScan(viewer, {
            lon: 114.27,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(0, 1, 0, 1),
            r: 1000,//扫描半径
            interval: 4000//时间间隔
        });
        const circleScan3 = addCircleScan(viewer, {
            lon: 114.27,//经度
            lat: 30.60, //纬度
            scanColor: new Cesium.Color(0, 0, 1, 1),
            r: 500,//扫描半径
            interval: 4000//时间间隔
        });
        const camera = viewer.scene.camera;
        camera.flyTo({
            destination: initialPosition,
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