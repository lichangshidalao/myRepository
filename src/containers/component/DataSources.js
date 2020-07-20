import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import * as Cesium from "cesium/Cesium";
import { model_config } from "../../config/data.config";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        //viewer.terrainProvider = Cesium.createWorldTerrain()
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load(model_config.contour, {
            //stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.WHITE.withAlpha(0.5),
            // strokeWidth: 3
        })).then(
            function (dataSource) {
                var p = dataSource.entities.values;
                for (let i = 0; i < p.length; i++) {
                    p[i].polygon.extrudedHeight = p[i].properties.elevation.getValue();
                    //p[i].polygon.extrudedHeight = Math.round(Math.random()*10000)
                    p[i].polygon.outlineColor = Cesium.Color.fromRandom()
                    p[i].polygon.outlineWidth = 3
                }
            });
        viewer.camera.flyTo({
            // fly on over to mount reindeer
            destination: Cesium.Cartesian3.fromDegrees(-121.45, 46.25, 20000.0),
            orientation: {
                heading: Cesium.Math.toRadians(340.0),
                pitch: Cesium.Math.toRadians(-10.0)
            }
        });
        let eArray = viewer.entities.values
        console.log(eArray)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map