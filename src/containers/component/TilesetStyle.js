import React, { Component } from 'react';
import { Select, Card } from 'antd';

import Cesium from "cesium/Cesium";

import viewerInit from "../CesiumViewer/viewer";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
import { addBingMapLayer } from "../CesiumViewer/addBingMapLayer"
import { tileset3dtilesUrl } from "../../config/data.config";


import './viewer.css';
//const viewer
const Option = Select.Option;
const { Meta } = Card;
let viewer, tileset
class BingMap extends Component {
    constructor() {
        super()
        this.state = {
            buildID: "",
            columns: [],
            data: []
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        console.log(this.refs.card)
        addBingMapLayer(viewer, Cesium.BingMapsStyle.CANVAS_LIGHT)
        tileset = add3dtiles(viewer, tileset3dtilesUrl.cityModel[0].url, false)
        const initialPosition = Cesium.Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 753);
        let headings = Cesium.Math.toRadians(40)
        let pitchs = Cesium.Math.toRadians(-10.0)
        cameraFlyto(viewer, initialPosition, 1000, headings, pitchs)
    }
    handleChange(value) {
        //初始化handle
        const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        switch (value) {
            case 'style-Height':
                tileset.style = new Cesium.Cesium3DTileStyle({
                    color: {
                        conditions: [
                            ['${height} >= 300', 'rgba(45, 0, 75, 0.5)'],
                            ['${height} >= 200', 'rgb(102, 71, 151)'],
                            ['${height} >= 100', 'rgb(170, 162, 204)'],
                            ['${height} >= 50', 'rgb(224, 226, 238)'],
                            ['${height} >= 25', 'rgb(252, 230, 200)'],
                            ['${height} >= 10', 'rgb(248, 176, 87)'],
                            ['${height} >= 5', 'rgb(198, 106, 11)'],
                            ['true', 'rgb(127, 59, 8)']
                        ]
                    }
                });
                break
            case 'style-Pick':
                //获取card,table对象
                let cards = document.getElementById("Cesiumcards")
                //创建边界后处理
                const silhouetteRed = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
                silhouetteRed.uniforms.color = Cesium.Color.RED;
                silhouetteRed.uniforms.length = 0.01;
                silhouetteRed.selected = [];
                const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
                silhouetteGreen.uniforms.color = Cesium.Color.GREEN;
                silhouetteGreen.uniforms.length = 0.01;
                silhouetteGreen.selected = [];
                viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteRed, silhouetteGreen]));
                //pick事件
                handle.setInputAction((movement) => {
                    let pickedFeature = viewer.scene.pick(movement.position)
                    if (Cesium.defined(pickedFeature) && pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                        silhouetteGreen.selected = [pickedFeature]
                        silhouetteRed.selected = []
                        let nameArray = pickedFeature.getPropertyNames()
                        //生成点击表格
                        for (let i = 0; i < nameArray.length; i++) {

                        }
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
                handle.setInputAction((movement) => {
                    let pickedFeature = viewer.scene.pick(movement.endPosition)
                    if (Cesium.defined(pickedFeature) && pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                        silhouetteRed.selected = [pickedFeature]
                        viewer.container.appendChild(cards);
                        cards.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 150 + 'px';
                        cards.style.left = movement.endPosition.x + 300 + 'px';
                        console.log(movement.endPosition.x + 300)
                        cards.style.display = 'block';
                        let buildIDs = "this is build " + pickedFeature.getProperty('name');
                        this.setState({
                            buildID: buildIDs
                        })
                    } else {
                        cards.style.display = "none"
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                break
            case 'style-color':
                tileset.tileVisible.addEventListener((tile) => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i++) {
                        content.getFeature(i).color = new Cesium.Color(1, 1, 1, 0.5);
                    }
                });
                break
            case 'style-Show':
                //pick事件
                let pickedFeature
                handle.setInputAction((movement) => {
                    pickedFeature = viewer.scene.pick(movement.position)
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
                tileset.tileVisible.addEventListener((tile) => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i++) {
                        if (content.getFeature(i) === pickedFeature) {
                            content.getFeature(i).show = false
                        }
                    }
                });
                break
            case 'HIGHLIGHT':
                tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT
                break
            case 'MIX':
                tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.MIX
                break
            case 'REPLACE':
                tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE
                break
        }
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click Me" className="bingMapStyle" onChange={this.handleChange.bind(this)}>
                    <Option value="style-Height">style-Height</Option>
                    <Option value="style-Pick">style-Pick</Option>
                    <Option value="style-color">style-color</Option>
                    <Option value="style-Show">style-Show</Option>
                </Select>
                <Select defaultValue="Color BlendMode" className="select_2" onChange={this.handleChange.bind(this)}>
                    <Option value="HIGHLIGHT">HIGHLIGHT </Option>
                    <Option value="MIX">MIX</Option>
                    <Option value="REPLACE ">REPLACE </Option>
                </Select>
                <Card
                    id="Cesiumcards"
                    className="CesiumTableClass"
                    ref="card"
                    style={{ width: 240, display: "none", position: "absolute" }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                >
                    <Meta
                        title={this.state.buildID}
                        description="点击大楼获取更多信息"
                    />
                </Card>
            </div>
        );
    }
}
export default BingMap