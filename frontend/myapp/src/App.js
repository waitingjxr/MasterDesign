import React, { useEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import routes from './router/router'
import { message } from 'antd'

// 去往登录页面的组件
function ToLogin(){
  const navigateTo = useNavigate()
  useEffect(()=>{
    // 加载完这个组件执行这里的代码
    navigateTo("/login")
    message.warning("您还没有登录，请登录后再访问！")
  }, [])
  return <div></div>
}


// 去往首页的组件
function ToHome(){
  const navigateTo = useNavigate()
  useEffect(()=>{
    // 加载完这个组件执行这里的代码
    navigateTo("/home")
    message.warning("您已经登录过了！")
  }, [])
  return <div></div>
}

function BeforeReouterEnter(){
  const outlet = useRoutes(routes)
  
  let token = localStorage.getItem('my-react-django-management-token')

  const location = useLocation()

  // // 如果访问的url是登录页面，并且有token，跳转到首页
  // if(location.pathname === '/login' && token){
  //   return <ToHome/>
  // }
  // // 如果访问的url不是登录页面，并且没有token，跳转到登录页面
  // if(location.pathname !== '/login' && !token){
  //   return <ToLogin/>
  // }

  return outlet
}

export default function App() {
  
  return (
      <BeforeReouterEnter/>
  )
}