const login_info = {
  state:{
    user_name: '',
    password: ''
  },
  actions:{
    login(newState, action){
      console.log("用户名:", newState.user_name)
      console.log("密码:", newState.password)
    }
  },

  // 优化redux-thunk的异步写法
  asyncActions:{
    asyncLogin(dispatch){
      setTimeout(()=>{
        dispatch({type:'login'})
      },1000)
    }
  },

  // action名字统一管理
  actionNames:{}
}

let actionNames = {}
for(let key in login_info.actions){
  actionNames[key] = key
}
login_info.actionNames = actionNames

export default login_info