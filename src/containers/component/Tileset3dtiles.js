import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import transformTileset from "../CesiumViewer/3dtiles/transformTileset";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { tileset3dtilesUrl } from "../../config/data.config";
import { Select } from 'antd';
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { getLonLat } from "../CesiumViewer/getLonLat";
import './viewer.css';

//const viewer
const Option = Select.Option;
let viewer
class BingMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        viewer.shadows = true
        //viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
        addBingMapLayer(viewer, Cesium.BingMapsStyle.CANVAS_LIGHT)
    }
    handleChange(value) {
        switch (value) {
            case 'photography_osgb':
                add3dtiles(viewer, tileset3dtilesUrl.photography[0].url)
                break
            case 'city_newyork':
                add3dtiles(viewer, tileset3dtilesUrl.cityModel[0].url, false)
                const initialPosition = Cesium.Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 1500);
                let headings = Cesium.Math.toRadians(40)
                let pitchs = Cesium.Math.toRadians(-10.0)
                cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
                break
            case 'city_chongqin':
                add3dtiles(viewer, tileset3dtilesUrl.cityModel[1].url)
                break
            case "bim_chongqin":
                let b2 = add3dtiles(viewer, tileset3dtilesUrl.bimModel[0].url)
                // let b2Positions = Cesium.Cartesian3.fromDegrees(119.22079894662423, 32.2419449187401, 1000);
                let paramss = {
                    tx: 110.5,  //模型中心X轴坐标（经度，单位：十进制度）
                    ty: 30,     //模型中心Y轴坐标（纬度，单位：十进制度）  
                    tz: 1120,    //模型中心Z轴坐标（高程，单位：米） 
                    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
                    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
                    rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
                    scale: 10
                };
                update3dtilesMaxtrix(b2, paramss)
                viewer.zoomTo(b2)
                //cameraFlyto(viewer, b2Positions, 1000)
                // transformTileset(tilesetBimChongqin, positions)
                // cameraFlyto(viewer, positions, 1000)
                break
            case "bim_ws":
                const bimws = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
                const initialPositions = Cesium.Cartesian3.fromDegrees(119.22079894662423, 32.2419449187401, 1000);
                transformTileset(bimws, initialPositions)
                cameraFlyto(viewer, initialPositions, 1000)
                bimws.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE
                break
            case "bim_zhuhe":
                //演示数组
                let factorsArray1 = ["组合池结构图桩基（静压沉桩）"]
                setInterval(() => {
                    factorsArray1.push("组合池结构3dm-5m标高池壁、隔墙及顶板结构")
                }, 5000)
                const bimZhuhe = add3dtiles(viewer, tileset3dtilesUrl.bimModel[7].url)
                bimZhuhe.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;
                let pickArray = []
                let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
                pickhandle.setInputAction((movement) => {
                    let pickedFeature = viewer.scene.pick(movement.position);
                    if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                        var propertyNames = pickedFeature.getPropertyNames();
                        var length = propertyNames.length;
                        for (var i = 0; i < length; ++i) {
                            var propertyName = propertyNames[i];
                            console.log(propertyName + ': ' + pickedFeature.getProperty(propertyName));
                        }
                        pickArray.push(pickedFeature)
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
                bimZhuhe.tileVisible.addEventListener((tile) => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i++) {
                        content.getFeature(i).show = true
                        //content.getFeature(i).color = new Cesium.Color(1, 1, 1, 0.5);
                        let filename = content.getFeature(i).getProperty("file")
                        for (let j of factorsArray1) {
                            if (j === filename) {
                                content.getFeature(i).show = true
                                //content.getFeature(i).color = Cesium.Color.RED
                            }
                        }
                    }
                    for (let j of pickArray) {
                        j.show = false
                    }
                });
                //示例数据
                let params = {
                    rx: -88,
                    ry: 3,
                    rz: -1,
                    scale: 2,
                    tx: 119.0910393016583,
                    ty: 32.26718715540471,
                    tz: 1000
                };

                bimZhuhe.readyPromise.then(function (tileset) {
                    let positionArray = getLonLat(bimZhuhe.boundingSphere.center)
                    // params.tx = positionArray[0]
                    // params.ty = positionArray[1]
                    // params.tz = 110
                    update3dtilesMaxtrix(bimZhuhe, params)
                })
                break
            case "jingjian-ws":
                add3dtiles(viewer, tileset3dtilesUrl.bimModel[2].url)
                break
            case "ws-2":
                add3dtiles(viewer, tileset3dtilesUrl.bimModel[6].url)
                break
            case "ball":
                add3dtiles(viewer, tileset3dtilesUrl.bimModel[5].url)
                //viewer.zoomTo()
                viewer.clock.startTime = new Cesium.JulianDate(2458547, 52202.13500037328);
                viewer.clock.multiplier = 6000.0;
                viewer.clock.shouldAnimate = true
                break
            case "maxlaogang":
                let laogangMax = add3dtiles(viewer, tileset3dtilesUrl.bimModel[9].url)
                // laogangMax.readyPromise.then(function (laogangMax) {
                //     let shadowMap = viewer.shadowMap;
                //     viewer.shadows = true
                //     shadowMap.maxmimumDistance = 10000.0;
                //     let startTime = new Cesium.JulianDate(2458696, 57273.178999936106)
                //     viewer.clock.startTime = startTime
                //     viewer.clock.multiplier = 6000.0;
                // })
                break
            case "huatai":
                let huatai = add3dtiles(viewer, tileset3dtilesUrl.bimModel[14].url)
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="huatai">华泰</Option>
                    <Option value="photography_osgb">保利osgb倾斜模型</Option>
                    <Option value="city_newyork">纽约城市模型</Option>
                    <Option value="city_chongqin">重庆智慧园区</Option>
                    <Option value="bim_chongqin">重庆bim楼</Option>
                    <Option value="bim_ws">污水场</Option>
                    <Option value="bim_zhuhe">组合池</Option>
                    <Option value="jingjian-ws">精简污水</Option>
                    <Option value="ws-2">污水2</Option>
                    <Option value="ball">球</Option>
                    <Option value="maxlaogang">max老港</Option>
                </Select>
            </div>
        );
    }
}
export default BingMap