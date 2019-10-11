import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import transformTileset from "../CesiumViewer/3dtiles/transformTileset";
//const viewer
let viewer, tileset
let params = {
    rx: 270,
    ry: 0,
    rz: 0,
    scale: 1,
    tx: 119.09283930165836,
    ty: 32.26718715540471,
    tz: 10,
}
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(119.22079894662423, 32.2419449187401, 100),
            model: {
                uri: 'http://localhost:8080/Apps/SampleData/models/GroundVehicle/GroundVehicle.glb'
            },
            scale: 10
        });
        viewer.zoomTo(entity)
        document.addEventListener('keydown', (e) => {
            setFlagStatus(e, entity);
        });
        tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://localhost:8080/Apps/SampleData/ws3/tileset.json",
                debugShowBoundingVolume: false
            })
        );
        tileset.readyPromise.then(function (tileset) {
            //update3dtilesMaxtrix(tileset, params)
            const initialPositions = Cesium.Cartesian3.fromDegrees(119.22079894662423, 32.2419449187401, 1000);
            transformTileset(tileset, initialPositions)
            tileset.maximumScreenSpaceError = 0.01
            tileset.dynamicScreenSpaceError = true
            tileset.maximumMemoryUsage = 2048
            tileset.maximumScreenSpaceError = 1
            //viewer.zoomTo(tileset)
        })
        // let position = Cesium.Cartesian3.fromDegrees(119.22102079982442, 32.246055627926495, 338.679047534937)
        // viewer.scene.camera.setView({
        //     destination: position, // 点的坐标
        //     orientation: {
        //         heading: 3.145267467039589,
        //         pitch: -0.6714972431936248,
        //     }
        // });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
            </div>
        );
    }
}

//添加键盘监听事件
// 根据键盘按键返回标志
const setFlagStatus = (key, entity) => {
    let cartesian = entity.position._value
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    let height = cartographic.height
    let speed = 0.00001
    switch (key.keyCode) {
        case 37:
            // 左
            longitudeString -= speed
            break;
        case 38:
            // 上
            latitudeString += speed
            break;
        case 39:
            // 右
            longitudeString += speed
            break;
        case 40:
            // 下
            latitudeString -= speed
            break;
    }
    cartographic = Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
    let objectsToExclude = [entity];
    if (viewer.scene.sampleHeightSupported) {
        height = viewer.scene.sampleHeight(cartographic, objectsToExclude);
    }
    entity.position = Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, height)
}


export default Map