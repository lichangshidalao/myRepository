import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { showDynamicLayer } from "../CesiumViewer/dynamicDiv";
import lines from "../img/line.png"
import mains from "../img/layer_border.png"
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
        let dynamicD = this.refs.dynamics
        let line = this.refs.line
        let main = this.refs.main
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((e) => {
            var cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
            //let cartesian = viewer.scene.pick(e.position)
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);//四舍五入 小数点后保留五位
            var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);//四舍五入  小数点后保留五位
            // var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度
            if (cartesian) {
                /** main */
                var data = {
                    lon: lon,
                    lat: lat,
                    element: dynamicD,
                    elementLine: line,
                    elementMain: main,
                    addEntity: true,//默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了，这个时候 boxHeightMax可要可不要。它代表弹窗起始点的地理坐标高度
                    boxHeight: 20000,//中间立方体的高度
                    boxHeightDif: 500,//中间立方体的高度增长差值，越大增长越快
                    boxHeightMax: 40000,//中间立方体的最大高度
                    boxSide: 10000,//立方体的边长
                    boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
                    circleSize: 30000,//大圆的大小，小圆的大小默认为一半
                };
                showDynamicLayer(viewer, data, function () { //回调函数 改变弹窗的内容;
                    main.innerHTML = "hello world!" + Math.random() * 10000
                });
                /** main */
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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