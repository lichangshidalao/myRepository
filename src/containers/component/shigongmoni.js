import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import XLSX from 'xlsx';
import Cesium from "cesium/Cesium"
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        let viewer = viewerInit(this.refs.map)
        var resource = Cesium.Resource.createIfNeeded("../../data/wuhan-car");
        resource.fetchText().then(function (rs) {
            //////////////////////////////////////////
            var animationObj = {
                stepsRange: {
                    start: 0,
                    end: 50
                },
                trails: 20,
                duration: 75
            };

            var _range = animationObj.stepsRange.end - animationObj.stepsRange.start;
            //////////////////////////////////////////
            var entityArray = [];
            var curLineArray = [];

            var linecolor = new Cesium.Color(53 / 255, 57 / 255, 255 / 255, 0.8);
            var outline = new Cesium.Color(65 / 255, 105 / 255, 225 / 255, 0.8);
            var color = new Cesium.Color(255 / 255, 250 / 255, 250 / 255, 0.2);

            rs = rs.split("\n");
            console.log(rs.length);
            var maxLength = 0;

            var proj = new Cesium.WebMercatorProjection();
            var fRatio = 180 / Math.PI;
            var height = 0;

            for (var i = 0; i < rs.length; i++) {
                var item = rs[i].split(',');
                var coordinates = [];
                if (item.length > maxLength) {
                    maxLength = item.length;
                }

                var linePos = [];
                for (j = 0; j < item.length; j += 2) {
                    coordinates.push([item[j], item[j + 1]]);
                    var latlon = new Cesium.Cartographic();
                    var pos = new Cesium.Cartesian3(item[j], item[j + 1], 0);
                    proj.unproject(pos, latlon);

                    var lat = latlon.latitude * fRatio;
                    var lon = latlon.longitude * fRatio;

                    var posGps = GPS.bd_decrypt(lat, lon);
                    var posReal = GPS.gcj_decrypt(posGps.lat, posGps.lon);
                    linePos.push(posReal.lon);
                    linePos.push(posReal.lat);
                    linePos.push(height);

                    var entity = viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(posReal.lon, posReal.lat, height),
                        nameID: j,
                        billboard: {
                            image: './images/c2.png',
                            width: 5,
                            height: 5,
                            color: color
                        }
                    });
                    entity.isAvailable = function (obj) {
                        return function (currentTime) {
                            if (!Cesium.defined(currentTime)) {
                                throw new Cesium.DeveloperError('time is required.');
                            }

                            var nMS = Cesium.JulianDate.toDate(currentTime).getTime() / animationObj.duration;
                            var time = (nMS % _range + animationObj.stepsRange.start);

                            var trails = trails || 10;
                            if (time && obj.nameID > time - trails && obj.nameID < time) {
                                obj.billboard.color._value.alpha = 0.8 * (obj.nameID - time + trails) / trails;
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }(entity);
                    entityArray.push(entity);
                }

                curLineArray[i] = viewer.entities.add({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(linePos),
                        width: 2,
                        material: new Cesium.PolylineOutlineMaterialProperty({
                            color: linecolor,
                            outlineWidth: 0.1,
                            outlineColor: outline
                        })
                    }
                });
            }

            viewer.scene.camera.setView({
                //将经度、纬度、高度的坐标转换为笛卡尔坐标
                destination: Cesium.Cartesian3.fromDegrees(114.2827, 30.4434, 126468)
            });
        }).otherwise(function (error) {
        });
    }
    importExcel(e) {
        var files = e.target.files;
        var name = files.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            console.log("Data>>>" + data);
        };
        reader.readAsBinaryString(files[0]);
    }

    render() {
        return (
            <div className="map-image" ref="map" id="cesiumContain">
                <input className="baiduButton" type="file" id="excel-file" onChange={this.importExcel} />
            </div>
        );
    }
}

export default Map