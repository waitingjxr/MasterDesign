import React, { useEffect, useRef } from 'react'
import { message } from 'antd';
import axios from 'axios';
// import * as echarts from 'echarts'
// import kriging from '../../../tools/kriging';

var map
var transData_index = 0
var PI = 3.141592

// var xy_lnts = []  // 益新矿各个监测点经度
// var xy_lats = []  // 益新矿各个监测点纬度
// var xy_dh = []  // 益新矿各个监测点沉陷值
// var jd_lnts = []  // 峻德矿各个监测点经度
// var jd_lats = []  // 峻德矿各个监测点纬度
// var jd_dh = []  // 峻德矿各个监测点沉陷值
// var xa_lnts = []  // 兴安矿各个监测点经度
// var xa_lats = []  // 兴安矿各个监测点纬度
// var xa_dh = []  // 兴安矿各个监测点沉陷值
// var xy_contour_data = []  // 益新矿等值图数据
// var xa_contour_data = []  // 兴安矿等值图数据
// var jd_contour_data = []  // 峻德矿等值图数据

// var xy_chart  // 益新矿等值图
// var xa_chart  // 益新矿等值图
// var jd_chart  // 益新矿等值图

// var COLORS = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf","#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]
      

// var lngExtent = []
// var latExtent = []
// var cellCount = []
// var cellSizeCoord = []

// var xy_canvas
// var xa_canvas
// var jd_canvas
export default function HGMap() {

  const stations_latest_data = useRef()  // 测站点最新数据
  const transData = useRef()

  useEffect(() => {
    // 初始化地图实例
    // 注意在react脚手架中全局对象需要使用 window 来访问，否则会造成eslint校验错误
    map = new window.BMapGL.Map('container')
    map.setMapType(window.BMAP_EARTH_MAP)
    // 设置中心点坐标
    const point = new window.BMapGL.Point(130.31100, 47.34500)
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
      
        for (let i = 0; i < 41;) {
          let points = []
          
          for (let j = 0; j < 10; j++, i++) {
            if (i === 41) break
            points.push(new window.BMapGL.Point(stations_latest_data.current[i]['l'],
              stations_latest_data.current[i]['b']))
          }
          let convertor = new window.BMapGL.Convertor();
          convertor.translate(points, 1, 5, translateCallback)
        }
      // console.log(xy_lnts[3])
    }).catch(function (error) {
      message.error(error)
    })
  }, [])

  //坐标转换完之后的回调函数
  const translateCallback = function(data){
    let tempMap = map
    
    if (data.status === 0) {
      for (let k = 0; k < data.points.length; k++, transData_index++) {
        // let point = new window.BMapGL.Point(data.points[k])
        //  绘制箭头(根据各监测站点的沉陷值不同绘制)
        let arrayLength = transData.current[transData_index]['displacement'] * 0.000005
        let arrayX = data.points[k]['lng'] + arrayLength * Math.cos(transData.current[transData_index]['angle'] * PI / 180)
        let arrayY = data.points[k]['lat'] + arrayLength * Math.sin(transData.current[transData_index]['angle'] * PI / 180)

        // let iconWidth = transData.current[transData_index]['displacement']
        // let iconHeight = 15
        // let angleIcon = new window.BMapGL.Icon("src/resources/images/arrow.png",
        //   new window.BMapGL.Size(iconWidth, iconHeight))
        let pointMarker = new window.BMapGL.Marker(data.points[k])
        let arrow = new window.BMapGL.Polyline([
          data.points[k],
          new window.BMapGL.Point(arrayX, arrayY)
        ], {
          strokeColor: "pink",
          strokeWeight: 5,
          strokeOpacity: 1
        })
        let txt_opts = {
          position: data.points[k], // 指定文本标注所在的地理位置
          offset: new window.BMapGL.Size(-20, 5) // 设置文本偏移量
        };
        // 创建文本标注对象
        let label = new window.BMapGL.Label(transData.current[transData_index]['stationName'], txt_opts);
        // 自定义文本标注样式
        label.setStyle({
            color: 'black',
            padding: '1px',
            fontSize: '16px',
            height: '20px',
            lineHeight: '20px',
            fontFamily: '微软雅黑',
            opacity: 0.6
        });
        tempMap.addOverlay(pointMarker)
        tempMap.addOverlay(arrow)
        tempMap.addOverlay(label)
        let opts = {
          width: 300,
          height: 200,
          title: '表面位移监测 - ' + transData.current[transData_index]['stationName']
        }
        
        let infoWindow = new window.BMapGL.InfoWindow(
          '断面名称: ' + transData.current[transData_index]['section'] +
          '<br>ΔX: ' + transData.current[transData_index]['dx'] + ' mm' +
          '<br>ΔY: ' + transData.current[transData_index]['dy'] + ' mm' +
          '<br>ΔH: ' + transData.current[transData_index]['dh'] + ' mm' +
          '<br>位移: ' + transData.current[transData_index]['displacement'] + ' mm' +
          '<br>方位角: ' + transData.current[transData_index]['trans_angle'] + '°' +
          '<br>监测时间: ' + transData.current[transData_index]['endtime']
          , opts)
        pointMarker.addEventListener('click', function () {
          tempMap.openInfoWindow(infoWindow, data.points[k]); // 开启信息窗口
        })
      }
    }
    
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* 地图容器 */}
      <div id="container" style={{ height: "100%", width: "100%" }}>

      </div>
    </div>
  )
}

