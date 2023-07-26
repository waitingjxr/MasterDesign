import React, { useState } from 'react';
import { Layout, theme, Dropdown, Space, Avatar  } from 'antd';
import { UserOutlined  } from '@ant-design/icons';
import { Outlet } from 'react-router-dom'
import SliderMenu from './SliderMenu';
import logo from '../../resources/images/logo.webp'
import styles from './home.module.scss'

const { Content, Sider } = Layout;
let token = localStorage.getItem('my-react-django-management-token')

const items = [
  {
    key: '1',
    label: (
      
        token?<a rel="noopener noreferrer" href="http://localhost:3000/login" onClick={(values) => handleExit(values)}>
          退出登录</a>:<a href="http://localhost:3000/login">请登录</a>
    ),
  },
]

const handleExit = (values) => {
  console.log(values)
}

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {token: { colorBgContainer },} = theme.useToken();
  // 获取user_store中的user数据

  // 修改user_store中的user数据 

  return (
    <div>
      
      <div className={styles.home_head}>
        {/* logo */}
        <div className={styles.logo}>
          <img src={logo}  alt='logo' className={styles.img_logo}/>
          <span>变形监测预警系统</span>
        </div>
        {/* 用户头像下拉 */}
        <div>
          <Dropdown menu={{items,}} className={styles.user_login}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar size="large" icon={<UserOutlined />} />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          {/* 左边侧边栏 */}
          <Sider collapsible 
            collapsed={collapsed} 
            collapsedWidth='40' 
            onCollapse={(value) => setCollapsed(value) }
          >
            <SliderMenu />
              
          </Sider>
          {/* 右边内容 */}
          <Layout className="site-layout">
            
            {/* 右边内容 */}
            <Content style={{ minHeight: 360, background: colorBgContainer}}>
              {/* 窗口部分 */}
              
              <Outlet/>
            </Content>
            
          </Layout>
        </Layout>
      </div>
    </div>
  );
}
