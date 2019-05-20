import Cesium from "cesium/Cesium";
const add3dtiles = (viewer, url, focus = true) => {
    const scene = viewer.scene
    const tileset = scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url,
            debugShowBoundingVolume: false
        })
    );
    tileset.readyPromise.then((tileset) => {
        focus ? viewer.flyTo(tileset, { offset: new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0) }) : console.log(focus)
    })
    return tileset
}

export default add3dtiles