import React, { Component } from 'react';
import Cesium from "cesium/Cesium";
import viewerInit from "../CesiumViewer/viewer";
import gifs from "../img/xiaoren.gif"
import { cameraPosition } from "../CesiumViewer/cameraPosition"
import poi from "../img/water.jpg"
//const viewer
class TerrainMap extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        // Create the Cesium Viewer
        const viewer = viewerInit(this.refs.map)
        let htmlOverlay = document.getElementById('testgif');
        let positions = Cesium.Cartesian3.fromDegrees(116.3036888623059, 40.03126771677825, 50);
        viewer.scene.preRender.addEventListener(() => {
            let canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, positions);
            if (Cesium.defined(canvasPosition)) {
                //图片溢出隐藏
                htmlOverlay.style.top = canvasPosition.y + 'px';
                htmlOverlay.style.left = canvasPosition.x + 280 + 'px';
                canvasPosition.y < 24 || canvasPosition.y > 840 ? htmlOverlay.style.display = "none" : htmlOverlay.style.display = "block"
                canvasPosition.x + 280 < 280 || canvasPosition.x + 280 > 1980 ? htmlOverlay.style.display = "none" : htmlOverlay.style.display = "block"
            }
        });
        viewer.scene.camera.flyTo({
            destination: positions,
            complete: () => {
                htmlOverlay.style.display = "block"
                cameraPosition(viewer)
            }
        })

        //使用canvas绘制图片然后通过billboard加载
        const positionBillboard = Cesium.Cartesian3.fromDegrees(116.30477859375455, 40.03122907643513)
        let waters = document.getElementById('waters');
        let erss = init()
        let billboards = viewer.entities.add({
            name: 'Grocery store',
            position: positionBillboard,
            billboard: {
                image: drawCanvas(waters, "testa", 60),
                //image: erss,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
        //viewer.zoomTo(billboards)
    }
    render() {
        return (
            <div>
                <div className="map-image" ref="map" id="cesiumContain">
                </div>
                <img src={gifs} alt="smile" id="testgif" style={{ display: "none", position: "absolute", zIndex: 100, width: "100px", height: "100px" }} />
                <img src={poi} alt="smile" id="waters" style={{ display: "none" }} />
                <canvas id="canvas" width="300" height="300" style={{ display: "block", position: "absolute", zIndex: 100, top: "50px", left: "300px" }}></canvas>
            </div>
        );
    }
}
//根据图片和文字绘制canvas
const drawCanvas = (img, text, fontsize) => {
    const canvas = document.createElement('canvas');      //创建canvas标签
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#99f';
    ctx.font = fontsize + "px Arial";

    canvas.width = ctx.measureText(text).width + fontsize * 2;      //根据文字内容获取宽度
    canvas.height = fontsize * 2; // fontsize * 1.5

    ctx.drawImage(img, fontsize / 2, fontsize / 2, fontsize, fontsize);

    ctx.fillStyle = '#000';
    ctx.font = fontsize + "px Calibri,sans-serif";
    ctx.shadowOffsetX = 1;    //阴影往左边偏，横向位移量
    ctx.shadowOffsetY = 0;   //阴影往左边偏，纵向位移量
    ctx.shadowColor = "#fff"; //阴影颜色
    ctx.shadowBlur = 1; //阴影的模糊范围
    ctx.fillText(text, fontsize * 7 / 4, fontsize * 4 / 3);
    return canvas;
}

var sun = new Image();
var moon = new Image();
var earth = new Image();
function init() {
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    window.requestAnimationFrame(draw);
    return document.getElementById('canvas')
}

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150, 150);

    // Earth
    var time = new Date();
    ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow
    ctx.drawImage(earth, -12, -12);

    // Moon
    ctx.save();
    ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
    ctx.translate(0, 28.5);
    ctx.drawImage(moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(sun, 0, 0, 300, 300);

    window.requestAnimationFrame(draw);
}
export default TerrainMap