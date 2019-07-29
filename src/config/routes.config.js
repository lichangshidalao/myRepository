import React, { Component } from 'react';
import Maps from '../containers/component/Map';
import Tdt from "../containers/component/Tdt";
import Terrain from "../containers/component/Terrain";
import BingMap from "../containers/component/BingMap";
import SceneCover from "../containers/component/SceneCover";
import BillboardLabel from "../containers/component/BillboardLabel";
import Tileset3dtiles from "../containers/component/Tileset3dtiles";
import IonExample from "../containers/component/IonExample";
import TilesetStyle from "../containers/component/TilesetStyle"
import TransformTileset from "../containers/component/TransformTileset";
import DrawEntity from "../containers/component/DrawEntity"
import Shangdi from "../containers/component/Shangdi"
import DataSources from "../containers/component/DataSources"
import BaiduModel from "../containers/component/BaiduModel"
import Flooding from "../containers/component/Flooding"
import Weather from "../containers/component/Weather"
import Plane from "../containers/component/Plane"
import ShadowAnalyis from "../containers/component/ShadowAnalyis"
import CustomizeDiv from "../containers/component/CustomizeDiv"
import EchartCesium from "../containers/component/EchartCesium"
import SelectionInquire from "../containers/component/SelectionInquire"
import Shigongmoni from "../containers/component/shigongmoni"
import Layermanage from "../containers/component/LayerManage"
import Webglbase from "../containers/component/Webglbase"
import Webglbase_02 from "../containers/component/Webglbase_02"
import PolyM from "../containers/component/PolyM"
import PolyLines from "../containers/component/PolyLines"
import PropertyExample from "../containers/component/PropertyExample"
import BimModel from "../containers/component/BimModel"
import CircleScan from "../containers/component/CircleScan"
import RadarScan from "../containers/component/RadarScan"
import DynamicDiv from "../containers/component/DynamicDiv"
import xingneng from "../containers/component/xingneng"
import Water from "../containers/component/Water"
import EchartsFly from "../containers/component/EchartsFly"

const ROUTERS = [
    {
        key: '1',
        link: '/',
        iconType: 'home',
        text: 'Helloworld My Workstation',
        component: Maps,
        type: 'item',
        child: [],
        disabled: false
    },
    {
        key: 'sub1',
        iconType: 'global',
        text: '图层',
        type: 'SubMenu',
        disabled: false,
        child: [
            {
                key: 'Tdt',
                link: '/Tdt',
                text: '天地图',
                component: Tdt,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Terrain',
                link: '/Terrain',
                text: '地形',
                component: Terrain,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'BingMap',
                link: '/BingMap',
                text: 'BingMap',
                component: BingMap,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    },
    {
        key: 'sub2',
        iconType: 'crown',
        text: 'PostProcessStage',
        type: 'SubMenu',
        disabled: false,
        child: [
            {
                key: 'SceneCover',
                link: '/SceneCover',
                text: '场景蒙皮',
                component: SceneCover,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Weather',
                link: '/Weather',
                text: '天气特效',
                component: Weather,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'PolyM',
                link: '/PolyM',
                text: '流动线',
                component: PolyM,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'PolyLines',
                link: '/PolyLines',
                text: '10w 流动线',
                component: PolyLines,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'CircleScan',
                link: '/CircleScan',
                text: '圆形放大扫描',
                component: CircleScan,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'RadarScan',
                link: '/RadarScan',
                text: '雷达扫描',
                component: RadarScan,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Water',
                link: '/Water',
                text: '水面纹理',
                component: Water,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    },
    {
        key: 'sub3',
        iconType: 'gift',
        text: 'Entity + echarts',
        type: 'SubMenu',
        disabled: false,
        child: [
            {
                key: 'BillboardLabel',
                link: '/BillboardLabel',
                text: 'BillboardLabel',
                component: BillboardLabel,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'DrawEntity',
                link: '/DrawEntity',
                text: 'DrawEntity',
                component: DrawEntity,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'DataSources',
                link: '/DataSources',
                text: 'DataSources',
                component: DataSources,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'CustomizeDiv',
                link: '/CustomizeDiv',
                text: '自定义标签',
                component: CustomizeDiv,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'EchartCesium',
                link: '/EchartCesium',
                text: '整合echarts',
                component: EchartCesium,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'EchartsFly',
                link: '/EchartsFly',
                text: '飞行图',
                component: EchartsFly,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'SelectionInquire',
                link: '/SelectionInquire',
                text: '框选查询',
                component: SelectionInquire,
                type: 'item',
                child: [],
                disabled: true
            },
            {
                key: 'DynamicDiv',
                link: '/DynamicDiv',
                text: '自定义柱体弹窗',
                component: DynamicDiv,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    },
    {
        key: 'sub4',
        iconType: 'build',
        text: '3dtiles',
        type: 'SubMenu',
        disabled: false,
        child: [
            {
                key: 'Tileset3dtiles',
                link: '/Tileset3dtiles',
                text: '3dtilesExample',
                component: Tileset3dtiles,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'IonExample',
                link: '/IonExample',
                text: 'IonExample',
                component: IonExample,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'TilesetStyle',
                link: '/TilesetStyle',
                text: '样式设置',
                component: TilesetStyle,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'TransformTileset',
                link: '/TransformTileset',
                text: '位置调整',
                component: TransformTileset,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Plane',
                link: '/Plane',
                text: '剖切',
                component: Plane,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    },
    {
        key: 'sub5',
        iconType: 'radar-chart',
        text: '综合',
        type: 'SubMenu',
        disabled: false,
        child: [
            {
                key: 'Shangdi',
                link: '/Shangdi',
                text: '上地社区',
                component: Shangdi,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'BaiduModel',
                link: '/BaiduModel',
                text: '百度模式',
                component: BaiduModel,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Flooding',
                link: '/Flooding',
                text: '淹没分析',
                component: Flooding,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'ShadowAnalyis',
                link: '/ShadowAnalyis',
                text: '阴影分析',
                component: ShadowAnalyis,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Shigongmoni',
                link: '/Shigongmoni',
                text: '施工模拟',
                component: Shigongmoni,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'BimModel',
                link: '/BimModel',
                text: 'BIM树',
                component: BimModel,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Layermanage',
                link: '/Layermanage',
                text: '图层管理',
                component: Layermanage,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'PropertyExample',
                link: '/PropertyExample',
                text: 'PropertyExample',
                component: PropertyExample,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'xingneng',
                link: '/xingneng',
                text: '性能测试',
                component: xingneng,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    },
    {
        key: 'sub6',
        iconType: 'credit-card',
        text: 'webgl',
        type: 'SubMenu',
        disabled: true,
        child: [
            {
                key: 'Webglbase',
                link: '/Webglbase',
                text: '点 线 三角',
                component: Webglbase,
                type: 'item',
                child: [],
                disabled: false
            },
            {
                key: 'Webglbase_02',
                link: '/Webglbase_02',
                text: '渐变三角 图片纹理',
                component: Webglbase_02,
                type: 'item',
                child: [],
                disabled: false
            }
        ]
    }
]

export { ROUTERS }