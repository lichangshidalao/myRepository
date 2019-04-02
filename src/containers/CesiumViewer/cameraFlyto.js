import Cesium from "cesium/Cesium";
import { getLonLat } from "../CesiumViewer/getLonLat";
let positions = Cesium.Cartesian3.fromDegrees(-73.98580932617188, 40.74843406689482, 363.34038727246224)
let headings = Cesium.Math.toRadians(0)
let pitchs = Cesium.Math.toRadians(-90.0)
const cameraFlyto = (viewer, positon = positions, height = 1000, heading = headings, pitch = pitchs) => {
    //const LonLatArray = getLonLat(positon)
    const [lon, lat, het] = getLonLat(positon)
    const camera = viewer.scene.camera;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, het + height),
        complete: function () {
            setTimeout(function () {
                camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, het),
                    orientation: {
                        heading: heading,
                        pitch: pitch
                    },
                    easingFunction: Cesium.EasingFunction.LINEAR_NONE
                });
            }, 1000);
        }
    });
}

export default cameraFlyto