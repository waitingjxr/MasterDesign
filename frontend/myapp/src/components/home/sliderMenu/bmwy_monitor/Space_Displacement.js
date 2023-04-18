import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, Select, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import * as echarts from 'echarts'
import 'echarts-gl'



export default function SpaceDisplacement() {
  var data_type = [
    { value: 'time_6h', label: '6小时数据',}, { value: 'time_12h', label: '12小时数据',},
    { value: 'time_all', label: '实时数据',},
  ]
  const [dot_data, setDotData] = useState([])  // 树形断面点数据
  const [dot_name, setDotName] = useState(undefined);  // 选中的断面点
  const [time_type, setTimeType] = useState()  // 时间数据类型
  const [start_date, setStartDate] = useState()  // 开始日期
  const [end_date, setEndDate] = useState()  // 结束日期
  const station_space_displacement_data = useRef()  // 断面点的空间变化数据
  const [myChart, setMyChart] = useState()
  var symbolSize = 2.5
  // var option  // 3D散点图配置
  var x_min   // Y坐标最小值
  var x_max   // Y坐标最大值
  var y_min   // X坐标最小值
  var y_max   // X坐标最大值
  var z_min   // Z坐标最小值
  var z_max   // Z坐标最大值

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
      url: 'http://127.0.0.1:8001/api/section_point/querySpaceDisplacementData', 
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
      station_space_displacement_data.current = res.data
      x_min = station_space_displacement_data.current[1][3]
      x_max = station_space_displacement_data.current[1][4]
      y_min = station_space_displacement_data.current[1][5]
      y_max = station_space_displacement_data.current[1][6]
      z_min = station_space_displacement_data.current[1][7]
      z_max = station_space_displacement_data.current[1][8]

      // myChart.clear()
      setMyChart(echarts.getInstanceByDom(document.getElementById('space_displacement')))
      if (myChart == null) {
        setMyChart(echarts.init(document.getElementById('space_displacement'), null, {
          width: 1600,
          height: 820
        }))
      }
      myChart.setOption({
        tooltip: {},
        grid3D: { width: '50%', height: '100%'},
        xAxis3D: {
          type: 'value',
          min: y_min,
          max: y_max
        },
        yAxis3D: {
          type: 'value',
          min: x_min,
          max: x_max
        },
        zAxis3D: {
          type: 'value',
          min: z_min,
          max: z_max
        },
        grid: [
          { top: 40, left: '55%', width: 'auto', height: '26%' },
          { top: 305, left: '55%', width: 'auto', height: '26%' },
          { top: 570, left: '55%', width: 'auto', height: '26%' },
        ],
        xAxis: [
          {
            type: 'value',
            gridIndex: 0,
            name: 'E方向',
            axisLabel: { rotate: 0, interval: 0 },
            min: y_min,
            max: y_max
          },
          {
            type: 'value',
            gridIndex: 1,
            name: 'N方向',
            boundaryGap: false,
            axisLabel: { rotate: 0, interval: 0 },
            min: x_min,
            max: x_max
          },
          {
            type: 'value',
            gridIndex: 2,
            name: 'E方向',
            axisLabel: { rotate: 0, interval: 0 },
            min: y_min,
            max: y_max
          },
        ],
        yAxis: [
          { type: 'value', gridIndex: 0, name: 'N方向', min: x_min, max: x_max },
          { type: 'value', gridIndex: 1, name: 'H方向', min: z_min, max: z_max },
          { type: 'value', gridIndex: 2, name: 'H方向', min: z_min, max: z_max },
        ],
        dataset: {
          dimensions: ['E方向', 'N方向', 'H方向'],  
          source: station_space_displacement_data.current,
        },
        series: [
          {
            type: 'scatter3D',
            symbolSize: 3,
            encode: {
              x: 'E方向',
              y: 'N方向',
              z: 'H方向',
              tooltip: [0, 1, 2, 9]
            }
          },
          {
            type: 'scatter',
            symbolSize: symbolSize,
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: {
              x: 'E方向',
              y: 'N方向',
              tooltip: [0, 1, 4]
            }
          },
          {
            type: 'scatter',
            symbolSize: symbolSize,
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: {
              x: 'N方向',
              y: 'H方向',
              tooltip: [1, 2, 4]
            }
          },
          {
            type: 'scatter',
            symbolSize: symbolSize,
            xAxisIndex: 2,
            yAxisIndex: 2,
            encode: {
              x: 'E方向',
              y: 'H方向',
              tooltip: [0, 2, 9]
            }
          },
        ],
      }, true, true)
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
      <div id="space_displacement" style={{ margin: '10px 0 0 50px', width:'1600px', height: '810px', background:'rgb(245, 245, 245)'}}>
        
      </div>
    </div>
  )
}
