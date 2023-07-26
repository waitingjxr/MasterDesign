import React, { useState, useEffect } from 'react';
import { TreeSelect, Select, DatePicker, Button } from 'antd';
import * as echarts from 'echarts'



const dot_name = [
  {
    value: 'yx_dm_1',
    title: 'YX断面1',
    children: [
      {
        value: 'yx1',
        title: 'YX1',
      },
    ],
  },
];

const data_type = [
  {
    value: 'time_one',
    label: '1小时数据',
  },
  {
    value: 'ltime_two',
    label: '2小时数据',
  },
]

const time_period = [
  {
    value: 'period_one',
    label: '5分钟',
  },
  {
    value: 'period_two',
    label: '半小时',
  },
]

const { RangePicker } = DatePicker

export default function ChangeLine() {
  const [value, setValue] = useState(undefined);

  const onChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleQuery = () =>{
    console.log("查询")
  } 
  
  useEffect(()=>{
    var chartDom = document.getElementById('charts');
    var myChart = echarts.init(chartDom);
    var option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    option && myChart.setOption(option);
  }, [])


  return (
    <div>
      <div style={{ margin: '20px 0 0 30px' }}>
        <span>测点名称:</span>&nbsp;
        <TreeSelect
          showSearch
          style={{ width: '160px' }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder=""
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
          treeData={dot_name}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>数据类型:</span>&nbsp;
        <Select
          defaultValue=""
          style={{ width: 120 }}
          onChange={handleChange}
          options={data_type}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <RangePicker placeholder={["开始日期", "结束日期"]}/>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>时间段:</span>&nbsp;
        <Select
          defaultValue="采集数据"
          style={{ width: 120 }}
          onChange={handleChange}
          options={time_period}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>
      </div>
      
      <div id='charts' style={{ margin: '50px 0 0 50px', width:'950px', height: '550px', background:'rgb(245, 245, 245)'}}>

      </div>

    </div>
    
  )
}
