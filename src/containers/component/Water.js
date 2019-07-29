import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { CreateGeometry, CreateAppearence, FSWaterFace } from "../CesiumViewer/water"
import water from "../img/water.png"
import './viewer.css';


let viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let fragmentShader = FSWaterFace();

        let degreesArrayHeights = [116, 30, 1000,
            117, 31, 1000,
            118, 32, 1000,
            119, 33, 1000,
            115, 34, 1000];

        let geometry = CreateGeometry(degreesArrayHeights);
        let appearance = CreateAppearence(fragmentShader, water);

        let primitive = viewer.scene.primitives.add(new Cesium.Primitive({
            allowPicking: false,
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry
            }),
            appearance: appearance,
            asynchronous: false
        }));
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.04537, 30.10932, 300000)
        });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}
export default Map
