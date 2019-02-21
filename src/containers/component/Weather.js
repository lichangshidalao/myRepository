import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { cameraPosition } from "../CesiumViewer/cameraPosition"
import { FS_Snow } from "../CesiumViewer/glsl/Snow"
import { FS_Rain } from "../CesiumViewer/glsl/Rain"
import { Select } from 'antd';

import './viewer.css';


//const viewer
const Option = Select.Option;
let viewer, collection, fs
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        // Create the Cesium Viewer
        viewer = viewerInit(this.refs.map)
        let mapStyle = Cesium.BingMapsStyle.AERIAL
        addBingMapLayer(viewer, mapStyle)
        viewer.terrainProvider = Cesium.createWorldTerrain()
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-122.17039148808765, 46.268964568975825, 3634.0751319), // 设置位置
            orientation: {
                heading: Cesium.Math.toRadians(191.33645721607235), // 方向
                pitch: Cesium.Math.toRadians(-0.2715277692998441),// 倾斜角度
                roll: 6.282501220859469
            }
        });
        cameraPosition(viewer)
        collection = viewer.scene.postProcessStages;
        //大气特效
        viewer.scene.skyAtmosphere.hueShift = -0.8;
        viewer.scene.skyAtmosphere.saturationShift = -0.7;
        viewer.scene.skyAtmosphere.brightnessShift = -0.33;
        viewer.scene.fog.density = 0.001;
        viewer.scene.fog.minimumBrightness = 0.8;
    }
    handleChange(value) {
        viewer.scene.postProcessStages.removeAll()
        switch (value) {
            case "rain":
                fs = FS_Rain()
                break
            case "snow":
                fs = FS_Snow()
                break
        }
        let ps = new Cesium.PostProcessStage({
            name: 'czm_snow',
            fragmentShader: fs
        });
        value === "clear" ? viewer.scene.postProcessStages.removeAll() : collection.add(ps);
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="rain">雨</Option>
                    <Option value="snow">雪</Option>
                    <Option value="clear">清除</Option>
                </Select>
            </div>
        );
    }
}
export default Map