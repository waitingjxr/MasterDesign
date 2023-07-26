import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message, Input, Form } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function UserAdmin() {
  const [dataSource, setDataSource] = useState([])  // 用户列表数据

  const [isModal1Open, setIsModal1Open] = useState(false);  // 添加用户对话框
  const [isModal2Open, setIsModal2Open] = useState(false);  // 删除角色对话框
  const [isModal3Open, setIsModal3Open] = useState(false);  // 编辑用户对话框


  const [form_add] = Form.useForm()
  const [form_edit] = Form.useForm()

  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center'
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            {/* 删除用户 */}
            <Button danger shape='circle' icon={<DeleteOutlined/>}
              onClick={showDeleteModal} />
            <Modal title="Tips" open={isModal2Open} onOk={()=>handleDeleteOk(record)} onCancel={handleDeleteCancel}>
              <p>您确定要删除该用户吗？</p>
            </Modal>
            &nbsp;&nbsp;&nbsp;
            {/* 编辑用户 */}
            <Button  type='primary' shape="circle" icon={<EditOutlined/>}
              onClick={()=>showEditModal(record)}/>
            <Modal title="编辑用户" open={isModal3Open} footer={null} onCancel={handleEditCancel} >
              <Form name="basic" labelCol={{ span: 4, }} wrapperCol={{ span: 16, }} autoComplete="off"
                style={{ maxWidth: '1000px', marginTop:"30px"}} initialValues={{ remember: true, }} 
                onFinish={()=>editUser(record)} form={form_edit}>
                <Form.Item label="用户名" name="edit_user_name">
                  <Input />
                </Form.Item>
                <Form.Item label="密码" name="edit_password">
                  <Input.Password />
                </Form.Item>
                <Form.Item label="角色" name="edit_role_name">
                  <Input />
                </Form.Item>
                <Form.Item label="邮箱" name="edit_user_email">
                  <Input />
                </Form.Item>
                <Form.Item label="公司单位" name="edit_user_company">
                  <Input />
                </Form.Item>
                <Form.Item label="联系电话" name="edit_user_mobile">
                  <Input />
                </Form.Item>
                <Form.Item label="备注" name="edit_note">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 16, }} >
                  <Button type="primary" htmlType="submit">添加</Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )
      }
    },
  ]

  useEffect(()=>{
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/user/queryAll', // 查询所有用户
      params:{},
    }).then(function (res) {
      setDataSource(res.data)
    }).catch(function (error) {
      message.error(error)
    })
  }, [])

  // 显示删除用户对话框
  const showDeleteModal = () => {
    setIsModal2Open(true);
  };

  // 确定删除用户
  const handleDeleteOk = (record) => {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/user/delete', // 删除角色
      params: {
        id: record.id
      },
    }).then(function (res) {
      if (res.data === true){
        axios({
          method: 'get',
          url: 'http://127.0.0.1:8000/api/user/queryAll', // 查询所有角色
          params:{},
        }).then(function (res) {
          setDataSource(res.data)
        }).catch(function (error) {
          message.error(error)
        })
        setIsModal2Open(false);
        message.success("删除成功")
      }else{
        setIsModal2Open(false);
        message.error("删除失败！")
      }
    }).catch(function (error) {
      message.error(error)
    })
    
  };

  // 取消删除用户或者关闭删除用户对话框
  const handleDeleteCancel = () => {
    setIsModal2Open(false);
  };

  // 显示添加用户对话框
  const showAddModal = () => {
    setIsModal1Open(true);
  };

  // 关闭添加用户对话框
  const handleAddCancel = () => {
    setIsModal1Open(false);
    form_add.resetFields()
  };

  // 添加用户
  const addUser = (values) => {
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/user/add',
      data:{
        user_name: values.user_name,
        password: values.password,
        role_name: values.role_name,
        user_email: values.user_email,
        user_company: values.user_company,
        user_mobile: values.user_mobile,
        note: values.note
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      if (res.data.status === 'success'){
        axios({
          method: 'get',
          url: 'http://127.0.0.1:8001/api/user/queryAll', // 查询所有用户
          params:{},
        }).then(function (res) {
          setDataSource(res.data)
        }).catch(function (error) {
          message.error(error)
        })
        setIsModal1Open(false);
        form_add.resetFields()
        message.success(res.data.msg)
      }else if (res.data.status === 'error')
        message.error(res.data.msg)
    }).catch(function (error) {
      message.error(error)
    })
  };

  // 显示编辑用户对话框
  const showEditModal = (record) => {
    let showEditData = dataSource.filter(function (_data){return _data.id === record.id})[0]
    form_edit.setFieldsValue({
      edit_user_name: showEditData.user_name,
      edit_password: showEditData.password,
      edit_role_name: showEditData.role_name,
      edit_user_email: showEditData.user_email,
      edit_user_company: showEditData.user_company,
      edit_user_mobile: showEditData.user_mobile,
      edit_note: showEditData.note
    })
    setIsModal3Open(true);
  }

  // 取消编辑用户或者关闭编辑用户对话框
  const handleEditCancel = () => {
    setIsModal3Open(false);
  }

  // 编辑用户
  const editUser = (record) => {
    let eidtData = form_edit.getFieldsValue()
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/user/modify',
      data:{
        user_name: eidtData.edit_user_name,
        password: eidtData.edit_password,
        role_name: eidtData.edit_role_name,
        user_email: eidtData.edit_user_email,
        user_company: eidtData.edit_user_company,
        user_mobile: eidtData.edit_user_mobile,
        note: eidtData.edit_note
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      if(res.data === 'success'){
        setIsModal3Open(false);
        message.success("修改成功")
      }
    }).catch(function (error){
      message.error(error)
    })
  }

  return (
    <div style={{ margin: '20px 0 0 30px', width:"700px"}}>
      <Button type="primary" onClick={showAddModal}>添加用户</Button>
      <Modal title="新增用户" open={isModal1Open} footer={null} onCancel={handleAddCancel} >
        <Form name="basic" labelCol={{ span: 4, }} wrapperCol={{ span: 16, }} autoComplete="off"
          style={{ maxWidth: '1000px', marginTop:"30px"}} initialValues={{ remember: true, }} 
          onFinish={addUser} form={form_add}>
          <Form.Item label="用户名" name="user_name">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="角色" name="role_name">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="user_email">
            <Input />
          </Form.Item>
          <Form.Item label="公司单位" name="user_company">
            <Input />
          </Form.Item>
          <Form.Item label="联系电话" name="user_mobile">
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 16, }} >
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={dataSource} columns={columns} style={{ margin: '20px 0 0 0', width:"700px"}}
        rowKey={(record) => record.id}>

      </Table>
    </div>
  )
}
