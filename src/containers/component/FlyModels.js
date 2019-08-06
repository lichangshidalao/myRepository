import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import green from '../img/green2.jpg'
import './viewer.css';
import { IntegerStep } from '../antdComponent/slider';
import { cameraPosition } from "../CesiumViewer/cameraPosition"

let viewer, tileset
//示例数据
let params = {
    rx: 270,
    ry: 0,
    rz: 0,
    scale: 1,
    tx: 119.09283930165836,
    ty: 32.26718715540471,
    tz: 10,
}
let cameraParam = {
    0: "119.0931525659286°",
    1: "32.25776506851074°",
    2: "197.33753132992612米",
    3: "358.76185446331084°",
    4: -0.6856411282433559,
    5: 0.000023301066424785688
}
class Map extends Component {
    constructor() {
        super()
        this.state = {
            red: 150,
            green: 150,
            blue: 150
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        cameraPosition(viewer)
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[8].url, false)
        tileset.readyPromise.then(function (tileset) {
            update3dtilesMaxtrix(tileset, params)
        })
        let position = Cesium.Cartesian3.fromDegrees(119.09283930165836, 32.26718715540471, 20)
        // viewer.scene.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(119.09265712240679, 32.25776506851074, 200), // 点的坐标
        //     orientation: {
        //         heading: Cesium.Math.toRadians(358),
        //         pitch: Cesium.Math.toRadians(-15),
        //         roll: 0.0
        //     },
        //     complete: () => {
        //         viewer.clock.onTick.addEventListener(Exection);
        //     }
        // });
        // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
        var pitch = Cesium.Math.toRadians(-30);
        // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
        var angle = 360 / 20;
        // 给定相机距离点多少距离飞行，这里取值为5000m
        var distance = 400;
        var startTime = Cesium.JulianDate.fromDate(new Date());

        var stopTime = Cesium.JulianDate.addSeconds(startTime, 20, new Cesium.JulianDate());

        viewer.clock.startTime = startTime.clone();  // 开始时间
        viewer.clock.stopTime = stopTime.clone();     // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
        // 相机的当前heading
        var initialHeading = viewer.camera.heading;
        var Exection = function TimeExecution() {
            // 当前已经过去的时间，单位s
            var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
            var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
            viewer.scene.camera.setView({
                destination: position, // 点的坐标
                orientation: {
                    heading: heading,
                    pitch: pitch,

                }
            });
            viewer.scene.camera.moveBackward(distance);
            if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                viewer.clock.onTick.removeEventListener(Exection);
            }

        };
        viewer.clock.onTick.addEventListener(Exection);
        let handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handle.setInputAction((momvent) => {
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map


