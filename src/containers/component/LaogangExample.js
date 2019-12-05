import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import green from '../img/green2.jpg'
import './viewer.css';
import { IntegerStep } from '../antdComponent/slider';
import colorImage from "../img/colors.png"


let viewer, tileset
//示例数据
let params = {
    tx: 116.42721600000016,//模型中心X轴坐标（经度，单位：十进制度）
    ty: 39.497370999999646,//模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: -10,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 7,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 20.4
}
class Map extends Component {
    constructor() {
        super()
        this.state = {
            red: 255,
            green: 255,
            blue: 255
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        var startTime = new Cesium.JulianDate(2458718, 19208.351);
        //var startTime = Cesium.JulianDate.now()
        //console.log(startTime)
        var stopTime = Cesium.JulianDate.addSeconds(startTime, 15, new Cesium.JulianDate());
        viewer.clock.startTime = startTime.clone();  // 开始时间
        viewer.clock.stopTime = stopTime.clone();     // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
        viewer.clock.multiplier = 1
        viewer.clock.shouldAnimate = true
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 时钟设置为当前系统时间; 忽略所有其他设置。
        var rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(116.28016), Cesium.Math.toRadians(39.424923),
            Cesium.Math.toRadians(116.536766), Cesium.Math.toRadians(39.545105));
        var imagelayers = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: 'http://172.16.108.203:9002/api/wmts/gettile/524fdbde5bb842e1a9b9882f1e4004d0/{z}/{x}/{y}',
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            minimumLevel: 0,
            rectangle: rectangle,
            maximumLevel: 16,
        }), {
            show: true
        });
        viewer.imageryLayers.add(imagelayers);
        // tileset = new Cesium.Cesium3DTileset({
        //     url: 'http://172.16.108.203:9002/api/folder/3c744bce08944c1eaa556a425010e55e/tileset.json'
        // });






        // let layers = viewer.imageryLayers
        // layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        //     url: green,
        //     rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
        // }));
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[11].url)
        tileset.readyPromise.then(function (tileset) {
            update3dtilesMaxtrix(tileset, params)
            let shadowMap = viewer.shadowMap;
            //viewer.shadows = true
            shadowMap.maxmimumDistance = 10000.0;
            tileset.maximumScreenSpaceError = 1
        })
        tileset.style = new Cesium.Cesium3DTileStyle({
            meta: {
                description: '"Building id ${id} has height ${Height}."'
            }
        });
        var fs =
            'uniform sampler2D colorTexture;\n' +
            'varying vec2 v_textureCoordinates;\n' +
            'uniform vec4 highlight;\n' +
            'void main() {\n' +
            '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
            '    if (czm_selected()) {\n' +
            '        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n' +
            '        gl_FragColor = vec4(highlighted, 1.0);\n' +
            '    } else { \n' +
            '        gl_FragColor = color;\n' +
            '    }\n' +
            '}\n';


        let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        pickhandle.setInputAction((movement) => {
            let pickedFeature = viewer.scene.pick(movement.position);
            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                var stage = viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
                    fragmentShader: fs,
                    uniforms: {
                        highlight: function () {
                            return new Cesium.Color(1.0, 0.0, 0.0, 0.5);
                        },
                        image: colorImage
                    }
                }));
                stage.selected = [pickedFeature]
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    getColorR(value) {
        this.setState({
            red: value
        })
    }
    getColorG(value) {
        this.setState({
            green: value
        })
    }
    getColorB(value) {
        this.setState({
            blue: value
        })
    }
    componentWillUpdate() {
        modelColor(this.state.red, this.state.green, this.state.blue)
    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <div className="sildersLaogang">
                    <IntegerStep getColor={this.getColorR.bind(this)}></IntegerStep>
                    <IntegerStep getColor={this.getColorG.bind(this)}></IntegerStep>
                    <IntegerStep getColor={this.getColorB.bind(this)}></IntegerStep>
                </div>
            </div>
        );
    }
}
const modelColor = (r, g, b, a = 1) => {
    tileset.tileVisible.addEventListener(function (tile) {
        let content = tile.content
        let featuresLength = content.featuresLength;
        for (let i = 0; i < featuresLength; i++) {
            let featureFile = content.getFeature(i).getProperty('file')
            let featureName = content.getFeature(i).getProperty('name')
            if (featureName.indexOf("$ColladaAutoName$_14") != -1 || featureName == "$ColladaAutoName$_2" ||
                featureName == "$ColladaAutoName$_4" || featureName.indexOf("$ColladaAutoName$_13") != -1 ||
                featureName.indexOf("node-Object308840136") != -1) {
                content.getFeature(i).color = new Cesium.Color(r / 255, g / 255, b / 255, a)
            }
            // content.getFeature(i).color = new Cesium.Color(r / 255, g / 255, b / 255, a)
        }
    });
}
export default Map