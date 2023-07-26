import React from 'react'
import { useState } from 'react'
import { Menu } from 'antd'
import {
  BorderOuterOutlined,
  FileTextOutlined,
  SettingOutlined,
  PieChartOutlined,
  BorderInnerOutlined,
  UnorderedListOutlined,
  LineChartOutlined,
  UserOutlined,
  RobotFilled,
  DotChartOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'


function getItem(
  label,
  key,
  icon,
  children,
) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  
  getItem('矿区实景图', '/home/hg_map', <PieChartOutlined />),
  getItem('表面位移监测', 'bmwy_monitor', <BorderOuterOutlined />, [
    getItem('位移变化趋势图', '/home/bmwy_monitor/wyChange_chart', <LineChartOutlined />),
    getItem('平面矢量图', '/home/bmwy_monitor/planar_vector', <DotChartOutlined />),
    getItem('平面等值图', '/home/bmwy_monitor/planar_contour', <AreaChartOutlined />),
    getItem('空间位移图', '/home/bmwy_monitor/space_displacement', <DotChartOutlined />),
    getItem('空间曲面图', '/home/bmwy_monitor/space_surface', <AreaChartOutlined />),
    getItem('数据列表', '/home/bmwy_monitor/data_list', <UnorderedListOutlined />),
  ]),
  getItem('内部位移监测', 'nbwy_monitor', <BorderInnerOutlined />, [
    getItem('变化过程线', '/home/nbwy_monitor/changeProcess_line', <LineChartOutlined />),
    getItem('数据列表', '/home/nbwy_monitor/data_list', <UnorderedListOutlined />),
  ]),
  getItem('雷达监测', '/home/radar_monitor', <BorderInnerOutlined />, ),
  getItem('数据导入', '/home/data_load', <FileTextOutlined />),
  getItem('预警模型', '/home/forceWarning_model', <RobotFilled />),
  getItem('系统设置', 'systemSetting', <SettingOutlined />, [
    getItem('报表配置', '/home/settings/table_admin', <UserOutlined />),
    getItem('用户管理', '/home/settings/user_admin', <UserOutlined />),
    getItem('角色管理', '/home/settings/role_admin', <UserOutlined />),
  ]),
];

export default function SliderMenu() {
  let firstOpenKey = "";
  const [openKeys, setOpenKeys] = useState([firstOpenKey])
  const navigateTo = useNavigate()
  const currentRoute = useLocation()

  

  function findKey(obj){
    return obj.key === currentRoute.pathname
  }

  for(let i = 0; i < items.length; i++){
    if(items[i]['children'] && items[i]['children'].length > 0 && items[i]['children'].find(findKey)){
      firstOpenKey = items[i].key
      break
    }
  }

  function menuClick(event){
    navigateTo(event.key)
  }

  function handleOpenChange(keys){
    setOpenKeys([keys[keys.length-1]])
  }

  return (

    <Menu 
      style={{backgroundColor: 'rgb(253, 253, 253)'}}
      defaultSelectedKeys={[currentRoute.pathname]} 
      mode="inline"
      collapsedWidth="40"
      // 侧边栏菜单项数据 
      items={items} 
      // 侧边栏菜单点击事件
      onClick={(event) => menuClick(event)}
      // 侧边栏菜单某项展开和回收事件
      onOpenChange={(keys)=>handleOpenChange(keys)}
      openKeys={openKeys}
      />
  )
}
