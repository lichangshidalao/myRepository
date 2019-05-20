import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let isConstant = false
        let viewer = viewerInit(this.refs.map)
        addTdtMap(viewer, "TDT_VEC_W")
        let startTime = Cesium.JulianDate.now();
        viewer.clock.startTime = startTime
        viewer.clock.shouldAnimate = true
        viewer.clock.multiplier = 3000.0;
        let colorProperty = new Cesium.SampledProperty(Cesium.Color);

        let time1 = Cesium.JulianDate.addHours(startTime, 3, new Cesium.JulianDate()),
            time2 = Cesium.JulianDate.addHours(startTime, 6, new Cesium.JulianDate()),
            time3 = Cesium.JulianDate.addHours(startTime, 9, new Cesium.JulianDate()),
            time4 = Cesium.JulianDate.addHours(startTime, 12, new Cesium.JulianDate())

        colorProperty.addSample(time1, new Cesium.Color(1, 0, 0));
        colorProperty.addSample(time2, new Cesium.Color(0, 1, 0));
        colorProperty.addSample(time3, new Cesium.Color(0, 0, 1));
        colorProperty.addSample(time4, new Cesium.Color(0.5, 0.5, 0.5));
        let sphere1Material = new Cesium.ColorMaterialProperty(colorProperty)
        let sphere1 = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(116.232922, 39.542637, 1000),
            ellipsoid: {
                radii: new Cesium.Cartesian3(1000, 1000, 1000),
                material: sphere1Material
            }
        });



        let CallbackMaterial = new Cesium.CallbackProperty((time, result) => {
            let number = 0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
            result = new Cesium.Color(number, 1, 0.3)
            return result
        }, isConstant)
        let sphere2Material = new Cesium.ColorMaterialProperty(CallbackMaterial)
        let sphere2 = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(116.262922, 39.542637, 1000),
            ellipsoid: {
                radii: new Cesium.Cartesian3(1000, 1000, 1000),
                material: sphere2Material
            }
        });


        let sphere3 = viewer.entities.add({
            position: new Cesium.CallbackProperty((time, result) => {
                let number = 0.05 * Cesium.JulianDate.secondsDifference(time, startTime);
                if (number > 10000) {
                    isConstant = true
                }
                result = Cesium.Cartesian3.fromDegrees(116.292922, 39.542637, 1000 + number)
                return result
            }, isConstant),
            ellipsoid: {
                radii: new Cesium.Cartesian3(1000, 1000, 1000),
                material: Cesium.Color.RED
            }
        });

        viewer.zoomTo(sphere2)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map