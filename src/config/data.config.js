//cesium ion
const ion_Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNTVjZjRlZS1mYTY2LTQyZTAtOWY1Ny1mOWM5MjY0ODE5ZWQiLCJpZCI6NTgzOSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NDQyNjczNn0.KPT4FCM796s36bHKerYvZghrRm-w44uoYYZOOw1y8eY"


//3dtiles url
const tileset3dtilesUrl = {
    "photography": [
        {
            "name": "保利osgb",
            "url": "http://localhost:8080/Apps/SampleData/gis0813/tileset.json"
        }
    ],
    "cityModel": [
        {
            "name": "纽约城市模型",
            "url": "http://localhost:8080/Apps/SampleData/NewYork/tileset.json"
        },
        {
            "name": "重庆项目模型",
            "url": "http://118.244.196.123:84/api/SimpleData/cq_tileset/tileset.json"
        },
        {
            "name": "上地",
            "url": "http://localhost:8080/Apps/SampleData/shangdi/tileset.json"
        }
    ],
    "bimModel": [
        {
            "name": "重庆bim模型",
            "url": "http://localhost:8080/Apps/SampleData/bimnew/1-4-B2/all/structure/tileset.json"
        },
        {
            "name": "扬州污水场",
            "url": "http://localhost:8080/Apps/SampleData/ws/tileset.json"
        },
        {
            "name": "组合池",
            "url": "http://localhost:8080/Apps/SampleData/model_2_15/tileset.json"
        }
    ]
}

//天地图
//天地图URL配置
const tk = "d9230544a38e30b73dd909d981ec9ca8"
const TDTURL_CONFIG = {
    TDT_IMG_W: "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk   //在线天地图影像服务地址(墨卡托投影)
    , TDT_VEC_W: "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk   //在线天地图矢量地图服务(墨卡托投影)
    , TDT_CIA_W: "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default.jpg&tk=" + tk             //在线天地图影像中文标记服务(墨卡托投影)
    , TDT_CVA_W: "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default.jpg&tk=" + tk             //在线天地图矢量中文标记服务(墨卡托投影)
    , TDT_IMG_C: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk   //在线天地图影像服务地址(经纬度)
    , TDT_VEC_C: "http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk   //在线天地图矢量地图服务(经纬度)
    , TDT_CIA_C: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk       //在线天地图影像中文标记服务(经纬度)
    , TDT_CVA_C: "http://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" + tk        //在线天地图矢量中文标记服务(经纬度)
};


//model url 
const model_config = {
    //等高线
    contour: "http://localhost:8080/Apps/SampleData/rainier-countours.geojson",
    beijing:"http://localhost:8080/Apps/SampleData/beijing.json"
}
export { tileset3dtilesUrl, ion_Token, TDTURL_CONFIG, model_config }