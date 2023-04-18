import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'dataId',
    key: 'dataId',
    width: 60,
    align: 'center',
  },
  {
    title: '测点名称',
    dataIndex: 'cd_name',
    key: 'cd_name',
    width: 90,
    align: 'center',
  },
  {
    title: '内测点编号',
    key: 'time',
    dataIndex: 'time',
    width: 110,
    align: 'center',
  },
  {
    title: 'X(mm)',
    key: 'x',
    dataIndex: 'x',
    align: 'center',
  },
  {
    title: 'Y(mm)',
    key: 'y',
    dataIndex: 'y',
    align: 'center',
  },
  {
    title: 'H(mm)',
    key: 'h',
    dataIndex: 'h',
    align: 'center',
  },
  {
    title: '时间(mm)',
    key: 'time',
    dataIndex: 'time',
    align: 'center',
  },
];



const data = [];

export default function DataTable() {
  return (
    <Table columns={columns} dataSource={data}  />
  )
}




