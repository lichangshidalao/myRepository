import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { Select } from 'antd';
import './viewer.css';
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { cameraPosition } from "../CesiumViewer/cameraPosition"

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
        cameraPosition(viewer)
        addBingMapLayer(viewer, Cesium.BingMapsStyle.CANVAS_DARK)
    }
    handleChange(value) {
        viewer.imageryLayers.removeAll()
        let mapStyle
        switch (value) {
            case 'DARK':
                mapStyle = Cesium.BingMapsStyle.CANVAS_DARK
                addBingMapLayer(viewer, mapStyle)
                break
            case 'AERIAL':
                mapStyle = Cesium.BingMapsStyle.AERIAL
                addBingMapLayer(viewer, mapStyle)
                break
            case 'AERIAL_WITH_LABELS':
                mapStyle = Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                addBingMapLayer(viewer, mapStyle)
                break
            case 'CANVAS_GRAY':
                mapStyle = Cesium.BingMapsStyle.CANVAS_GRAY
                addBingMapLayer(viewer, mapStyle)
                break
            case 'CANVAS_LIGHT':
                mapStyle = Cesium.BingMapsStyle.CANVAS_LIGHT
                addBingMapLayer(viewer, mapStyle)
                break
            case 'COLLINS_BART':
                mapStyle = Cesium.BingMapsStyle.COLLINS_BART
                addBingMapLayer(viewer, mapStyle)
                break
            case 'ORDNANCE_SURVEY':
                mapStyle = Cesium.BingMapsStyle.ORDNANCE_SURVEY
                addBingMapLayer(viewer, mapStyle)
                break
            case 'ROAD':
                mapStyle = Cesium.BingMapsStyle.ROAD
                addBingMapLayer(viewer, mapStyle)
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="DARK" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="AERIAL">AERIAL</Option>
                    <Option value="DARK">DARK</Option>
                    <Option value="AERIAL_WITH_LABELS" >AERIAL_WITH_LABELS</Option>
                    <Option value="CANVAS_GRAY">CANVAS_GRAY</Option>
                    <Option value="CANVAS_LIGHT">CANVAS_LIGHT</Option>
                    <Option value="COLLINS_BART">COLLINS_BART</Option>
                    <Option value="ORDNANCE_SURVEY">ORDNANCE_SURVEY</Option>
                    <Option value="ROAD">ROAD</Option>
                </Select>
            </div>
        );
    }
}
export default BingMap