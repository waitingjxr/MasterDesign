import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function RadarMonitor() {

  // 通过useSelector获取store仓库数据
  const {user_name, password} = useSelector((state) => ({
    user_name: state.handleUser.user_name,
    password: state.handleUser.password
  }))

  // 修改store仓库数据
  const dispatch = useDispatch()

  const login = () => {
    dispatch({type:'login'})
  }

  return (
    <div style={{ margin: '20px 0 0 30px' }}>
      雷达监测
      <button onClick={login}>登录按钮</button>
      <p>用户名:{user_name}</p>
      <p>密码:{password}</p>
    </div>
  )
}
