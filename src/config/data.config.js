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
        },
        {
            "name": "wuhan",
            "url": "http://localhost:8080/Apps/SampleData/wuhan/tileset.json"
        }

    ],
    "bimModel": [
        {
            "id":1,
            "name": "B2-BIM",
            "url": "http://localhost:8080/Apps/SampleData/B2-BIM/tileset.json"
        },
        {
            "id":2,
            "name": "扬州污水场",
            "url": "http://localhost:8080/Apps/SampleData/ws/tileset.json",
            "sceneTree":"http://localhost:8080/Apps/SampleData/ws/scenetree.json"
        },
        {
            "id":3,
            "name": "精简污水场",
            "url": "http://localhost:8080/Apps/SampleData/jingjian_ws/jingjian_ws/tileset.json"
        },
        {
            "id":4,
            "name": "污水场-2",
            "url": "http://localhost:8080/Apps/SampleData/ws3/ws/tileset.json"
        },
        {
            "id":5,
            "name": "组合池",
            "url": "http://localhost:8080/Apps/SampleData/model_2_15/tileset.json"
        },
        {
            "id":6,
            "name": "球",
            "url": "http://localhost:8080/Apps/SampleData/ball/tileset.json"
        },
        {
            "id":7,
            "name": "老港",
            "url": "http://localhost:8080/Apps/SampleData/laogang_tilt/tileset.json"
        },
        {
            "id":8,
            "name": "BIMT",
            "url": "http://localhost:8080/Apps/SampleData/bimT/tileset.json"
        },
        {
            "id":9,
            "name": "精简老港模型",
            "url": "http://localhost:8080/Apps/SampleData/laogang/tileset.json",
            "sceneTree":"http://localhost:8080/Apps/SampleData/laogang/scenetree.json"
        },
        {
            "id":10,
            "name": "精简老港模型2",
            "url": "http://localhost:8080/Apps/SampleData/laogangwaike/tileset.json",
            "sceneTree":"http://localhost:8080/Apps/SampleData/laogangwaike/scenetree.json"
        },
        {
            "id":11,
            "name": "精简老港模型",
            "url": "http://localhost:8080/Apps/SampleData/jichang/tileset.json",
            "sceneTree":"http://localhost:8080/Apps/SampleData/laogangwaike/scenetree.json"
        },
        {
            "id":12,
            "name": "daxing",
            "url": "http://localhost:8080/Apps/SampleData/ssa/tileset.json",
            "sceneTree":"http://localhost:8080/Apps/SampleData/ssa/scenetree.json"
        },
        {
            "id":13,
            "name": "daxing2",
            "url": "172.16.108.203:9002/api/folder/3c744bce08944c1eaa556a425010e55e"
        },
        {
            "id":14,
            "name": "shanxia",
            "url": "http://localhost:8080/Apps/SampleData/shanxia/tileset.json"
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
const AMAP_CONFIG = {
    Vector: "http://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}",
    Road: "http://wprd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11",
    Label: "http://wprd04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=12",
    Img: "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
}


//model url 
const model_config = {
    //等高线
    contour: "http://localhost:8080/Apps/SampleData/rainier-countours.geojson",
    beijing: "http://localhost:8080/Apps/SampleData/beijing.json"
}

//tree data
const tree_config = [
    {
        "key": "0-0",
        "title": "地图底图",
        "children": [
            // {
            //     "key": "0-0-0",
            //     "title": "天地图影像",
            //     "children": []
            // },
            {
                "key": "0-0-1",
                "title": "天地图矢量",
                "children": [
                ]
            },
            {
                "key": "0-0-2",
                "title": "高德矢量",
                "children": [
                ]
            },
            {
                "key": "0-0-6",
                "title": "高德影像",
                "children": [
                ]
            },
            // {
            //     "key": "0-0-3",
            //     "title": "天地图标注",
            //     "children": [
            //     ]
            // },
            {
                "key": "0-0-4",
                "title": "road",
                "children": [
                ]
            },
            {
                "key": "0-0-5",
                "title": "label",
                "children": [
                ]
            }
        ]
    },
    {
        "key": "0-1",
        "title": "三维模型",
        "children": [
            {
                "key": "0-1-0",
                "title": "污水场",
                "children": [
                ]
            },
            {
                "key": "0-1-1",
                "title": "保利倾斜摄影",
                "children": [
                ]
            },
            {
                "key": "0-1-2",
                "title": "纽约city",
                "children": [
                ]
            }
        ]
    }
]
export { tileset3dtilesUrl, ion_Token, TDTURL_CONFIG, model_config, tree_config, AMAP_CONFIG }