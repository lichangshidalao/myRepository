import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import Cesium from "cesium/Cesium"

import { tileset3dtilesUrl } from "../../config/data.config";
import { addTdtMap } from "../CesiumViewer/addTdtMap";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";

import { Tree } from 'antd';

const { TreeNode } = Tree;
//const viewer
let params = {
    rx: -90,
    ry: -4,
    rz: 0,
    scale: 1,
    tx: 119.0910393016583,
    ty: 32.26718715540471,
    tz: 0
}
let cameraParams = {
    0: "119.0863200518221°",
    1: "32.26306790366665°",
    2: "141.07604784710622米",
    3: "356.4567557519004°",
    4: -0.3349924376770179,
    5: 6.282986978306287,
}
let viewer, tileset, tilesetIdMap = new Map(), content, silhouetteBlue
class Maps extends Component {
    constructor() {
        super()
        this.state = {
            modelTree: null
        }
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        addTdtMap(viewer, "TDT_VEC_W")
        tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: tileset3dtilesUrl.bimModel[1].url,
                debugShowBoundingVolume: false
            })
        );
        tileset.readyPromise.then((tileset) => {
            update3dtilesMaxtrix(tileset, params)
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(119.0863200518221, 32.26306790366665, 141.07604784710622),
                orientation: {
                    heading: Cesium.Math.toRadians(356.4567557519004),
                    pitch: Cesium.Math.toRadians(-15),
                    roll: 6.282986978306287
                }
            });
            console.log('Maximum building height: ' + tileset.properties.height.maximum);
            console.log('Minimum building height: ' + tileset.properties.height.minimum);
            //viewer.zoomTo(tileset)
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
        silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
        silhouetteBlue.uniforms.length = 0.01;
        silhouetteBlue.selected = [];
        viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue]));
        setTimeout(() => {
            //console.log(tilesetIdMap)
            let trees = tree(tilesetIdMap)
            this.setState({
                modelTree: trees
            })
            // console.log(trees)
        }, 10000);
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
                            className="treeStyle"
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
    const fatherIdSet = new Set([...data.values()])
    let fatherId = [...fatherIdSet]
    //console.log(fatherId)
    for (let i of fatherId) {
        arr.push(
            <TreeNode title={<span>{i}</span>} key={i}>
                {
                    treechild(i, data)
                }
            </TreeNode>
        )
    }
    return arr
}
const treechild = (id, data) => {
    let arr = []
    let childId = [...data.keys()]
    for (let j of childId) {
        if (id == data.get(j)) {
            arr.push(
                <TreeNode title={j} key={j}></TreeNode>
            )
        }
    }
    return arr
}
const getFeatures = (id, tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
        content = tile.content
        let featuresLength = content.featuresLength;
        for (let i = 0; i < featuresLength; i++) {
            content.getFeature(i).color = new Cesium.Color(0.9, 0.9, 0.9, 0.1)
            if (content.getFeature(i).getProperty('name') == id) {
                let feature = content.getFeature(i)
                feature.show = true
                feature.color = Cesium.Color.RED
                console.log(feature.tileset.properties)
                silhouetteBlue.selected = [feature]
            }
        }
    });
}

function offsetFromHeadingPitchRange(heading, pitch, range) {
    pitch = Cesium.Math.clamp(pitch, -Cesium.Math.PI_OVER_TWO, Cesium.Math.PI_OVER_TWO);
    heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

    let pitchQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, -pitch);
    let headingQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -heading);
    let rotQuat = Cesium.Quaternion.multiply(headingQuat, pitchQuat, headingQuat);
    let rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

    let offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
    Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
    Cesium.Cartesian3.negate(offset, offset);
    Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
    return offset;
}

export default Maps