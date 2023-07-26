import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import * as echarts from 'echarts'

export default function Planar_Vector() {
  const [dot_data, setDotData] = useState([])  // 树形断面点数据
  const [dot_name, setDotName] = useState(undefined);  // 选中的断面点
  const [start_date, setStartDate] = useState()  // 开始日期
  const [end_date, setEndDate] = useState()  // 结束日期
  const station_planar_vector_data = useRef()  // 断面点的空间变化数据
  const myChart = useRef()
  var x_min   // Y坐标最小值
  var x_max   // Y坐标最大值
  var y_min   // X坐标最小值
  var y_max   // X坐标最大值

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

  // 查询某一断面点的数据
  const handleQuery = () => {
    
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/section_point/queryScatterData', 
      data:{
        dot_name: dot_name,
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      let links = res.data.data.map((item, i) => {
        return {
          source: i,
          target: i + 1
        }
      })
      let points = res.data.data.map((item, i) => {
        return {
          'id': i,
          'value': [item['Y'], item['X']],
          'category': item['category'],
          'tooltip': [item['X'], item['Y'], item['E方向'], item['N方向']]
        }
      })
      links.pop() 
      station_planar_vector_data.current = res.data.data
      x_min = station_planar_vector_data.current[0]['x_min']
      x_max = station_planar_vector_data.current[0]['x_max']
      y_min = station_planar_vector_data.current[0]['y_min']
      y_max = station_planar_vector_data.current[0]['y_max']
      myChart.current = echarts.getInstanceByDom(document.getElementById('planarVector'))
      if (myChart.current == null) {
        myChart.current = echarts.init(document.getElementById('planarVector'), null, {
          width: 1000,
          height: 600,
        })
      }
      myChart.current.setOption({
        grid: { left: '11%'},
        xAxis: {
          type: 'value',
          name: 'E方向',
          min: y_min,
          max: y_max,
        },
        yAxis: {
          type: 'value',
          name: 'N方向',
          min: x_min,
          max: x_max,
        },
        legend: [{ 
          top: 15,
          data: ['起始点', '历史点', '结束点']
        }],
        tooltip: [{
          show: true,
          formatter: function (a) {
            if (a.dataType === 'node'){
              let content = a.data.category
              content += '<br/>'
              content += 'x: '
              content += a.data.tooltip[0]
              content += ' m'
              content += '<br/>'
              content += 'y: '
              content += a.data.tooltip[1]
              content += ' m'
              content += '<br/>'
              content += 'E方向: '
              content += a.data.tooltip[2]
              content += ' mm'
              content += '<br/>'
              content += 'N方向: '
              content += a.data.tooltip[3]
              content += ' mm'
              content += '<br/>'
              return content
            }
          }
        }],
        series: [{
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 8,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 8],
          data: points,
          links: links,
          categories: [
            { name: '起始点' },
            { 
              name: '历史点',
            },
            { 
              name: '结束点',
              itemStyle: {
                color: "rgb(154, 96, 180)"
              }
              },
          ]
        }]
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
        <span>开始日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleStartDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>结束日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleEndDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>
      </div>
      <div id="planarVector" style={{ margin: '50px 0 0 50px', width:'950px', height: '600px', background:'rgb(245, 245, 245)'}}>
        
      </div>
    </div>
  )
}