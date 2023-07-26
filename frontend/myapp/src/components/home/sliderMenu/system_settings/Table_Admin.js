import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message, Input, Form } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function TableAdmin() {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const datasource = [
    {
      id: '1',
      template_name: '全部报表',
      monitor_type: '表面位移监测，内部位移监测'
    },
  ]
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '模板名称',
      dataIndex: 'template_name',
      key: 'template_name',
      align: 'center',
    },
    {
      title: '监测类型',
      dataIndex: 'monitor_type',
      key: 'monitor_type',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: () => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined/>}
              onClick={showDeleteModal} />
            <Modal title="Tips" open={isModal2Open} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
              <p>您确定要删除该角色吗？</p>
            </Modal>
            &nbsp;&nbsp;&nbsp;
            <Button  type='primary' shape="circle" icon={<EditOutlined/>}/>
          </div>
        )
      }
    },
  ]

  useEffect(()=>{

  }, [])

  const showDeleteModal = () => {
    setIsModal2Open(true);
  };

  const handleDeleteOk = () => {
    setIsModal2Open(false);
    message.success("删除成功")
    
  };

  const handleDeleteCancel = () => {
    setIsModal2Open(false);
  };

  const showAddModal = () => {
    setIsModal1Open(true);
  };

  const handleAddCancel = () => {
    setIsModal1Open(false);
  };

  const addRole = () => {
    setIsModal1Open(false);
    message.success("添加成功")
    
  };

  

  return (
    <div style={{ margin: '20px 0 0 30px', width:"700px"}}>
      <Button type="primary" onClick={showAddModal}>添加报表配置  </Button>
      <Modal title="添加报表配置" open={isModal1Open} footer={null} onCancel={handleAddCancel}>
        <Form name="basic" labelCol={{ span: 4, }} wrapperCol={{ span: 16, }}
          style={{ maxWidth: 600, marginTop:"30px"}} initialValues={{ remember: true, }} autoComplete="off">
          <Form.Item label="名字" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="password">
            <Input.TextArea/>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 16, }} >
            <Button type="primary" onClick={addRole}>添加</Button>
          </Form.Item>
        </Form>

      </Modal>
      <Table dataSource={datasource} columns={columns} style={{ margin: '20px 0 0 0', width:"700px"}}></Table>
    </div>
  )
}
