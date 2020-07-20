import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { Input } from 'antd';
import green from '../img/green2.jpg'
import './viewer.css';
import { IntegerStep } from '../antdComponent/slider';

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
        let layers = viewer.imageryLayers
        layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: green,
            rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
        }));
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[8].url)
        tileset.readyPromise.then(function (tileset) {
            update3dtilesMaxtrix(tileset, params)
            let shadowMap = viewer.shadowMap;
            viewer.shadows = true
            shadowMap.maxmimumDistance = 10000.0;
            let startTime = new Cesium.JulianDate(2458696, 57273.178999936106)
            viewer.clock.startTime = startTime
            viewer.clock.multiplier = 6000.0;
            //viewer.clock.shouldAnimate = true
            viewer.scene.globe.enableLighting = true;
            tileset.maximumScreenSpaceError = 1
        })
        tileset.tileVisible.addEventListener(function (tile) {
            let content = tile.content
            let featuresLength = content.featuresLength;
            for (let i = 0; i < featuresLength; i++) {
                content.getFeature(i).color = new Cesium.Color(150 / 255, 150 / 255, 150 / 255, 1)
            }
        });
        let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        pickhandle.setInputAction((momvent) => {
            console.log(viewer.clock.currentTime)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    getColorR(e) {
        this.setState({
            red: e.target.value
        })
        modelColor(this.state.red, this.state.green, this.state.blue)
    }
    getColorG(e) {
        this.setState({
            green: e.target.value
        })
        modelColor(this.state.red, this.state.green, this.state.blue)
    }
    getColorB(e) {
        this.setState({
            blue: e.target.value
        })
        modelColor(this.state.red, this.state.green, this.state.blue)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <div className="baiduButton">
                    <Input id="red" defaultValue={this.state.red} onPressEnter={this.getColorR.bind(this)} />
                    <Input id="green" defaultValue={this.state.green} onPressEnter={this.getColorG.bind(this)} />
                    <Input id="blue" defaultValue={this.state.blue} onPressEnter={this.getColorB.bind(this)} />
                </div>
            </div>
        );
    }
}
const modelColor = (r, g, b, a = 1) => {
    tileset.tileVisible.addEventListener(function (tile) {
        let content = tile.content
        let featuresLength = content.featuresLength;
        for (let i = 0; i < featuresLength; i++) {
            content.getFeature(i).color = new Cesium.Color(r / 255, g / 255, b / 255, a)
        }
    });
}
export default Map