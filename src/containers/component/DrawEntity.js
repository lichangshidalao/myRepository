import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { drawEntity, desDraw } from "../CesiumViewer/drawEntity";
import { Select } from 'antd';

//antd标签
const Option = Select.Option;
//const viewer
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        //addBingMapLayer(viewer)
        //开启地形
        viewer.terrainProvider = Cesium.createWorldTerrain()
        const positions = Cesium.Cartesian3.fromDegrees(116.30370024874621, 40.029712499715885, 1000)
        cameraFlyto(viewer, positions, 2000)
    }
    handleChange(value) {
        desDraw(viewer)
        drawEntity(viewer, value)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click Me" className="select_1" onChange={this.handleChange.bind(this)}>
                    <Option value="point">point</Option>
                    <Option value="polyline">polyline</Option>
                    <Option value="polygon">polygon</Option>
                    <Option value="removeAll">removeAll</Option>
                </Select>
            </div>
        );
    }
}
export default Map