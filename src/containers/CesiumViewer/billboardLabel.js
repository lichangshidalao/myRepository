import Cesium from "cesium/Cesium";
import poi from "../img/poi.png"

console.log(Cesium)
const pinBuilder = new Cesium.PinBuilder();
const positions = Cesium.Cartesian3.fromDegrees(116.30556276328068, 40.02850674067971)
const billboardLabelPin = (viewer, position = positions, texts = "this is pin") => {
    const entitys = viewer.entities.add({
        position: position,
        billboard: {
            image: pinBuilder.fromText('?', Cesium.Color.BLACK, 48).toDataURL(),
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 2000),
            pixelOffset: new Cesium.Cartesian2(0, -25),
        },
        label: {
            backgroundColor: new Cesium.Color(0, 0, 0, 0),
            showBackground: true,
            //font: "14px sans-serif",
            text: texts,
            fillColor: Cesium.Color.SKYBLUE,
            pixelOffset: new Cesium.Cartesian2(0, -80),
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 2000)
        }
    })
    return entitys
}
const billboardLabelImage = (viewer, position = positions, url = poi, texts = "this is image") => {
    const entitys = viewer.entities.add({
        position: position,
        billboard: {
            image: url,
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 2000),
            pixelOffset: new Cesium.Cartesian2(0, -25),
        },
        label: {
            backgroundColor: new Cesium.Color(0, 0, 0, 0),
            showBackground: true,
            //font: "14px sans-serif",
            text: texts,
            fillColor: Cesium.Color.SKYBLUE,
            pixelOffset: new Cesium.Cartesian2(0, -80),
            //scaleByDistance: new Cesium.NearFarScalar(200, 2, 700, 0.5),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 2000)
        }
    })
    return entitys
}


export { billboardLabelPin, billboardLabelImage }