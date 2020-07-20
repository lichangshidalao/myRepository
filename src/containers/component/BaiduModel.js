import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { tileset3dtilesUrl } from "../../config/data.config";
import { getLonLat } from "../CesiumViewer/getLonLat";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { Button } from 'antd';
//const viewer
let viewer, tileset
const initialPosition = Cesium.Cartesian3.fromDegrees(114.27, 30.60, 1500);
let headings = Cesium.Math.toRadians(0)
let pitchs = Cesium.Math.toRadians(-90.0)
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let layer = new Cesium.UrlTemplateImageryProvider({
            url: 'http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}',
            //url:'https://cesiumjs.org/tilesets/imagery/blackmarble',
            credit: '',
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        })
        viewer.imageryLayers.addImageryProvider(layer)
        tileset = add3dtiles(viewer, tileset3dtilesUrl.cityModel[3].url, false)
        tileset.show = false

        cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)

        let camera = viewer.scene.camera;
        camera.percentageChanged = 0.1;
        let numZ
        camera.changed.addEventListener(() => {
            let pitch = Cesium.Math.toDegrees(camera.pitch)
            pitch < 0 ? numZ = (90 - Math.abs(pitch)) / 90 : numZ = 1
            numZ < 0.1 ? tileset.show = false : tileset.show = true
            if (tileset.show) {
                update3dtilesMaxtrixZ(tileset, numZ)
            }
        })
    }
    restartCamera() {
        cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Button className="baiduButton" onClick={this.restartCamera}>还原</Button>
            </div>
        );
    }
}
//解决位移问题
let positionArray = [], mat
const update3dtilesMaxtrixZ = (tileset, pitch) => {
    //缩放 x,y,z轴缩放
    let mZoom = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1.0, 1.0, pitch));
    //缩放
    tileset.readyPromise.then(() => {
        if (positionArray.length == 0) {
            positionArray = getLonLat(tileset.boundingSphere.center)
            let position = Cesium.Cartesian3.fromDegrees(positionArray[0], positionArray[1], 0);
            mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            let rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(0)));
            let rotationY = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0)));
            let rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
            Cesium.Matrix4.multiply(mat, rotationX, mat);
            Cesium.Matrix4.multiply(mat, rotationY, mat);
            Cesium.Matrix4.multiply(mat, rotationZ, mat);
            let mC = Cesium.Matrix4.clone(mat, mC)
            tileset._root.transform = mC;
        } else {
            let mC = Cesium.Matrix4.clone(mat, mC)
            Cesium.Matrix4.multiply(mC, mZoom, mC);
            tileset._root.transform = mC;
        }
    })
}
export default Map