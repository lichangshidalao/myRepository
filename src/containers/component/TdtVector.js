import React from 'react';
import * as Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import cameraFlyto from "../CesiumViewer/cameraFlyto";
class MapVector extends React.Component {
  componentDidMount() {
    // Create the Cesium Viewer
    const viewer = viewerInit(this.refs.map)
    viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        layer: "tdtVecBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      })
    )
    viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible"
      })
    );
    let pickhandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    let pickArray = []
    pickhandle.setInputAction((momvent) => {
      let cartesian = viewer.scene.pickPosition(momvent.position)
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height
      pickArray.push(longitudeString)
      pickArray.push(latitudeString)
      pickArray.push(height)
      console.log(pickArray)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    const positions = Cesium.Cartesian3.fromDegrees(116.30370024874621, 40.029712499715885, 1000)
    cameraFlyto(viewer,positions)
  }
  render() {
    return (
      <div className="map-vector" ref="map" />
    );
  }
}

export default MapVector;