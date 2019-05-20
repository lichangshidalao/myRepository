import React, { Component } from 'react';
import { Cesium } from "../CesiumViewer/PolylineMater"
import viewerInit from "../CesiumViewer/viewer";
import bjLoad from "../../data/bj/bjxcxd_03.json"
import { addTdtMap } from "../CesiumViewer/addTdtMap";

//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        let scene = viewer.scene
        addTdtMap(viewer, "TDT_VEC_W")
        let materials = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 5000)
        let materials2 = new Cesium.Material({
            fabric: {
                type: 'Color',
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 0.0, 0.7)
                }
            }
        });
        let promise = Cesium.GeoJsonDataSource.load(bjLoad);
        let polylineInstanceArray = []
        promise.then((dataSource) => {
            //entity
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            for (let entity of entities) {
                //
                entity.polyline.material = materials
                //
                let instance = new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: entity._polyline._positions._value,
                        width: 10.0,
                        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                    })
                });
                polylineInstanceArray.push(instance)
            }
            viewer.scene.primitives.add(new Cesium.Primitive({
                geometryInstances: polylineInstanceArray,
                appearance: new Cesium.PolylineMaterialAppearance({
                    translucent: true,
                    material: materials2
                })
            }));
        })
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map