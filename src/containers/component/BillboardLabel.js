import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { billboardLabelPin, billboardLabelImage } from "../CesiumViewer/billboardLabel";
import poi from "../img/poi.png"
import { Select } from 'antd';
import cameraFlyto from "../CesiumViewer/cameraFlyto";

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
        addTdtMap(viewer)
        const entityPin = billboardLabelPin(viewer)
        viewer.zoomTo(entityPin)
    }
    handleChange(value) {
        viewer.entities.removeAll()
        switch (value) {
            case "pin":
                viewer.zoomTo(billboardLabelPin(viewer))
                break
            case "image":
                const position = Cesium.Cartesian3.fromDegrees(116.30477859375455, 40.03122907643513)
                billboardLabelImage(viewer, position, poi)
                const CameraPosition = Cesium.Cartesian3.fromDegrees(116.30477859375455, 40.03122907643513, 500)
                cameraFlyto(viewer, CameraPosition)
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="pin" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="pin">pin</Option>
                    <Option value="image">image</Option>
                </Select>
            </div>
        );
    }
}
export default Map