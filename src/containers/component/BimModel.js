import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import * as Cesium from "cesium/Cesium";

import { tileset3dtilesUrl } from "../../config/data.config";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";

import { Tree } from 'antd';

const { TreeNode } = Tree;
//const viewer
//bim 07
// let params = {
//     rx: -90,
//     ry: -4,
//     rz: 0,
//     scale: 1,
//     tx: 119.0910393016583,
//     ty: 32.26718715540471,
//     tz: 0
// }
//示例数据 bim 01
let params = {
    tx: 119.0910393016583,  //模型中心X轴坐标（经度，单位：十进制度）
    ty: 32.26718715540471,     //模型中心Y轴坐标（纬度，单位：十进制度）  
    tz: -10,    //模型中心Z轴坐标（高程，单位：米） 
    rx: 0,     //X轴（经度）方向旋转角度（单位：度）  
    ry: 0,     //Y轴（纬度）方向旋转角度（单位：度）  
    rz: 0,       //Z轴（高程）方向旋转角度（单位：度）
    scale: 1
}
let cameraParams = {
    0: "119.0863200518221°",
    1: "32.26306790366665°",
    2: "141.07604784710622米",
    3: "356.4567557519004°",
    4: -0.3349924376770179,
    5: 6.282986978306287,
}
let viewer, tileset, tilesetIdMap = new Map(), content, bimMap = new Map(), tilesetMat
class Maps extends Component {
    constructor() {
        super()
        this.state = {
            modelTree: null
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        let scene = viewer.scene;
        let globe = scene.globe;
        // viewer.terrainProvider = Cesium.createWorldTerrain()

        scene.screenSpaceCameraController.enableCollisionDetection = false;
        globe.translucency.enabled = true
        globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
            450.0,
            0.0,
            900.0,
            1.0
        );
        addTdtMap(viewer, "TDT_IMG_W")
        tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: tileset3dtilesUrl.bimModel[1].url,
                debugShowBoundingVolume: false
            })
        );
        tileset.readyPromise.then((tileset) => {
            tilesetMat = update3dtilesMaxtrix(tileset, params)
            tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT;
            // viewer.camera.flyTo({
            //     destination: Cesium.Cartesian3.fromDegrees(119.0863200518221, 32.26306790366665, 141.07604784710622),
            //     orientation: {
            //         heading: Cesium.Math.toRadians(356.4567557519004),
            //         pitch: Cesium.Math.toRadians(-15),
            //         roll: 6.282986978306287
            //     }
            // });
            // console.log('Maximum building height: ' + tileset.properties.height.maximum);
            // console.log('Minimum building height: ' + tileset.properties.height.minimum);
            viewer.zoomTo(tileset)
            tileset.tileVisible.addEventListener(function (tile) {
                content = tile.content
                let featuresLength = content.featuresLength;
                for (let i = 0; i < featuresLength; i++) {
                    let featureName = content.getFeature(i).getProperty('name')
                    let featureFile = content.getFeature(i).getProperty('file')
                    if (tilesetIdMap.has(featureName) == false) {
                        tilesetIdMap.set(featureName, featureFile)
                    }
                }
            });
        })
        //BimTree
        fetch(tileset3dtilesUrl.bimModel[1].sceneTree)
            .then((response) => {
                return response.json();
            }).then((myJson) => {
                console.log(myJson.scenes)
                let bimData = tree(myJson.scenes)
                this.setState({
                    modelTree: bimData
                })
                console.log(bimMap)
            });

    }
    onSelect(selectedKeys, info) {
        let key = info.node.props.eventKey
        getFeatures(key, tileset)
        //console.log("onSelect: " + key)
    }

    onCheck(checkedKeys, info) {
        let key = info.node.props.eventKey
        //console.log("onCheck: " + key)
    }
    render() {
        let modelTree = this.state.modelTree
        return (
            <div>
                <div className="map-image" ref="map" id="cesiumContain">
                    <div className="treeStyleBox">
                        {modelTree ? <Tree
                            onSelect={this.onSelect.bind(this)}
                            onCheck={this.onCheck.bind(this)}
                        >
                            {modelTree}
                        </Tree> : "loading..."}
                    </div>
                </div>
            </div>
        );
    }
}

const tree = (data) => {
    let arr = []
    for (let i = 0; i < data.length; i++) {
        bimMap.set(data[i].name, data[i].sphere)
        if (data[i].children == undefined) {
            //去除无用字符
            if (data[i].name.indexOf("ColladaAutoName") == -1) {
                arr.push(
                    <TreeNode title={data[i].name} key={data[i].name}></TreeNode>
                )
            }
        } else {
            arr.push(
                <TreeNode title={data[i].name} key={data[i].name}>
                    {tree(data[i].children)}
                </TreeNode>
            )

        }
    }
    return arr
}

const getFeatures = (id, tileset) => {
    let nodesphere = bimMap.get(id)
    if (nodesphere != undefined) {
        let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2]);
        //原来的矩阵的逆
        let orginMatrixInverse = Cesium.Matrix4.inverse(tilesetMat[0], new Cesium.Matrix4());
        let mat = Cesium.Matrix4.multiply(tileset._root.transform, orginMatrixInverse, new Cesium.Matrix4());
        center = Cesium.Matrix4.multiplyByPoint(mat, center, new Cesium.Cartesian3());
        let sphere = new Cesium.BoundingSphere(center, nodesphere[3]);
        viewer.camera.flyToBoundingSphere(sphere, {
            duration: 0.5
        });
    }

    tileset.tileVisible.addEventListener(function (tile) {
        content = tile.content
        let featuresLength = content.featuresLength;
        for (let i = 0; i < featuresLength; i++) {
            content.getFeature(i).color = new Cesium.Color(0.9, 0.9, 0.9, 0.3)
            if (content.getFeature(i).getProperty('name') == id) {
                let feature = content.getFeature(i)
                feature.show = true
                feature.color = Cesium.Color.RED
            }
        }
    });
}

export default Maps