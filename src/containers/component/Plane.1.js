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
    tx: 110.5,  //模型中心X轴坐标（经度，单位：十进制度）
    ty: 30,     //模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: 1120,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 1
};

let originalParam


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

        let clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 100.0)
            ],
            // enabled: false
        });
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
        tileset.readyPromise.then(function (tileset) {
            tileset.clippingPlanes = clippingPlanes
        })

        document.addEventListener('keydown', (e) => {
            setFlagStatus(e);
            createPlaneUpdateFunction(clippingPlanes)
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
const setFlagStatus = (key) => {
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
const createPlaneUpdateFunction = (clippingPlanes) => {
    return () => {
        //旋转
        let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移   
        let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);

        //let mp = clippingPlanes.modelMatrix
        clippingPlanes.modelMatrix = m
        return clippingPlanes;
    };
}