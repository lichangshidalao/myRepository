import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { tileset3dtilesUrl } from "../../config/data.config";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        addTdtMap(viewer, "TDT_VEC_C")
        let tileset = add3dtiles(viewer,tileset3dtilesUrl.cityModel[2].url)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map