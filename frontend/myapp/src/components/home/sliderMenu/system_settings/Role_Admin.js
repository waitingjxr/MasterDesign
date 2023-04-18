import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message, Input, Form, Tree, Menu } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import styles from './roleAdmin.module.scss'

// 权限列表
const treeData = [
  {
    title: '表面位移监测',
    key: '0',
    children: [
      {
        title: '位移变化趋势图',
        key: '0-0',
      },
      {
        title: '断面曲线图',
        key: '0-1',
      },
      {
        title: '数据列表',
        key: '0-2',
      },
    ],
  },
  {
    title: '内部位移监测',
    key: '1',
    children: [
      {
        title: '变化过程线',
        key: '1-0',
      },
      {
        title: '数据列表',
        key: '1-1',
      },
    ],
  },
  {
    title: '雷达监测',
    key: '2',
  },
  {
    title: '数据导入',
    key: '3',
  },
  {
    title: '预警模型',
    key: '4',
  },
  {
    title: '系统设置',
    key: '5',
    children:[
      {
        title: '报表设置',
        key: '5-1',
      },
      {
        title: '用户管理',
        key: '5-2',
      },
      {
        title: '角色管理',
        key: '5-3',
      },
    ],
  },
]


const items = [
  {
    label: '菜单权限',
    key: 'right_list',
  },
  {
    label: '报警权限',
    key: 'app',
  },
  {
    label: '报警等级',
    key: 'SubMenu',
  },
]

export default function RoleAdmin() {
  const [dataSource, setDataSource] = useState([])  // 角色列表数据
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // 角色添加对话框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // 角色删除对话框
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // 角色编辑对话框

  const [checkedKeys, setCheckedKeys] = useState(['0']);  // 选中复选框的树节点
  const [selectedKeys, setSelectedKeys] = useState([]);  // 设置选中的树节点
  const [autoExpandParent, setAutoExpandParent] = useState(true);  // 是否自动展开父节点

  const [current, setCurrent] = useState('mail');  // 编辑对话框水平导航条当前选中项

  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            {/* 删除按钮 */}
            <Button danger shape='circle' icon={<DeleteOutlined/>}
              onClick={showDeleteModal} />
            <Modal title="Tips" open={isDeleteModalOpen} onOk={()=>handleDeleteRole(record)} 
              onCancel={handleDeleteCancel}>
              <p>您确定要删除该角色吗？</p>
            </Modal>
            &nbsp;&nbsp;&nbsp;
            {/* 编辑按钮 */}
            <Button  type='primary' shape="circle" icon={<EditOutlined/>}
              onClick={showEditModal}/>
            {/* 编辑对话框 */}
            <Modal title="权限管理" open={isEditModalOpen} footer={null} onCancel={closeEditModel}>
            <div className={styles.eidtDialog_menu}>
              <Menu onClick={onCurrentClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
            <div className={styles.eidtDialog_right_content}>
              <div className={styles.eidtDialog_right_content_rightTree}>
                <Tree checkable treeData={treeData} checkedKeys={checkedKeys} height={300}
                  autoExpandParent={autoExpandParent} selectedKeys={selectedKeys}
                  onExpand={onExpand} onCheck={onCheck} onSelect={onSelect}
                />
              </div>
              <div className={styles.eidtDialog_right_content_button}>
                <Button type="primary" >保存</Button>&nbsp;
                <Button type="primary" >展开</Button>&nbsp;
                <Button type="primary" >收起</Button>&nbsp;
                <Button type="primary" >全选</Button>
              </div>
            </div>
            
            </Modal>
          </div>
        )
      }
    },
  ]

  const onCurrentClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  useEffect(()=>{
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/role/queryAll', // 查询所有角色
      params:{},
    }).then(function (res) {
      setDataSource(res.data)
    }).catch(function (error) {
      message.error(error)
    })
  }, [])

  // 显示删除角色对话框
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 确定删除角色
  const handleDeleteRole = (record) => {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/role/delete', // 删除角色
      params: {
        id: record.id
      },
    }).then(function (res) {
      if (res.data === true){
        axios({
          method: 'get',
          url: 'http://127.0.0.1:8001/api/role/queryAll', // 查询所有角色
          params:{},
        }).then(function (res) {
          setDataSource(res.data)
        }).catch(function (error) {
          message.error(error)
        })
        setIsDeleteModalOpen(false);
        message.success("删除成功")
      }else{
        setIsDeleteModalOpen(false);
        message.error("删除失败！")
      }
    }).catch(function (error) {
      message.error(error)
    })
    
  };

  // 取消删除角色或者关闭删除角色对话框
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 显示添加角色对话框
  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  // 关闭添加角色对话框
  const closeAddModel = () => {
    setIsAddModalOpen(false)
  }

  // 添加角色
  const handleAddRole = (values) => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/role/add', // 查询所有角色
      data: {
        role_name: values.role_name,
        description: values.description
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      if (res.data === true){
        axios({
          method: 'get',
          url: 'http://127.0.0.1:8000/api/role/queryAll', // 查询所有角色
          params:{},
        }).then(function (res) {
          setDataSource(res.data)
        }).catch(function (error) {
          message.error(error)
        })
        setIsAddModalOpen(false);
        form.resetFields()
        message.success("添加成功")
      }else{
        setIsAddModalOpen(false);
        message.error("添加失败，重新添加")
      }
    }).catch(function (error) {
      message.error(error)
    })
  };

  // 显示添加角色对话框
  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  // 关闭添加角色对话框
  const closeEditModel = () => {
    setIsEditModalOpen(false)
  }

  // 列表展开
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setAutoExpandParent(false);
  };

  // 权限选中
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  // 权限点击
  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <div style={{ margin: '20px 0 0 30px', width:"700px"}}>
      <Button type="primary" onClick={showAddModal}>添加角色</Button>
      <Modal title="添加角色" open={isAddModalOpen}  footer={null} onCancel={closeAddModel}>
        <Form name="basic" labelCol={{ span: 4, }} wrapperCol={{ span: 16, }} autoComplete="off"
          style={{ maxWidth: 600, marginTop:"30px"}} initialValues={{ remember: true, }} 
          onFinish={handleAddRole} form={form}>
          <Form.Item label="角色名字" name="role_name">
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea/>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 16, }} >
            <Button type="primary" htmlType='submit'>添加</Button>
          </Form.Item>
        </Form>

      </Modal>
      <Table dataSource={dataSource} columns={columns} style={{ margin: '20px 0 0 0', width:"700px"}}
        rowKey={(record) => record.id}>

      </Table>
    </div>
  )
}
