import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { getLonLat } from "../CesiumViewer/getLonLat";
import { Select } from 'antd';
import './viewer.css';


//const viewer
const Option = Select.Option;
let viewer, tileset
//示例数据
let params = {
    tx: 119.0910393016583,  //模型中心X轴坐标（经度，单位：十进制度）
    ty: 32.26718715540471,     //模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: 10,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 1
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
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
        tileset.readyPromise.then(function (tileset) {
            //深拷贝
            originalParam = JSON.parse(JSON.stringify(params))
            update3dtilesMaxtrix(tileset, params)
            let shadowMap = viewer.shadowMap;
            viewer.shadows = true
            shadowMap.maxmimumDistance = 10000.0;
            viewer.clock.startTime = new Cesium.JulianDate.fromIso8601('2013-12-25');
            viewer.clock.multiplier = 6000.0;
            //viewer.clock.shouldAnimate = true
            viewer.scene.globe.enableLighting = true;
            tileset.maximumScreenSpaceError = 1
        })
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
            numZ += 1
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