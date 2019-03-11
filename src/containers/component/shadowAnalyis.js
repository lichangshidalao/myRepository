import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { tileset3dtilesUrl } from "../../config/data.config";
import { getLonLat } from "../CesiumViewer/getLonLat";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { cameraPosition } from "../CesiumViewer/cameraPosition";
import { Button } from 'antd';
//const viewer
let viewer, tileset
const initialPosition = Cesium.Cartesian3.fromDegrees(114.27, 30.60, 1500);
let headings = Cesium.Math.toRadians(0)
let pitchs = Cesium.Math.toRadians(-30.0)
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
        //tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
        //阴影
        viewer.shadows = true
        let shadowMap = viewer.shadowMap;
        shadowMap.maxmimumDistance = 3000.0;
        viewer.clock.startTime = new Cesium.JulianDate(2458547, 52202.13500037328);
        viewer.clock.multiplier = 6000.0;
        //viewer.clock.shouldAnimate = true
        
        viewer.scene.globe.enableLighting = true;

        cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
    }
    clockStatus() {
        this.setState({
            buttonstatus: !this.state.buttonstatus
        })
        viewer.clock.shouldAnimate = this.state.buttonstatus ? true : false
        console.log(viewer.clock.currentTime)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Button className="baiduButton" onClick={this.clockStatus.bind(this)} icon={this.state.buttonstatus ? "check-circle" : "stop"}>{this.state.buttonstatus ? "启动" : "暂停"}</Button>
            </div>
        );
    }
}
export default Map