import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
//const viewer
class Map extends Component {
    constructor(){
        super()
        this.state={}
    }
    componentDidMount() {
        viewerInit(this.refs.map)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map