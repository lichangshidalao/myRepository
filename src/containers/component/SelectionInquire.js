import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium";

import { getLonLat } from "../CesiumViewer/getLonLat";
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        //初始化视图
        let viewer = viewerInit(this.refs.map)

        //设置起始点
        let [startP, endP] = [[], []]

        //注册handle
        let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        let isStart = false
        //注册左键单机事件
        pickhandle.setInputAction((movement) => {
            //获取点击位置
            let cartesian = viewer.scene.pickPosition(movement.position)
            //第一次点击起点 以后点击为终点
            startP.length === 0 ? startP = getLonLat(cartesian) : endP = getLonLat(cartesian)
            console.log(startP)
            isStart = !isStart

            //确定矩形位置
            if (endP.length > 0) {
                //let [west, south, east, north] = [startP[0], startP[1], endP[0], endP[1]]
                // let [...cartesianArray] = [Cesium.Cartesian3.fromDegrees(startP), Cesium.Cartesian3.fromDegrees(endP)]
                let cartesianss = Cesium.Cartesian3.fromDegrees(...startP)
                let [...cartesianArray] = [cartesianss, cartesian]
                console.log(cartesianArray)
                let coordinates = Cesium.Rectangle.fromCartesianArray(cartesianArray)
                rectangle.rectangle.coordinates = coordinates
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        //鼠标移动事件
        pickhandle.setInputAction(function (movement) {
            //获取点击位置
            let cartesian = viewer.scene.pickPosition(movement.endPosition)
            if (isStart) {
                endP = getLonLat(cartesian)
                let cartesianss = Cesium.Cartesian3.fromDegrees(...startP)
                let [...cartesianArray] = [cartesianss, cartesian]
                let coordinates = Cesium.Rectangle.fromCartesianArray(cartesianArray)
                rectangle.rectangle.coordinates = coordinates
                rectangle.show = true
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        let colorMaterial = new Cesium.ColorMaterialProperty(Cesium.Color.AZURE.withAlpha(0.3))
        let rectangle = viewer.entities.add({
            show: false,
            rectangle: {
                rectangle: Cesium.Rectangle.fromDegrees(-92.0, 20.0, -86.0, 27.0),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 4,
                material: colorMaterial
            }
        });
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain" />
        );
    }
}
export default Map