import React from 'react'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Input, Space, Button, message } from 'antd';
import styles from "./login.module.scss"
import ParticlesBg from 'particles-bg'
import axios from 'axios';


export default function Login() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigateTo = useNavigate()
  

  function usernameChange(event){
    setUsername(event.target.value)
  }
  function passwordChange(event){
    setPassword(event.target.value)
  }

  // 点击登录按钮事件
  const userLogin = async () =>{
    console.log(username, password)
    // 验证是否有空值
    if(!username.trim()){
      message.warning("用户名不能为空，请完整输入信息！")
      return
    } else if(!password.trim()) {
      message.warning("密码不能为空，请完整输入信息！")
      return 
    }

    // 发起登录请求
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/user/login',
      data:{
        user_name: username,
        password: password,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      if (res.data.status === 'error')
        message.error(res.data.msg)
      else if (res.data.status === 'success'){
        navigateTo("/home") // 登录成功，跳转主页
        message.success(res.data.msg)
        localStorage.setItem("my-react-django-management-token", res.data.token)
      }
        
    }).catch(function (error) {
      console.log(error)
    })
  }



  return (
    <div>
      {/* 存放背景 */}
      <ParticlesBg type="circle" bg={true} />
      
      {/* 登录盒子 */}
      <div className={styles.loginBox}>
          {/* 标题部分 */}
          <div className={styles.title}>
              <h1>变形监测预警系统</h1>
              <p>用户登录</p>
          </div>
          {/* 表单部分 */}
          <div className="form">
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
              <Input placeholder="用户名" prefix={<UserOutlined />} style={{height: '35px'}}
                onChange={(event)=>usernameChange(event)}
              />
              <Input.Password placeholder="密码" prefix={<LockOutlined />} style={{height: '35px'}}
                onChange={(event)=>passwordChange(event)}
              />
              <Button type="primary" className="loginBtn" block  style={{height: '35px'}}
              onClick={()=>userLogin()}>
                登录
              </Button>
            </Space>
          </div>
          <div className={styles.footer}><span>Copyright©2023  Mr.jiang  版权所有</span></div>
      </div>
      
    </div>
  )
}
