import React, { Component } from 'react';
import { Cesium } from "../CesiumViewer/PolylineMater"
import viewerInit from "../CesiumViewer/viewer";
import bjLoad from "../../data/bj/bjxcxd_03.json"
import { addTdtMap } from "../CesiumViewer/addTdtMap";

import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        addTdtMap(viewer, "TDT_VEC_W")
        let promise = Cesium.GeoJsonDataSource.load(bjLoad);
        let materials = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 1000)
        let polylineInstanceArray = []
        promise.then((dataSource) => {
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            console.log(entities.length)
            //entiy 
            for (let entity of entities) {
                entity.polyline.material = materials
            }
        })
        add3dtiles(viewer, tileset3dtilesUrl.cityModel[2].url)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map