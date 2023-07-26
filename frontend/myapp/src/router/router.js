import React from 'react'
import { lazy } from "react"
import { Navigate } from 'react-router-dom'
import HGMap from '../components/home/sliderMenu/HG_Map'
import WYChangeChart from '../components/home/sliderMenu/bmwy_monitor/WYChangeChart'
import PlanarVector from '../components/home/sliderMenu/bmwy_monitor/Planar_Vector'
import PlanarContour from '../components/home/sliderMenu/bmwy_monitor/Planar_Contour'
import SpaceDisplacement from '../components/home/sliderMenu/bmwy_monitor/Space_Displacement'
import SpaceSurface from '../components/home/sliderMenu/bmwy_monitor/Space_Surface'
import BMWYDataList from '../components/home/sliderMenu/bmwy_monitor/datalist/Data_List'
import ChangeLine from '../components/home/sliderMenu/nbwy_monitor/Change_Line'
import NBWYDataList from '../components/home/sliderMenu/nbwy_monitor/datalist/Data_List'
import RadarMonitor from '../components/home/sliderMenu/Radar_Monitor'
import ForceWarnModel from '../components/home/sliderMenu/ForceWarn_Model'
import UserAdmin from '../components/home/sliderMenu/system_settings/User_Admin'
import TableAdmin from '../components/home/sliderMenu/system_settings/Table_Admin'
import DataLoad from '../components/home/sliderMenu/Data_Load'
import RoleAdmin from '../components/home/sliderMenu/system_settings/Role_Admin'



const Home = lazy(()=>import("../components/home/Home"))
const Login = lazy(()=>import("../components/login/Login"))
const Page404 = lazy(()=>import("../components/Page404"))
const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    {comp}
  </React.Suspense>
)


const routes = [

  {
    path: '/',
    element: <Navigate to='/home/hg_map' />
  },
  {
    path: '/login',
    element: withLoadingComponent(<Login />)
  },
  {
    path: '/home',
    element: withLoadingComponent(<Home />),
    children:[
      {
        path: "/home/hg_map",
        element: withLoadingComponent(<HGMap />)
      },
      {
        path: "/home/bmwy_monitor/wyChange_chart",
        element: withLoadingComponent(<WYChangeChart />)
      },
      {
        path: "/home/bmwy_monitor/planar_vector",
        element: withLoadingComponent(<PlanarVector />)
      },
      {
        path: "/home/bmwy_monitor/planar_contour",
        element: withLoadingComponent(<PlanarContour />)
      },
      {
        path: "/home/bmwy_monitor/space_displacement",
        element: withLoadingComponent(<SpaceDisplacement />)
      },
      {
        path: "/home/bmwy_monitor/space_surface",
        element: withLoadingComponent(<SpaceSurface />)
      },
      {
        path: "/home/bmwy_monitor/data_list",
        element: withLoadingComponent(<BMWYDataList />)
      },

      {
        path: "/home/nbwy_monitor/changeProcess_line",
        element: withLoadingComponent(<ChangeLine/>)
      },
      {
        path: "/home/nbwy_monitor/data_list",
        element: withLoadingComponent(<NBWYDataList />)
      },
      {
        path: "/home/radar_monitor",
        element: withLoadingComponent(<RadarMonitor/>)
      },
      {
        path: "/home/data_load",
        element: withLoadingComponent(<DataLoad/>)
      },
      {
        path: "/home/forceWarning_model",
        element: withLoadingComponent(<ForceWarnModel/>)
      },
      {
        path: "/home/settings/user_admin",
        element: withLoadingComponent(<UserAdmin/>)
      },
      {
        path: '/home/settings/role_admin',
        element: withLoadingComponent(<RoleAdmin/>)
      },
      {
        path: "/home/settings/table_admin",
        element: withLoadingComponent(<TableAdmin/>)
      }
      
    ]
  },
  {
    path: '*',
    element: <Page404 />
  },


]

export default routes