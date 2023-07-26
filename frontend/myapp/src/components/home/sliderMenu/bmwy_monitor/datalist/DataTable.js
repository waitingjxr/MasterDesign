import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'dataId',
    key: 'dataId',
    width: 60,
    fixed: 'left',
  },
  {
    title: '断面名称',
    dataIndex: 'dm_name',
    key: 'dm_name',
    width: 60,
    fixed: 'left',
  },
  {
    title: '测点名称',
    dataIndex: 'cd_name',
    key: 'cd_name',
    width: 60,
    fixed: 'left',
  },
  {
    title: '时间',
    key: 'time',
    dataIndex: 'time',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'DX(mm)',
    key: 'dx',
    dataIndex: 'dx',
  },
  {
    title: 'DY(mm)',
    key: 'dy',
    dataIndex: 'dy',
  },
  {
    title: 'DH(mm)',
    key: 'dh',
    dataIndex: 'dh',
  },
  {
    title: '2D(mm)',
    key: 'twoD',
    dataIndex: 'twoD',
  },
  {
    title: '3D(mm)',
    key: 'threeD',
    dataIndex: 'threeD',
  },
  {
    title: 'ΔX(mm)',
    key: 'detaX',
    dataIndex: 'dataX',
  },
  {
    title: 'ΔY(mm)',
    key: 'detaY',
    dataIndex: 'detaY',
  },
  {
    title: 'ΔH(mm)',
    key: 'detaH',
    dataIndex: 'detaH',
  },
  {
    title: '方位角(°)',
    key: 'azimuth',
    dataIndex: 'azimuth',
  },
  {
    title: 'X轴加速度(mm)',
    key: 'x_axis',
    dataIndex: 'x_axis',
  },
  {
    title: 'Y轴加速度(mm)',
    key: 'y_axis',
    dataIndex: 'y_axis',
  },
  {
    title: 'Z轴加速度(mm)',
    key: 'z_axis',
    dataIndex: 'z_axis',
  },
];



const data = [];

export default function DataTable() {
  return (
    <Table columns={columns} dataSource={data} scroll={{ x: 1500, y: 300 }} />
  )
}




