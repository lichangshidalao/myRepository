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
        let promise = Cesium.Resource.fetchJson('http://localhost:8080/Apps/SampleData/sf.geojson')
        let arr = []
        promise.then(function (dataSource) {
            let feature = dataSource.features
            for (let i of feature) {
                arr.push(i.geometry.coordinates)
                viewer.entities.add({
                    position : Cesium.Cartesian3.fromDegrees(i.geometry.coordinates[0],i.geometry.coordinates[1]),
                    point : {
                        show : true, // default
                        color : Cesium.Color.SKYBLUE, // default: WHITE
                        pixelSize : 10, // default: 1
                        outlineColor : Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth : 3 // default: 0
                    }
                });
            }
            console.log(arr)
        }).otherwise(function (error) {
            //Display any errrors encountered while loading.
            window.alert(error);
        });
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