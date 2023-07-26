import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import { Line } from '@ant-design/plots';

export default function WYChangeChart() {

  const [dot_data, setDotData] = useState([])  // 树形断面点数据
  const [dot_name, setDotName] = useState(undefined);  // 选中的断面点
  const [start_date, setStartDate] = useState()  // 开始日期
  const [end_date, setEndDate] = useState()  // 结束日期 
  const station_displacement_data = useRef()  // 位移变化数据
  const [config, setConfig] = useState({
    padding: [40, 20, 60, 60],
    locale: 'zh-CN',
    data: [],
    // 配置图例
    legend: {
      layout: 'horizontal',
      position: 'top'
    }
  })  // 折线图配置
  

  useEffect(()=>{
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/section_point/queryAll', // 查询所有断面点
    }).then(function (res) {
      setDotData(res.data.Data.Children)
    }).catch(function (error) {
      message.error(error)
    })

  }, [])

  // 获取所选断面点树状数据
  const onChange = (newValue) => {
    setDotName(newValue);
  };

  // 获取开始日期
  const handleStartDate = (date, dateString) => {
    setStartDate(dateString)
  }

  // 获取结束日期
  const handleEndDate = (date, dateString) => {
    setEndDate(dateString)
  }

  // 查询某一断面点的位移变化数据
  const handleQuery = () => {
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/section_point/queryDisplacementData', 
      data:{
        dot_name: dot_name,
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      station_displacement_data.current = res.data
      setConfig({
        data: station_displacement_data.current,
        xField: 'date_time',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
          title: {
            text: "日期",
            position: 'center',
            fontSize: "50px",
            autoRote: true,
          },
          type: 'time',
        },
        yAxis: {
          title: {
            text: "位移(mm)",
            fontSize: "50px",
            offset: 35
          },
          line: {}
        },
      })

    }).catch(function (error) {
      message.error(error)
    })

  }

  return (
    <div>
      <div style={{ margin: '20px 0 0 30px' }}>
        <span>测点名称:</span>&nbsp;
        <TreeSelect style={{ width: '160px' }} placeholder=""
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          allowClear showSearch
          value={dot_name} onChange={onChange} treeData={dot_data}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>开始日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleStartDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>结束日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleEndDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>
      </div>
      <div id='charts' style={{ margin: '50px 0 0 50px', width:'1000px', height: '550px', background:'rgb(245, 245, 245)'}}>
        <Line {...config} />
      </div>
    </div>
  )
}
