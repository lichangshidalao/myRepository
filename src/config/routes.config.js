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


const ROUTERS = [
    {
        key: '1',
        link: '/',
        iconType: 'home',
        text: 'Helloworld My Workstation',
        component: Maps,
        type: 'item',
        child: []
    },
    {
        key: 'sub1',
        iconType: 'global',
        text: '图层',
        type: 'SubMenu',
        child: [
            {
                key: 'Tdt',
                link: '/Tdt',
                text: '天地图',
                component: Tdt,
                type: 'item',
                child: []
            },
            {
                key: 'Terrain',
                link: '/Terrain',
                text: '地形',
                component: Terrain,
                type: 'item',
                child: []
            },
            {
                key: 'BingMap',
                link: '/BingMap',
                text: 'BingMap',
                component: BingMap,
                type: 'item',
                child: []
            }
        ]
    },
    {
        key: 'sub2',
        iconType: 'crown',
        text: 'PostProcessStage',
        type: 'SubMenu',
        child: [
            {
                key: 'SceneCover',
                link: '/SceneCover',
                text: '场景蒙皮',
                component: SceneCover,
                type: 'item',
                child: []
            },
            {
                key: 'Weather',
                link: '/Weather',
                text: '天气特效',
                component: Weather,
                type: 'item',
                child: []
            }
        ]
    },
    {
        key: 'sub3',
        iconType: 'gift',
        text: 'Entity',
        type: 'SubMenu',
        child: [
            {
                key: 'BillboardLabel',
                link: '/BillboardLabel',
                text: 'BillboardLabel',
                component: BillboardLabel,
                type: 'item',
                child: []
            },
            {
                key: 'DrawEntity',
                link: '/DrawEntity',
                text: 'DrawEntity',
                component: DrawEntity,
                type: 'item',
                child: []
            },
            {
                key: 'DataSources',
                link: '/DataSources',
                text: 'DataSources',
                component: DataSources,
                type: 'item',
                child: []
            }
        ]
    },
    {
        key: 'sub4',
        iconType: 'build',
        text: '3dtiles',
        type: 'SubMenu',
        child: [
            {
                key: 'Tileset3dtiles',
                link: '/Tileset3dtiles',
                text: '3dtilesExample',
                component: Tileset3dtiles,
                type: 'item',
                child: []
            },
            {
                key: 'IonExample',
                link: '/IonExample',
                text: 'IonExample',
                component: IonExample,
                type: 'item',
                child: []
            },
            {
                key: 'TilesetStyle',
                link: '/TilesetStyle',
                text: '样式设置',
                component: TilesetStyle,
                type: 'item',
                child: []
            },
            {
                key: 'TransformTileset',
                link: '/TransformTileset',
                text: '位置调整',
                component: TransformTileset,
                type: 'item',
                child: []
            }
        ]
    },
    {
        key: 'sub5',
        iconType: 'radar-chart',
        text: '综合',
        type: 'SubMenu',
        child: [
            {
                key: 'Shangdi',
                link: '/Shangdi',
                text: '上地社区',
                component: Shangdi,
                type: 'item',
                child: []
            },
            {
                key: 'BaiduModel',
                link: '/BaiduModel',
                text: '百度模式',
                component: BaiduModel,
                type: 'item',
                child: []
            },
            {
                key: 'Flooding',
                link: '/Flooding',
                text: '淹没分析',
                component: Flooding,
                type: 'item',
                child: []
            }
        ]
    }
]

export { ROUTERS }