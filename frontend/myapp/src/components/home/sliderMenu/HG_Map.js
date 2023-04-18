import React, { useEffect, useRef } from 'react'
import { message } from 'antd';
import axios from 'axios';

var map
var transData_index = 0

export default function HGMap() {

  const stations_latest_data = useRef()  // 测站点最新数据
  const transData = useRef()

  useEffect(()=>{
    // 初始化地图实例
    // 注意在react脚手架中全局对象需要使用 window 来访问，否则会造成eslint校验错误
    map=new window.BMapGL.Map('container')
    map.setMapType(window.BMAP_EARTH_MAP)
    // 设置中心点坐标
    const point = new window.BMapGL.Point(130.31100 , 47.34500)
    // 添加缩放控件
    var zoomCtrl = new window.BMapGL.ZoomControl(); 
    map.addControl(zoomCtrl);
    // 设置鼠标拖拽
    map.enableDragging()
    // 设置鼠标缩放
    map.enableScrollWheelZoom()
    // 初始化地图  15是放大级别
    map.centerAndZoom(point, 15)
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8001/api/section_point/queryAllStationLatestData', // 查询每个断面点的最新数据
    }).then(function (res) {
      stations_latest_data.current = res.data
      transData.current = res.data
      for(let i = 0; i < 37;){
        let points = []
        for(let j = 0; j < 10; j++, i++){
          if(i === 37) break
          points.push(new window.BMapGL.Point(stations_latest_data.current[i]['l'],
                                              stations_latest_data.current[i]['b']))                                     
        }
        setTimeout(function(){
          var convertor = new window.BMapGL.Convertor();
          convertor.translate(points, 1, 5, translateCallback)
        }, 1000);
      }

    }).catch(function (error) {
      message.error(error)
    })
  }, [])

  //坐标转换完之后的回调函数
  const translateCallback = function (data){
    let tempMap = map
    if(data.status === 0) {
      for (let k = 0; k < data.points.length; k++, transData_index++) {
        // let point = new window.BMapGL.Point(data.points[k])
        let pointMarker = new window.BMapGL.Marker(data.points[k])
        tempMap.addOverlay(pointMarker)
        // 创建信息窗口
        let opts = {
          width: 300,
          height: 200,
          title: '表面位移监测 - '+ transData.current[transData_index]['stationName']
          // title: <p style={{borderColor: 'bal'}}>表面位移监测 - {transData.current[transData_index]['stationName']}</p>
        }
        let infoWindow = new window.BMapGL.InfoWindow(
          '断面名称: ' + transData.current[transData_index]['section'] +
          '<br>ΔX: ' + transData.current[transData_index]['dx'] + ' mm' + 
          '<br>ΔY: ' + transData.current[transData_index]['dy'] + ' mm' +
          '<br>ΔH: ' + transData.current[transData_index]['dh'] + ' mm' +
          '<br>位移: ' + transData.current[transData_index]['displacement'] + ' mm' +
          '<br>方位角: ' + transData.current[transData_index]['angle'] + '°' +
          '<br>监测时间: ' + transData.current[transData_index]['endtime']
        , opts)
        pointMarker.addEventListener('click', function () {
          tempMap.openInfoWindow(infoWindow, data.points[k]); // 开启信息窗口
        })
      }
    }
  }
  

  return (
    <div style={{height:"100%", width:"100%"}}>
      {/* 地图容器 */}
      <div id="container" style={{height:"100%", width:"100%"}}>

      </div>
    </div>
  )
}

