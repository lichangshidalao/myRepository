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
    tx: 116.42721600000016,//模型中心X轴坐标（经度，单位：十进制度）
    ty: 39.497370999999646,//模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: 0,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 7,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 20.4
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
        var startTime = new Cesium.JulianDate(2458701, 50386.178999936106);
        var stopTime = Cesium.JulianDate.addSeconds(startTime, 15, new Cesium.JulianDate());
        viewer.clock.startTime = startTime.clone();  // 开始时间
        viewer.clock.stopTime = stopTime.clone();     // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
        viewer.clock.multiplier = 1
        viewer.clock.shouldAnimate = true
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 时钟设置为当前系统时间; 忽略所有其他设置。
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[10].url)
        tileset.readyPromise.then(function (tileset) {
            //深拷贝
            originalParam = JSON.parse(JSON.stringify(params))
            update3dtilesMaxtrix(tileset, params)
            viewer.scene.globe.enableLighting = true;
            tileset.maximumScreenSpaceError = 1
        })
        viewer.entities.add({
            name: "航站楼",
            position: Cesium.Cartesian3.fromDegrees(params.tx, params.ty, 10),
            model: {
                uri: "http://localhost:8080/Apps/SampleData/gltf/hangzhanlou.gltf"
            }
        });
        // tileset.tileVisible.addEventListener(function (tile) {
        //     let content = tile.content
        //     let featuresLength = content.featuresLength;
        //     for (let i = 0; i < featuresLength; i++) {
        //         content.getFeature(i).color = new Cesium.Color(105 / 255, 105 / 255, 105 / 255, 1)
        //     }
        // });
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
export default Map