class ViewShed {
    constructor(options) {
        this.viewer = options.viewer;
        this.viewPosition = options.viewPosition;
        this.direction = options.direction % 360;
        this.pitch = options.pitch;
        this.horizontalViewAngle = options.horizontalViewAngle || 90;
        this.verticalViewAngle = options.verticalViewAngle || 60;
        this.visibleAreaColor = options.visibleAreaColor || Cesium.Color.GREEN;
        this.invisibleAreaColor = options.invisibleAreaColor || Cesium.Color.RED;
        this.visualRange = options.visualRange || 100;
    }
}

export default ViewShed