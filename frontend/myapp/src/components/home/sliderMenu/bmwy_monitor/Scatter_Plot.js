import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, Select, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import { Scatter } from '@ant-design/plots';

const data_type = [
  { value: 'time_6h', label: '6小时数据',}, { value: 'time_12h', label: '12小时数据',},
  { value: 'time_all', label: '实时数据',},]

export default function ScatterPlot() {

  const [dot_data, setDotData] = useState([])  // 树形断面点数据
  const [dot_name, setDotName] = useState(undefined);  // 选中的断面点
  const [time_type, setTimeType] = useState()  // 时间数据类型
  const [start_date, setStartDate] = useState()  // 开始日期
  const [end_date, setEndDate] = useState()  // 结束日期
  const station_scatter_data = useRef()  // 断面点的散点数据

  var x_min  // Y坐标最小值
  var x_max  // Y坐标最大值
  var y_min  // X坐标最小值
  var y_max  // X坐标最大值
  
  const [config, setConfig] = useState({
    padding: [40, 20, 60, 60],
    appendPadding: 10,
    locale: 'zh-CN',
    data: [],
    // 配置图例
    legend: {
      layout: 'horizontal',
      position: 'top'
    }
  })  // 散点图配置
  

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

  // 获取时间数据类型
  const handleTimeType = (value) => {
    setTimeType(value)
  }

  // 获取开始日期
  const handleStartDate = (date, dateString) => {
    setStartDate(dateString)
  }

  // 获取结束日期
  const handleEndDate = (date, dateString) => {
    setEndDate(dateString)
  }

  // 查询某一断面点的数据
  const handleQuery = () => {
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/section_point/queryScatterData', 
      data:{
        dot_name: dot_name,
        time_type: time_type,
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      station_scatter_data.current = res.data.data
      x_min = station_scatter_data.current[0].dataDX_min
      x_max = station_scatter_data.current[0].dataDX_max
      y_min = station_scatter_data.current[0].dataDY_min
      y_max = station_scatter_data.current[0].dataDY_max
      setConfig({
        data: station_scatter_data.current,
        xField: 'E方向',
        yField: 'N方向',
        shape: 'circle',
        colorField: 'category',
        xAxis: {
          min: y_min - 2.5,
          max: y_max + 2.5,
          grid: {
            line: {
              style: {
                stroke: '#eee'
              }
            },
          },
          line: {
            style: {
              stroke: '#aaa'
            }
          }
        },
        yAxis: {
          min: x_min - 2.5,
          max: x_max + 2.5,
          nice: true,
          line: {
            style: {
              stroke: '#aaa',
            },
          },
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
        <span>数据类型:</span>&nbsp;
        <Select defaultValue="" style={{ width: 120 }}
          onChange={handleTimeType} options={data_type}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>开始日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleStartDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>结束日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleEndDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>
      </div>
      <div id='charts' style={{ margin: '50px 0 0 50px', width:'950px', height: '550px', background:'rgb(245, 245, 245)'}}>
        <Scatter {...config} />
      </div>
    </div>
  )
}
