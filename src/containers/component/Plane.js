import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import { tileset3dtilesUrl } from "../../config/data.config";
import add3dtiles from "../CesiumViewer/3dtiles/add3dtiles";
import { update3dtilesMaxtrix } from "../CesiumViewer/3dtiles/transformTileset";
import { getLonLat } from "../CesiumViewer/getLonLat";
import { Select } from 'antd';
import './viewer.css';


//const viewer
const Option = Select.Option;
let viewer, tileset, scene

class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewer = viewerInit(this.refs.map)
        scene = viewer.scene
        tileset = add3dtiles(viewer, tileset3dtilesUrl.bimModel[1].url)
        tileset.readyPromise.then(() => {
            const clippingPlanes = new Cesium.ClippingPlaneCollection({
                modelMatrix: tileset.modelMatrix,
                planes: [
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), -100.0),
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), -100.0),
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), -100.0),
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), -100.0)
                ],
                enabled: true,
                edgeColor: Cesium.Color.WHITE
            });
            tileset.clippingPlanes = clippingPlanes
            for (let i = 0; i < clippingPlanes.length; i++) {
                let plane = clippingPlanes.get(i)
                viewer.entities.add({
                    position: tileset.boundingSphere.center,
                    plane: {
                        dimensions: new Cesium.Cartesian2(100, 100),
                        material: Cesium.Color.WHITE.withAlpha(0.1),
                        //plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(plane), false),
                        plane: plane,
                        outline: true,
                        outlineColor: Cesium.Color.WHITE
                    }
                });
            }
        })
        let selectedPlane
        const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handle.setInputAction((movement) => {
            const pickedObject = scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
                selectedPlane = pickedObject.id.plane;
                viewer.scene.screenSpaceCameraController.enableInputs = false;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
        handle.setInputAction(() => {
            selectedPlane = undefined;
            viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        handle.setInputAction((movement) => {
            if (Cesium.defined(selectedPlane)) {
                let deltaY = movement.startPosition.y - movement.endPosition.y;
                selectedPlane.plane._value.distance += deltaY
                console.log(selectedPlane.plane._value.distance)


            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
    handleChange(value) {

    }
    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <Select defaultValue="Click me" className="bingMapStyle" onChange={this.handleChange}>
                    <Option value="restart">多面剖切</Option>
                    <Option value="confirm">单面剖切</Option>
                </Select>
            </div>
        );
    }
}
export default Map