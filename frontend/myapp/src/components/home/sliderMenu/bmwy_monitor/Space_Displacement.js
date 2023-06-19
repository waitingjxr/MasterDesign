import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import * as echarts from 'echarts'
import 'echarts-gl'



export default function SpaceDisplacement() {
  const [dot_data, setDotData] = useState([])  // 树形断面点数据
  const [dot_name, setDotName] = useState(undefined);  // 选中的断面点
  const [start_date, setStartDate] = useState()  // 开始日期
  const [end_date, setEndDate] = useState()  // 结束日期
  const station_space_displacement_data = useRef()  // 断面点的空间变化数据
  const myChart_3d_scatter = useRef()
  const myChart_mapping_graph1 = useRef()
  const myChart_mapping_graph2 = useRef()
  const myChart_mapping_graph3 = useRef()
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
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      station_space_displacement_data.current = res.data
      x_min = station_space_displacement_data.current[1][8]
      x_max = station_space_displacement_data.current[1][9]
      y_min = station_space_displacement_data.current[1][10]
      y_max = station_space_displacement_data.current[1][11]
      z_min = station_space_displacement_data.current[1][12]
      z_max = station_space_displacement_data.current[1][13]
      let temp_data = res.data.slice(1,)
      let links_yx = temp_data.map((item, i) => {
        return {
          source: i,
          target: i + 1
        }
      })
      let points_yx = temp_data.map((item, i) => {
        return {
          'id': i,
          'value': [item[3], item[2]],
          'category': item[1],
          'tooltip': [item[2], item[3], item[5], item[6]]
        }
      })
      links_yx.pop()

      let links_xh = temp_data.map((item, i) => {
        return {
          source: i,
          target: i + 1
        }
      })
      let points_xh = temp_data.map((item, i) => {
        return {
          'id': i,
          'value': [item[2], item[4]],
          'category': item[1],
          'tooltip': [item[2], item[4], item[5], item[7]]
        }
      })  
      links_xh.pop()

      let links_yh = temp_data.map((item, i) => {
        return {
          source: i,
          target: i + 1
        }
      })
      let points_yh = temp_data.map((item, i) => {
        return {
          'id': i,
          'value': [item[3], item[4]],
          'category': item[1],
          'tooltip': [item[3], item[4], item[6], item[7]]
        }
      })  
      links_yh.pop()
      
      

      myChart_3d_scatter.current = echarts.getInstanceByDom(document.getElementById('3d_scatter'))
      myChart_mapping_graph1.current = echarts.getInstanceByDom(document.getElementById('mapping_graph1'))
      myChart_mapping_graph2.current = echarts.getInstanceByDom(document.getElementById('mapping_graph2'))
      myChart_mapping_graph3.current = echarts.getInstanceByDom(document.getElementById('mapping_graph3'))
      if (myChart_3d_scatter.current == null) {
        myChart_3d_scatter.current = echarts.init(document.getElementById('3d_scatter'), null, {
          width: 650,
          height: 830
        })
      }
      if (myChart_mapping_graph1.current == null) {
        myChart_mapping_graph1.current = echarts.init(document.getElementById('mapping_graph1'), null, {
          width: 700,
          height: 340
        })
      }
      if (myChart_mapping_graph2.current == null) {
        myChart_mapping_graph2.current = echarts.init(document.getElementById('mapping_graph2'), null, {
          width: 700,
          height: 340
        })
      }
      if (myChart_mapping_graph3.current == null) {
        myChart_mapping_graph3.current = echarts.init(document.getElementById('mapping_graph3'), null, {
          width: 700,
          height: 340
        })
      }
      myChart_3d_scatter.current.setOption({
        tooltip: {},
        grid3D: { width: '100%', height: '100%' },
        xAxis3D: { type: 'value', min: y_min, max: y_max },
        yAxis3D: { type: 'value', min: x_min, max: x_max },
        zAxis3D: { type: 'value', min: z_min, max: z_max },
        dataset: {
          dimensions: ['id', 'category', 'x', 'y', 'h', 'dx', 'dy', 'dh',
                       'x_min','x_max', 'y_min', 'y_max', 'h_min', 'h_max'],  
          source: station_space_displacement_data.current,
        },
        series: {
          type: 'scatter3D',
          symbolSize: 8,
          encode: {
            x: 'y',
            y: 'x',
            z: 'h',
            tooltip: [1, 2, 3, 4, 5, 6, 7]
          }
        },
      })
      myChart_mapping_graph1.current.setOption({
        grid: { left: '15%'},
        xAxis: { type: 'value', name: 'E方向', min: y_min, max: y_max },
        yAxis: { type: 'value', name: 'N方向', min: x_min, max: x_max },
        legend: [{ top: 15, data: ['起始点', '历史点', '结束点'] }],
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
              content += 'Δx: '
              content += a.data.tooltip[2]
              content += ' mm'
              content += '<br/>'
              content += 'Δy: '
              content += a.data.tooltip[3]
              content += ' mm'
              content += '<br/>'
              return content
            }
          }
        }],
        series: {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 8,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 8],
          data: points_yx,
          links: links_yx,
          categories: [{name: '起始点'}, {name: '历史点'},
                       {name: '结束点', itemStyle: {color: "rgb(154, 96, 180)"}}]
        }
      })
      myChart_mapping_graph2.current.setOption({
        grid: {},
        xAxis: { type: 'value', name: 'N方向', min: x_min, max: x_max },
        yAxis: { type: 'value', name: 'H方向', min: z_min, max: z_max },
        legend: [{ top: 15, data: ['起始点', '历史点', '结束点'] }],
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
              content += 'h: '
              content += a.data.tooltip[1]
              content += ' m'
              content += '<br/>'
              content += 'Δx: '
              content += a.data.tooltip[2]
              content += ' mm'
              content += '<br/>'
              content += 'Δh: '
              content += a.data.tooltip[3]
              content += ' mm'
              content += '<br/>'
              return content
            }
          }
        }],
        series: {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 8,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 8],
          data: points_xh,
          links: links_xh,
          categories: [{name: '起始点'}, {name: '历史点'},
                       {name: '结束点', itemStyle: {color: "rgb(154, 96, 180)"}}]
        }
      })
      myChart_mapping_graph3.current.setOption({
        grid: {},
        xAxis: { type: 'value', name: 'E方向', min: y_min, max: y_max },
        yAxis: { type: 'value', name: 'H方向', min: z_min, max: z_max },
        legend: [{ top: 15, data: ['起始点', '历史点', '结束点'] }],
        tooltip: [{
          show: true,
          formatter: function (a) {
            if (a.dataType === 'node'){
              let content = a.data.category
              content += '<br/>'
              content += 'y: '
              content += a.data.tooltip[0]
              content += ' m'
              content += '<br/>'
              content += 'h: '
              content += a.data.tooltip[1]
              content += ' m'
              content += '<br/>'
              content += 'Δy: '
              content += a.data.tooltip[2]
              content += ' mm'
              content += '<br/>'
              content += 'Δh: '
              content += a.data.tooltip[3]
              content += ' mm'
              content += '<br/>'
              return content
            }
          }
        }],
        series: {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 8,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 8],
          data: points_yh,
          links: links_yh,
          categories: [{name: '起始点'}, {name: '历史点'},
                       {name: '结束点', itemStyle: {color: "rgb(154, 96, 180)"}}]
        }
      })
    }).catch(function (error) {
      message.error(error)
    })

  }

  return (
    <div>
      <div style={{ margin: '10px 0 0 30px' }}>
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
      <div id="3d_scatter" 
        style={{ margin: '10px 0 0 50px', width:'650px', height: '870px', position: 'absolute',
                 background:'rgb(245, 245, 245)'}}>
        
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column',  width:'700px',
                   position: 'absolute', margin: '10px 0 0 700px'}}>
        <div id="mapping_graph1"
          style={{height: '290px', background:'rgb(245, 245, 245)'}}>
            
        </div>
        <div id="mapping_graph2"
          style={{height: '290px', background:'rgb(245, 245, 245)'}}>
            
        </div>
        <div id="mapping_graph3"
          style={{height: '290px', background:'rgb(245, 245, 245)'}}>
            
        </div>
      </div>
    </div>
  )
}
