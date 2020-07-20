import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { ion_Token } from "../../config/data.config";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { Select } from 'antd';
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
        Cesium.Ion.defaultAccessToken = ion_Token
        viewer = viewerInit(this.refs.map)
        addBingMapLayer(viewer)
    }
    handleChange(value) {
        switch (value) {
            case "haigengongyuan":
                const layerCollection = viewer.imageryLayers
                const haigenggognyuan = layerCollection.addImageryProvider(
                    new Cesium.IonImageryProvider({ assetId: 13730 })
                );
                layerCollection.raiseToTop(haigenggognyuan)
                break
            case "house":
                add3dtiles(viewer, Cesium.IonResource.fromAssetId(13728))
                break
            case "OfficePlan":
                add3dtiles(viewer, Cesium.IonResource.fromAssetId(13709))
                break
            case "Reichstag":
                add3dtiles(viewer, Cesium.IonResource.fromAssetId(13721))
                break
            case "AGI_HQ":
                add3dtiles(viewer, Cesium.IonResource.fromAssetId(13706))
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="haigengongyuan">海埂公园</Option>
                    <Option value="house">house</Option>
                    <Option value="OfficePlan">OfficePlan</Option>
                    <Option value="Reichstag">Reichstag</Option>
                    <Option value="AGI_HQ">AGI_HQ</Option>
                </Select>
            </div>
        );
    }
}
export default BingMap