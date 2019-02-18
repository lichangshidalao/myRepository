import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { Select } from 'antd';
import './viewer.css';


//const viewer
const Option = Select.Option;
let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
    }
    handleChange(value) {
        viewer.imageryLayers.removeAll()
        addTdtMap(viewer, value)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="天地图影像服务(墨卡托投影)" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="TDT_IMG_W">天地图影像服务(墨卡托投影)</Option>
                    <Option value="TDT_VEC_W">天地图矢量地图服务(墨卡托投影)</Option>
                    <Option value="TDT_IMG_C" >天地图影像服务(经纬度)</Option>
                    <Option value="TDT_VEC_C">天地图矢量地图服务(经纬度)</Option>
                </Select>
            </div>
        );
    }
}
export default Map