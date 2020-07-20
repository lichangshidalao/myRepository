import React, { Component } from 'react';
import echarts from "echarts"
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import gifs from "../img/xiaoren.gif"
import { cameraPosition } from "../CesiumViewer/cameraPosition"
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles"
//const viewer
class EcharsMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        const viewer = viewerInit(this.refs.map)
        let htmlOverlay = document.getElementById('echarscesium');
        const myechar = echarts.init(htmlOverlay)
        let option = initEchart()
        myechar.setOption(option)
        let positions = Cesium.Cartesian3.fromDegrees(116.3036888623059, 40.03126771677825, 50);
        viewer.scene.camera.flyTo({
            destination: positions,
            complete: () => {
                viewer.scene.preRender.addEventListener(() => {
                    let canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, positions);
                    if (Cesium.defined(canvasPosition)) {
                        //图片溢出隐藏
                        htmlOverlay.style.top = canvasPosition.y + 'px';
                        htmlOverlay.style.left = canvasPosition.x + 280 + 'px';
                        canvasPosition.y < 24 || canvasPosition.y > 840 ? htmlOverlay.style.display = "none" : htmlOverlay.style.display = "block"
                        canvasPosition.x + 280 < 280 || canvasPosition.x + 280 > 1980 ? htmlOverlay.style.display = "none" : htmlOverlay.style.display = "block"
                    }
                });
            }
        })
    }
    render() {
        return (
            <div>
                <div className="map-image" ref="map" id="cesiumContain">
                </div>
                <div id="echarscesium" style={{ display: "none", position: "absolute", zIndex: 100, width: "250px", height: "250px" }} />
            </div>
        );
    }
}
const initEchart = () => {
    let option = {
        // title: {
        //     text: '某站点用户访问来源',
        //     subtext: '纯属虚构',
        //     x: 'center'
        // },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
            {
                //name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' },
                    { value: 1548, name: '搜索引擎' }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return option
}
export default EcharsMap