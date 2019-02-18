import Cesium from "cesium/Cesium";

const add3dtiles = (viewer, url, focus = true) => {
    const scene = viewer.scene
    const tileset = scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url
        })
    );
    if (focus) {
        tileset.readyPromise.then(function (tileset) {
            //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0));
            viewer.flyTo(tileset, { offset: new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 2.0) })
        }).otherwise(function (error) {
            console.log(error);
        });
    }
    return tileset
}

export default add3dtiles