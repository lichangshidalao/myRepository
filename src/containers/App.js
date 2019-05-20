import React, { Component } from 'react';
import BuildModuleUrl from 'cesium/Core/buildModuleUrl';
import './App.less';
import 'cesium/Widgets/widgets.css';
import { Layout, Menu, Icon } from 'antd';
import { BrowserRouter, Link } from 'react-router-dom';
import { Contents, MenuItems } from "../config/menu.config";
BuildModuleUrl.setBaseUrl('./');



const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Layout>
                    <Sider width={256} style={{ minHeight: '100vh' }}>
                        {/* <div style={{ height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px' }}>LcWorkstation</div> */}
                        <MenuItems></MenuItems>
                    </Sider>
                    <Layout >
                        <Content>
                            <div style={{ padding: 24, background: '#fff' }}>
                                <Contents></Contents>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center'}}>Li Chang ©2019 Created by Ant React Cesium</Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}
export default App;
