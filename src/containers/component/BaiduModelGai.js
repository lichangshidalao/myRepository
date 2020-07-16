import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { tileset3dtilesUrl } from "../../config/data.config";
import { getLonLat } from "../CesiumViewer/getLonLat";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { Button } from 'antd';
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
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
        viewer.clock.shouldAnimate = true
        viewer.imageryLayers.addImageryProvider(layer)
        tileset = add3dtiles(viewer, tileset3dtilesUrl.photography[0].url, false)
        tileset.readyPromise.then((tileset) => {
            //示例数据
            let params = {
                tx: 114.27,  //模型中心X轴坐标（经度，单位：十进制度）
                ty: 30.60,     //模型中心Y轴坐标（纬度，单位：十进制度）  
                tz: 100,    //模型中心Z轴坐标（高程，单位：米） 
                rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
                ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
                rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
                scale: 1
            };
            update3dtilesMaxtrix(tileset, params)
            viewer.flyTo(
                tileset,
                { offset: new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0) }
            )
            // viewer.camera.flyTo({
            //     destination: position,
            //     complete: () => {
            //         viewer.clock.onTick.addEventListener(function (clock) {
            //             // This example uses time offsets from the start to identify which parts need loading.
            //             var timeOffset = Cesium.JulianDate.secondsDifference(
            //                 clock.currentTime,
            //                 clock.startTime
            //             );
            //             let numZ = timeOffset / 10
            //             params.rz = timeOffset
            //             update3dtilesMaxtrix(tileset, params)
            //         });
            //     }
            // });
        })

        //cameraFlyto(viewer, tileset.boundingSphere.center, 1000, headings, pitchs)

        // let camera = viewer.scene.camera;
        // camera.percentageChanged = 0.1;
        // let numZ
        // camera.changed.addEventListener(() => {
        //     let pitch = Cesium.Math.toDegrees(camera.pitch)
        //     pitch < 0 ? numZ = (90 - Math.abs(pitch)) / 90 : numZ = 1
        //     numZ < 0.1 ? tileset.show = false : tileset.show = true
        //     if (tileset.show) {
        //         update3dtilesMaxtrixZ(tileset, numZ)
        //     }
        // })
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
export default Map