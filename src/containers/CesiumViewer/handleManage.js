
let handleCollection = []
const createHandle = () => {
    const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handleCollection.push(handle)
    return handle
}

const handleDestory = () => {
    for (let i = 0; i < handleCollection.length; i++) {
        handleCollection[i].destory()
    }
}