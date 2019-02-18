import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { ROUTERS } from './routes.config';

const Routers = [...ROUTERS]
const SubMenu = Menu.SubMenu;
const Contents = () => {
    const contentArray = []
    for (let i in Routers) {
        if (Routers[i].type === 'item') {
            contentArray.push(
                <Route exact key={'Routers' + Routers[i]} path={Routers[i].link} component={Routers[i].component} />
            )
        } else if (Routers[i].type === 'SubMenu') {
            const childContent = Routers[i].child
            for (let j in childContent) {
                contentArray.push(
                    <Route exact key={'Routers' + childContent[j].key} path={childContent[j].link} component={childContent[j].component} />
                )
            }
        }
    }
    return (
        <Switch>
            {contentArray}
        </Switch>
    )
}

class MenuItems extends Component {
    constructor() {
        super()
    }
    render() {
        const menuArray = []
        for (let i in Routers) {
            if (Routers[i].type === 'item') {
                menuArray.push(
                    <Menu.Item key={Routers[i].key}>
                        <Link to={Routers[i].link}>
                            <Icon type={Routers[i].iconType} />
                            <span>{Routers[i].text}</span>
                        </Link>
                    </Menu.Item>
                )
            } else if (Routers[i].type === 'SubMenu') {
                const itemArray = []
                const ContentsChild = Routers[i].child
                for (let j in ContentsChild) {
                    itemArray.push(
                        <Menu.Item key={ContentsChild[j].key}><Link to={ContentsChild[j].link}>{ContentsChild[j].text}</Link></Menu.Item>
                    )
                }
                menuArray.push(
                    <SubMenu
                        key={Routers[i].key}
                        title={<span><Icon type={Routers[i].iconType} /><span>{Routers[i].text}</span></span>}
                    >
                        {itemArray}
                    </SubMenu>
                )
            }
        }
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {menuArray}
            </Menu>
        )
    }
}


export { Contents, MenuItems }