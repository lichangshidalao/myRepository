import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { getLonLat } from "../CesiumViewer/getLonLat";
import { Select } from 'antd';
import './viewer.css';
import { addTdtMap } from "../CesiumViewer/addTdtMap";

//const viewer
const Option = Select.Option;
let viewer, tileset
//示例数据
// let params = {
//     tx: 116.42721600000016,//模型中心X轴坐标（经度，单位：十进制度）
//     ty: 39.497370999999646,//模型中心Y轴坐标（纬度，单位：十进制度）  
//     tz: 10,    //模型中心Z轴坐标（高程，单位：米） 
//     rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
//     ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
//     rz: 7,       //Z轴（高程）方向旋转角度（单位：度）
//     scale: 20.4
// }

let params = {
    rx: 0,
    ry: 0,
    rz: 1,
    scale: 1,
    tx: 111.0031011243053,
    ty: 30.823530721441738,
    tz: 101.00875082991314,
}
let originalParam
//南北方向1米等于：360 / 40075016.68557849 =0.000008983152841195214 度（注：任意经度地球周长 40075016.68557849米）
//东西方向1米等于：360 / 38274592.22115159 =0.000009405717451407729 度（注：38纬度地球周长 38274592.22115159  米）
//速度取10m
let speed = 0.0001
let degree = 1
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        //addTdtMap(viewer, "TDT_VEC_W")
        var startTime = new Cesium.JulianDate(2458701, 50386.178999936106);
        var stopTime = Cesium.JulianDate.addSeconds(startTime, 15, new Cesium.JulianDate());
        viewer.clock.startTime = startTime.clone();  // 开始时间
        viewer.clock.stopTime = stopTime.clone();     // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
        viewer.clock.multiplier = 1
        viewer.clock.shouldAnimate = true
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 时钟设置为当前系统时间; 忽略所有其他设置。
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[16].url)
        tileset.readyPromise.then(function (tileset) {
            //深拷贝
            originalParam = JSON.parse(JSON.stringify(params))
            update3dtilesMaxtrix(tileset, params)
            let shadowMap = viewer.shadowMap;
            viewer.shadows = false
            shadowMap.maxmimumDistance = 10000.0;
            viewer.clock.startTime = new Cesium.JulianDate.fromIso8601('2013-12-25');
            viewer.clock.multiplier = 6000.0;
            //viewer.clock.shouldAnimate = true
            viewer.scene.globe.enableLighting = true;
            tileset.maximumScreenSpaceError = 0.1
            tileset.dynamicScreenSpaceError = true
            tileset.maximumMemoryUsage = 2048
            tileset.preferLeaves = true
            tileset.immediatelyLoadDesiredLevelOfDetail = true
        })
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



        document.addEventListener('keydown', (e) => {
            setFlagStatus(e, true);
            update3dtilesMaxtrix(tileset, params)
        });
    }
    handleChange(value) {
        switch (value) {
            case "restart":
                update3dtilesMaxtrix(tileset, originalParam)
                params = JSON.parse(JSON.stringify(originalParam))
                break
            case "confirm":
                console.log(params)
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="restart">还原</Option>
                    <Option value="confirm">打印</Option>
                </Select>
            </div>
        );
    }
}

//添加键盘监听事件
// 根据键盘按键返回标志
const setFlagStatus = (key, value) => {
    let numX = params.tx
    let numY = params.ty
    let numZ = params.tz
    let rx = params.rx
    let ry = params.ry
    let rz = params.rz
    let scale = params.scale
    switch (key.keyCode) {
        case 37:
            // 左
            numX -= speed
            break;
        case 38:
            // 上
            numY += speed
            break;
        case 39:
            // 右
            numX += speed
            break;
        case 40:
            // 下
            numY -= speed
            break;
        case 65:
            // A
            rx -= degree
            break;
        case 83:
            // S
            ry -= degree
            break;
        case 87:
            // W
            ry += degree
            break;
        case 68:
            // D
            rx += degree
            break;
        case 69:
            // E
            rz += degree
            break;
        case 81:
            // Q
            rz -= degree
            break;
        case 82:
            // -
            scale = scale > 0.1 ? scale - 0.1 : scale
            break;
        case 84:
            // +
            scale += 0.1
            break;
        case 88:
            // +
            numZ += 10
            break;
        case 90:
            // +
            numZ -= 1
            break;
    }
    params.tx = numX
    params.ty = numY
    params.tz = numZ
    params.rx = rx
    params.ry = ry
    params.rz = rz
    params.scale = scale
}
export default Map