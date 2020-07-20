import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { showDynamicLayer } from "../CesiumViewer/dynamicDiv";
import lines from "../img/line.png"
import mains from "../img/layer_border.png"

import circle1 from "../img/circle1.png"
import circle2 from "../img/circle2.png"
import boardimge from "../img/layer_border.png"
//const viewer
let viewer, tileset
class Map extends Component {
    constructor() {
        super()
        this.state = {
            buttonstatus: true
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let sStartFlog = false;
        let s1 = 0.001, s2 = s1, s3 = s1, s4 = s1;
        setTimeout(function () {
            sStartFlog = true;
        }, 300);
        var rotation = Cesium.Math.toRadians(30);
        var rotation2 = Cesium.Math.toRadians(30);
        function getRotationValue() {
            rotation += 0.05;
            return rotation;
        }
        function getRotationValue2() {
            rotation2 -= 0.03;
            return rotation2;
        }
        var data = {
            boxHeight: 200,//中间立方体的高度
            boxHeightDif: 50,//中间立方体的高度增长差值，越大增长越快
            boxHeightMax: 200,//中间立方体的最大高度
            boxSide: 100,//立方体的边长
            boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
            circleSize: 300,//大圆的大小，小圆的大小默认为一半
        };
        let lon = 117.16, lat = 32.71
        //添加底座一 外环
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed2",
            name: "椭圆",
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            ellipse: {
                // semiMinorAxis :data.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
                // semiMajorAxis : data.circleSize,
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s1 = s1 + data.circleSize / 20;
                        if (s1 >= data.circleSize) {
                            s1 = data.circleSize;
                        }
                    }
                    return s1;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s2 = s2 + data.circleSize / 20;
                        if (s2 >= data.circleSize) {
                            s2 = data.circleSize;
                        }
                    }
                    return s2;
                }, false),
                material: circle2,
                rotation: new Cesium.CallbackProperty(getRotationValue, false),
                stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                zIndex: 2,
            }
        });
        //添加底座二 内环
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed3",
            name: "椭圆",
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s3 = s3 + data.circleSize / 20;
                        if (s3 >= data.circleSize / 2) {
                            s3 = data.circleSize / 2;
                        }
                    }
                    return s3;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    if (sStartFlog) {
                        s4 = s4 + data.circleSize / 20;
                        if (s4 >= data.circleSize / 2) {
                            s4 = data.circleSize / 2;
                        }
                    }
                    return s4;
                }, false),
                material: circle1,
                rotation: new Cesium.CallbackProperty(getRotationValue2, false),
                stRotation: new Cesium.CallbackProperty(getRotationValue2, false),
                zIndex: 3
            }
        });
        var goflog = true;
        var height = data.boxHeight, heightMax = data.boxHeightMax, heightDif = data.boxHeightDif;
        //添加正方体
        viewer.entities.add({
            id: "ysDynamicLayerEntityNoNeed1",
            name: "立方体盒子",
            position: new Cesium.CallbackProperty(function () {
                height = height + heightDif;
                if (height >= heightMax) {
                    height = heightMax;
                }
                return Cesium.Cartesian3.fromDegrees(lon, lat, height / 2)
            }, false),
            box: {
                dimensions: new Cesium.CallbackProperty(function () {
                    height = height + heightDif;
                    if (height >= heightMax) {
                        height = heightMax;
                        if (goflog) {//需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                            // addLayer();//添加div弹窗
                            goflog = false;
                        }
                    }
                    return new Cesium.Cartesian3(data.boxSide, data.boxSide, height)
                }, false),
                material: data.boxMaterial
            }
        });
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat, heightMax + 100),
            billboard: {
                image: boardimge
            }
        });
        // let dynamicD = this.refs.dynamics
        // let line = this.refs.line
        // let main = this.refs.main
        // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // handler.setInputAction((e) => {
        //     var cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
        //     //let cartesian = viewer.scene.pick(e.position)
        //     var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        //     var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);//四舍五入 小数点后保留五位
        //     var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);//四舍五入  小数点后保留五位
        //     // var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度
        //     if (cartesian) {
        //         /** main */
        //         var data = {
        //             lon: lon,
        //             lat: lat,
        //             element: dynamicD,
        //             elementLine: line,
        //             elementMain: main,
        //             addEntity: true,//默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了，这个时候 boxHeightMax可要可不要。它代表弹窗起始点的地理坐标高度
        //             boxHeight: 20000,//中间立方体的高度
        //             boxHeightDif: 500,//中间立方体的高度增长差值，越大增长越快
        //             boxHeightMax: 40000,//中间立方体的最大高度
        //             boxSide: 10000,//立方体的边长
        //             boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
        //             circleSize: 30000,//大圆的大小，小圆的大小默认为一半
        //         };
        //         showDynamicLayer(viewer, data, function () { //回调函数 改变弹窗的内容;
        //             main.innerHTML = "hello world!" + Math.random() * 10000
        //         });
        //         /** main */
        //     }
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(117.16, 32.71, 150000.0)
        });
    }
    render() {
        return (
            <div>
                <div className="map-image" ref="map" id="cesiumContain">
                </div>
                <div ref="dynamics" className="dynamic-layer">
                    <div ref='line' className="dynamic-line" style={{ backgroundImage: `url(${lines})` }}>
                    </div>
                    <div ref='main' className="dynamic-main" style={{ backgroundImage: `url(${mains})` }}>
                    </div>
                </div>

            </div>
        );
    }
}
export default Map