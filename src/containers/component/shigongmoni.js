import React, { Component } from 'react';
import viewerInit from "../CesiumViewer/viewer";
import XLSX from 'xlsx';
//const viewer
class Map extends Component {
    constructor() {
        super()
        this.state = {}
    }
    componentDidMount() {
        viewerInit(this.refs.map)
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