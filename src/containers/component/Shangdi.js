import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import { communityInit } from "../CesiumViewer/shangdi";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        viewer.scene.globe.depthTestAgainstTerrain = false
        //viewer.scene.screenSpaceCameraController.enableTilt = false;
        communityInit(viewer, "02eb90ad3605422685ed4c060875cd0c")
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map