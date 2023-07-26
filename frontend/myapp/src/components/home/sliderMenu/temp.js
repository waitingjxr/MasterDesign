import React, { useEffect, useRef, useState } from 'react'
import { message } from 'antd';
import axios from 'axios';
import kriging from '../../../tools/kriging';

var map
var transData_index = 0
var PI = 3.141592

var xy_lnts = []  // 益新矿各个监测点经度
var xy_lats = []  // 益新矿各个监测点纬度
var xy_dh = []  // 益新矿各个监测点沉陷值
var jd_lnts = []  // 峻德矿各个监测点经度
var jd_lats = []  // 峻德矿各个监测点纬度
var jd_dh = []  // 峻德矿各个监测点沉陷值
var xa_lnts = []  // 兴安矿各个监测点经度
var xa_lats = []  // 兴安矿各个监测点纬度
var xa_dh = []  // 兴安矿各个监测点沉陷值
// var xy_contour_data = []  // 益新矿等值图数据
// var xa_contour_data = []  // 兴安矿等值图数据
// var jd_contour_data = []  // 峻德矿等值图数据

export default function HGMap() {

  const stations_latest_data = useRef()  // 测站点最新数据
  const transData = useRef()

  // const [xy_lnts, setXYLnts] = useState([])  // 益新矿各个监测点经度
  // const [xy_lats, setXYLats] = useState([])  // 益新矿各个监测点纬度
  // const [xy_dh, setXYDh] = useState([])  // 益新矿各个监测点沉陷值
  // const [jd_lnts, setJDLnts] = useState([])  // 峻德矿各个监测点经度
  // const [jd_lats, setJDLats] = useState([])  // 峻德矿各个监测点纬度
  // const [jd_dh, setJDDh] = useState([])  // 峻德矿各个监测点沉陷值
  // const [xa_lnts, setXALnts] = useState([])  // 兴安矿各个监测点经度
  // const [xa_lats, setXALats] = useState([])  // 兴安矿各个监测点纬度
  // const [xa_dh, setXADh] = useState([])  // 兴安矿各个监测点沉陷值
  // const xy_lnts = useRef()  // 益新矿各个监测点经度
  // const xy_lats = useRef()  // 益新矿各个监测点纬度
  // const xy_dh   = useRef()  // 益新矿各个监测点沉陷值
  // const jd_lnts = useRef()  // 峻德矿各个监测点经度
  // const jd_lats = useRef()  // 峻德矿各个监测点纬度
  // const jd_dh   = useRef()  // 峻德矿各个监测点沉陷值
  // const xa_lnts = useRef()  // 兴安矿各个监测点经度
  // const xa_lats = useRef()  // 兴安矿各个监测点纬度
  // const xa_dh   = useRef()  // 兴安矿各个监测点沉陷值

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
      for (let i = 0; i < 37;) {
        let points = []
        for (let j = 0; j < 10; j++, i++) {
          if (i === 37) break
          points.push(new window.BMapGL.Point(stations_latest_data.current[i]['l'],
            stations_latest_data.current[i]['b']))
        }
        // setTimeout(function () {
        //   var convertor = new window.BMapGL.Convertor();
        //   let string  = "sss"
        //   convertor.translate(points, 1, 5, translateCallback)
        //   // convertor.translate(points, 1, 5, () => translateCallback(points))
        //   console.log("111")
          
        // }, 0);
        var convertor = new window.BMapGL.Convertor();
        let string  = "sss"
        convertor.translate(points, 1, 5, translateCallback)
        // convertor.translate(points, 1, 5, () => translateCallback(points))
        console.log("111")
      }
      console.log("111")
    }).catch(function (error) {
      message.error(error)
    })
  }, [])

  //坐标转换完之后的回调函数
  const translateCallback = function(data) {
    let tempMap = map
    let temp_xylnts = []
    // let temp_xylats = []
    // let temp_xydh = []
    // let temp_xalnts = []
    // let temp_xalats = []
    // let temp_xadh = []
    // let temp_jdlnts = []
    // let temp_jdlats = []
    // let temp_jddh = []
    
    if (data.status === 0) {
      for (let k = 0; k < data.points.length; k++, transData_index++) {
        // let point = new window.BMapGL.Point(data.points[k])
        //  绘制箭头(根据各监测站点的沉陷值不同绘制)
        let arrayLength = transData.current[transData_index]['displacement'] * 0.000005
        let arrayX = data.points[k]['lng'] + arrayLength * Math.cos(transData.current[transData_index]['angle'] * PI / 180)
        let arrayY = data.points[k]['lat'] + arrayLength * Math.sin(transData.current[transData_index]['angle'] * PI / 180)


        //  等值图数据生成
        if (transData.current[transData_index]['stationName'].slice(0, 2) === 'XY') {
          // xy_lnts.push(data.points[k]['lng'])
          // xy_lats.push(data.points[k]['lat'])
          // xy_dh.push(transData.current[transData_index]['dh'])
          // xy_lnts.push(data.points[k]['lng'])
          // xy_lnts.current = [...xy_lnts.current, data.points[k]['lng']]
          // xy_lats.current = [...xy_lnts.current, data.points[k]['lat']]
          // xy_dh.current = [...xy_lnts.current, transData.current[transData_index]['dh']]
          
          temp_xylnts.push(data.points[k]['lng'])
          // temp_xylats.push(data.points[k]['lat'])
          // temp_xydh.push(transData.current[transData_index]['dh'])
          // setXYLnts([...temp_xylnts, data.points[k]['lng']])
          // setXYLats([...temp_xylats, data.points[k]['lat']])
          // setXYDh([...temp_xydh, transData.current[transData_index]['dh']])
        }
        if (transData.current[transData_index]['stationName'].slice(0, 2) === 'XA') {
          // temp_xylnts.push(data.points[k]['lng'])
          // temp_xylats.push(data.points[k]['lat'])
          // temp_xydh.push(transData.current[transData_index]['dh'])
          // xa_lnts.current = [...xa_lnts.current, data.points[k]['lng']]
          // xa_lats.current = [...xa_lnts.current, data.points[k]['lat']]
          // xa_dh.current = [...xa_lnts.current, transData.current[transData_index]['dh']]
          // setXALnts([...xa_lnts, data.points[k]['lng']])
          // setXALats([...xa_lats, data.points[k]['lat']])
          // setXADh([...xa_dh, transData.current[transData_index]['dh']])
          // temp_xalnts.push(data.points[k]['lng'])
          // temp_xalats.push(data.points[k]['lat'])
          // temp_xadh.push(transData.current[transData_index]['dh'])
        }
        if (transData.current[transData_index]['stationName'].slice(0, 2) === 'JD') {
          // temp_xylnts.push(data.points[k]['lng'])
          // temp_xylats.push(data.points[k]['lat'])
          // temp_xydh.push(transData.current[transData_index]['dh'])
          // temp_jdlnts.push(data.points[k]['lng'])
          // temp_jdlats.push(data.points[k]['lat'])
          // temp_jddh.push(transData.current[transData_index]['dh'])
          // jd_lnts.current = [...jd_lnts.current, data.points[k]['lng']]
          // jd_lats.current = [...jd_lnts.current, data.points[k]['lat']]
          // jd_dh.current = [...jd_lnts.current, transData.current[transData_index]['dh']]
          // setJDLnts([...jd_lnts, data.points[k]['lng']])
          // setJDLats([...jd_lats, data.points[k]['lat']])
          // setJDDh([...jd_dh, transData.current[transData_index]['dh']])
        }
        
        // let xy_extents = [getMaxMin(xy_lnts, "min"), getMaxMin(xy_lnts, "max"),
        // getMaxMin(xy_lats, "min"), getMaxMin(xy_lats, "max"),
        // getMaxMin(xy_dh, "min"), getMaxMin(xy_dh, "max")]
  
        // let xa_extents = [getMaxMin(xa_lnts, "min"), getMaxMin(xa_lnts, "max"),
        // getMaxMin(xa_lats, "min"), getMaxMin(xa_lats, "max"),
        // getMaxMin(xa_dh, "min"), getMaxMin(xa_dh, "max")]
  
        // let jd_extents = [getMaxMin(jd_lnts, "min"), getMaxMin(jd_lnts, "max"),
        // getMaxMin(jd_lats, "min"), getMaxMin(jd_lats, "max"),
        // getMaxMin(jd_dh, "min"), getMaxMin(jd_dh, "max")]
  
        // let xy_polygons = [[[xy_extents[0], xy_extents[2]], [xy_extents[0], xy_extents[3]],
        // [xy_extents[1], xy_extents[3]], [xy_extents[1], xy_extents[2]]]];
  
        // let xa_polygons = [[[xa_extents[0], xa_extents[2]], [xa_extents[0], xa_extents[3]],
        // [xa_extents[1], xa_extents[3]], [xa_extents[1], xa_extents[2]]]];
  
        // let jd_polygons = [[[jd_extents[0], jd_extents[2]], [jd_extents[0], jd_extents[3]],
        // [jd_extents[1], jd_extents[3]], [jd_extents[1], jd_extents[2]]]];
  
        // let xy_variogram = kriging.train(xy_dh, xy_lnts, xy_lats, "exponential", 0, 100);
        // let xa_variogram = kriging.train(xa_dh, xa_lnts, xa_lats, "exponential", 0, 100);
        // let jd_variogram = kriging.train(jd_dh, jd_lnts, jd_lats, "exponential", 0, 100);
        // let xy_grid = kriging.grid(xy_polygons, xy_variogram, (xy_extents[1] - xy_extents[0]) / 80);
        // let xa_grid = kriging.grid(xa_polygons, xa_variogram, (xa_extents[1] - xa_extents[0]) / 80);
        // let jd_grid = kriging.grid(jd_polygons, jd_variogram, (jd_extents[1] - jd_extents[0]) / 80);
  
        // for (let i = 0; i < xy_grid.length - 1; i++) { //宽
        //   for (let j = 0; j < xy_grid[0].length - 1; j++) {  //高
        //     let d = [j, i, xy_grid[j][i]]
        //     xy_contour_data.push(d);
        //   }
        // }
        // console.log(Number(10.56).toFixed(0))
        // for (let i = 0; i < xa_grid.length - 1; i++) { //宽
        //   for (let j = 0; j < xa_grid[0].length - 1; j++) {  //高
        //     let d = [j, i, xa_grid[j][i].toFixed(0)]
        //     xa_contour_data.push(d);
        //   }
        // }
  
        // for (let i = 0; i < jd_grid.length - 1; i++) { //宽
        //   for (let j = 0; j < jd_grid[0].length - 1; j++) {  //高
        //     let d = [j, i, jd_grid[j][i].toFixed(0)]
        //     jd_contour_data.push(d);
        //   }
        // }
  
        // console.log(xy_contour_data)

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
          strokeWeight: 8,
          strokeOpacity: 1
        })
        tempMap.addOverlay(pointMarker)
        tempMap.addOverlay(arrow)
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
      console.log("111")
      // xy_lnts.push(...temp_xylnts)
      // xy_lats.current = temp_xylats
      // xy_dh.current = temp_xydh
      // xa_lnts.current = temp_xalnts
      // xa_lats.current = temp_xalats
      // xa_dh.current = temp_xadh
      // jd_lnts.current = temp_jdlnts
      // jd_lats.current = temp_jdlats
      // jd_dh.current = temp_jddh

    }
  }

  /**
   * 获取数组中的最大值和最小值函数
   */
  // function getMaxMin(arr, param) {
  //   try {
  //     if (param === 'max') {
  //       if (typeof (Math.max.apply(null, arr)) != 'number') {
  //         return "Error:element in arr is not a number!";
  //       } else {
  //         return Math.max.apply(null, arr);
  //       }
  //     } else if (param === 'min') {
  //       if (typeof (Math.min.apply(null, arr)) != 'number') {
  //         return "Error:element in arr is not a number!";
  //       } else {
  //         return Math.min.apply(null, arr);
  //       }
  //     } else {
  //       return "Error:param is unsupported!";
  //     }
  //   } catch (e) {
  //     return "Error:" + e;
  //   }
  // }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* 地图容器 */}
      <div id="container" style={{ height: "100%", width: "100%" }}>

      </div>
    </div>
  )
}

