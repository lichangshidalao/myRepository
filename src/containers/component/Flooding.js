import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { cameraPosition } from "../CesiumViewer/cameraPosition"
import waters from "../img/water.jpg"
//const viewer
class TerrainMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        // Create the Cesium Viewer
        const viewer = viewerInit(this.refs.map)
        let mapStyle = Cesium.BingMapsStyle.AERIAL
        addBingMapLayer(viewer, mapStyle)
        viewer.terrainProvider = Cesium.createWorldTerrain()
        //cameraPosition(viewer)
        let postionArray = [
            -122.10048055300001, 46.158670272682244, 500,
            -122.28766274533976, 46.17286984446458, 500,
            -122.27454356791068, 46.26946675149521, 500,
            -122.0562005333117, 46.238995663985385, 500
        ]
        //水材质
        let river = new Cesium.ImageMaterialProperty({
            image: waters,
            color: new Cesium.Color(0, 69 / 256, 107 / 256, 0.8),
            repeat: new Cesium.Cartesian2(4, 4)
        });

        let entity = viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(postionArray),
                extrudedHeight: 0,
                perPositionHeight: true,
                //material: river,
                material: new Cesium.Color(0,69/256,107/256,0.8),
                outline: true,
                outlineColor: Cesium.Color.BLACK
            }
        })
        let waterHeight = 500
        let targetHeight = 2000
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-122.18474081714403, 46.22237144093084, 28000), // 设置位置
            orientation: {
                heading: Cesium.Math.toRadians(191.33645721607235), // 方向
                // pitch: Cesium.Math.toRadians(-0.2715277692998441),// 倾斜角度
                // roll: 6.282501220859469
            },
            complete: () => {
                setInterval(() => {
                    if (waterHeight < targetHeight) {
                        waterHeight += 100
                        if (waterHeight > targetHeight) {
                            waterHeight = targetHeight
                        }
                        entity.polygon.extrudedHeight.setValue(waterHeight)
                    }
                }, 1000)
            }
        });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default TerrainMap