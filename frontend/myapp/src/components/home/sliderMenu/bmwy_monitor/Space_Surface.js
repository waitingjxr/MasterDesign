import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, DatePicker, Button, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios';
import * as echarts from 'echarts'
import 'echarts/extension/bmap/bmap';
import 'echarts-gl'
import kriging from '../../../../tools/kriging';



export default function SpaceSurface() {
  var mines_name = [{ value: 'XY', title: '益新矿' }, { value: 'XA', title: '兴安矿' },
  { value: 'JD', title: '峻德矿' }]
  const [mine_name, setMineName] = useState(undefined);  // 选中的矿区
  const [query_date, setQueryDate] = useState()  // 查询日期
  // const mine_stationos_data = useRef()  // 矿区各测站点空间变化数据
  // const [myChart, setMyChart] = useState()
  const myChart = useRef()
  var x_min   // Y坐标最小值
  var x_max   // Y坐标最大值
  var y_min   // X坐标最小值
  var y_max   // X坐标最大值
  var z_min   // Z坐标最小值
  var z_max   // Z坐标最大值

  useEffect(() => {


  }, [])

  // 获取所选断面点树状数据
  const onChange = (newValue) => {
    setMineName(newValue);
  };

  // 获取开始日期
  const handleStartDate = (date, dateString) => {
    setQueryDate(dateString)
  }

  // 查询某一断面点的数据
  const handleQuery = () => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/section_point/queryAllStationLatestData',
      data: {
        mine_name: mine_name,
        query_date: query_date,
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(function (res) {
      x_min = Math.round(res.data[0]['x_min']) - 1
      x_max = Math.round(res.data[0]['x_max']) + 1
      y_min = Math.round(res.data[0]['y_min']) - 1
      y_max = Math.round(res.data[0]['y_max']) + 1
      z_min = res.data[0]['z_min']
      z_max = res.data[0]['z_max']
      let x_data = res.data.map((item, i) => item['y'])
      let y_data = res.data.map((item, i) => item['x'])
      let z_data = res.data.map((item, i) => item['dh'])
      let polygons = [[[x_min, y_min], [x_min, y_max], [x_max, y_max], [x_max, y_min]]];
     
      let variogram = kriging.train(z_data, x_data, y_data, "exponential", 0, 100);
      let grid = kriging.grid(polygons, variogram, (x_max - x_min) / 500);
      
      let chart_data = []
      for (let i = 0; i < grid.length - 1; i++) { //宽
        for (let j = 0; j < grid[0].length - 1; j++) {  //高
          let x = (i * grid.width + grid.xlim[0])
          let y = (j * grid.width + grid.ylim[0])
          let z = grid[i][j]
          let d = [x, y, z]
          chart_data.push(d);
        }
      }
      console.log(chart_data)
      myChart.current = echarts.getInstanceByDom(document.getElementById('space_surface'))
      if (myChart.current == null) {
        myChart.current = echarts.init(document.getElementById('space_surface'), null, {
          width: 960,
          height: 650
        })
      }
      myChart.current.setOption({
        tooltip: {},
        visualMap: {
          show: false,
          dimension: 2,
          min: -0.5,
          max: 0.5,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          }
        },
        grid3D: {
          viewControl: {
            projection: 'orthorgraphic'
          },
        },
        xAxis3D: {
          type: 'value',
          min: x_min,
          max: x_max
        },
        yAxis3D: {
          type: 'value',
          min: y_min,
          max: y_max
        },
        zAxis3D: {
          type: 'value',
          min: z_min,
          max: z_max
        },
        series: {
          type: 'surface',
          wireframe: {

          },
          data: chart_data,
        }
      })
    }).catch(function (error) {
      message.error(error)
    })

  }

  return (
    <div>
      <div style={{ margin: '20px 0 0 30px' }}>
        <span>矿区名称:</span>&nbsp;
        <TreeSelect style={{ width: '160px' }} placeholder=""
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          allowClear showSearch
          value={mine_name} onChange={onChange} treeData={mines_name}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <span>查询日期:</span>&nbsp;
        <DatePicker locale={locale} onChange={handleStartDate} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={handleQuery}>查询</Button>
      </div>
      <div id="space_surface" style={{ margin: '10px 0 0 50px', width: '960px', height: '650px', background: 'rgb(245, 245, 245)' }}>

      </div>
    </div>
  )
}
