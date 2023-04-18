import math

from django.http import HttpResponse, JsonResponse
import json, decimal
from django.db.models import Max, Min
from django.views.decorators.csrf import csrf_exempt
from api.models import SectionPoint, XaStationsData, XyStationsData, JdStationsData
from api.serializers import SectionPointSerializer, XaStationsDataSerializer, XyStationsDataSerializer, \
    JdStationsDataSerializer


# 查询结果转为层级树结构
def get_tree(data, pid):
    result = []
    for item in data:
        if pid == item["pid"]:
            temp = get_tree(data, item["id"])
            if len(temp) > 0:
                item["children"] = temp
            result.append(item)
    return result


# 查询断面点
def query_all_section_point(request):
    tree_data = {
        "Code": 200,
        "Message": "断面点",
        "Data": {
            "id": 0,
        }
    }
    root = 0
    query_set = SectionPoint.objects.all()
    serializer = SectionPointSerializer(query_set, many=True)
    tree_data["Data"]["Children"] = get_tree(serializer.data, root)
    return HttpResponse(json.dumps(tree_data))


# 查询某一断面点的位移变化数据
@csrf_exempt
def query_displacement_change_data(request):
    dot_name = request.POST.get("dot_name")
    time_type = request.POST.get("time_type")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")
    if dot_name[0:2] == 'XA':
        query_data = XaStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        serializer = XaStationsDataSerializer(query_data, many=True)
    elif dot_name[0:2] == 'XY':
        query_data = XyStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        serializer = XyStationsDataSerializer(query_data, many=True)
    else:
        query_data = JdStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        serializer = JdStationsDataSerializer(query_data, many=True)
    if not serializer.data:
        return HttpResponse("没有查到对应数据！")
    station_data_list = []
    station_data_keys = ['dx', 'dy', 'dh', 'd2', 'd3']
    key_value = {
        'dx': 'N方向',
        'dy': 'E方向',
        'dh': 'H方向',
        'd2': '平面变化量',
        'd3': '空间变化量'
    }
    for i in serializer.data:
        for key in station_data_keys:
            temp = {
                'date_time': i['endtime'],
                'value': round(float(i[key]) * 1000, 2),
                'category': key_value[key]
            }
            station_data_list.append(temp)
    return JsonResponse(station_data_list, safe=False)


# 查询某一断面点的散点数据
@csrf_exempt
def query_scatter_data(request):
    dot_name = request.POST.get("dot_name")
    time_type = request.POST.get("time_type")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")
    if dot_name[0:2] == 'XA':
        query_data = XaStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataDX_min = query_data.aggregate(Min('dx'))
        dataDX_max = query_data.aggregate(Max('dx'))
        dataDY_min = query_data.aggregate(Min('dy'))
        dataDY_max = query_data.aggregate(Max('dy'))
        serializer = XaStationsDataSerializer(query_data, many=True)
    elif dot_name[0:2] == 'XY':
        query_data = XyStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataDX_min = query_data.aggregate(Min('dx'))
        dataDX_max = query_data.aggregate(Max('dx'))
        dataDY_min = query_data.aggregate(Min('dy'))
        dataDY_max = query_data.aggregate(Max('dy'))
        serializer = XyStationsDataSerializer(query_data, many=True)
    else:
        query_data = JdStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataDX_min = query_data.aggregate(Min('dx'))
        dataDX_max = query_data.aggregate(Max('dx'))
        dataDY_min = query_data.aggregate(Min('dy'))
        dataDY_max = query_data.aggregate(Max('dy'))
        serializer = JdStationsDataSerializer(query_data, many=True)
    if not serializer.data:
        return JsonResponse(
            {
                'isError': 'true',
                'data': None,
                'message': "没有查到对应数据！",
            }
        )
    station_data_list = []
    count = 0
    for i in serializer.data:
        if count == 0:
            temp = {
                'id': count,
                'title': '起始点',
                'category': '起始点',
                'X': round(float(serializer.data[0]['x']), 4),
                'Y': round(float(serializer.data[0]['y']), 4),
                'N方向': round(float(serializer.data[0]['dx']) * 1000, 1),
                'E方向': round(float(serializer.data[0]['dy']) * 1000, 1),
                'dataX_min': round(float(dataX_min['x__min']), 4),
                'dataX_max': round(float(dataX_max['x__max']), 4),
                'dataY_min': round(float(dataY_min['y__min']), 4),
                'dataY_max': round(float(dataY_max['y__max']), 4),
                'dataDX_min': round(float(dataDX_min['dx__min']) * 1000, 1),
                'dataDX_max': round(float(dataDX_max['dx__max']) * 1000, 1),
                'dataDY_min': round(float(dataDY_min['dy__min']) * 1000, 1),
                'dataDY_max': round(float(dataDY_max['dy__max']) * 1000, 1),
            }
            station_data_list.append(temp)
            count += 1
        if count == len(serializer.data) - 1:
            temp = {
                'id': count,
                'title': '结束点',
                'category': '结束点',
                'X': round(float(serializer.data[-1]['x']), 4),
                'Y': round(float(serializer.data[-1]['y']), 4),
                'N方向': round(float(serializer.data[-1]['dx']) * 1000, 1),
                'E方向': round(float(serializer.data[-1]['dy']) * 1000, 1),
                'dataX_min': round(float(dataX_min['x__min']), 4),
                'dataX_max': round(float(dataX_max['x__max']), 4),
                'dataY_min': round(float(dataY_min['y__min']), 4),
                'dataY_max': round(float(dataY_max['y__max']), 4),
                'dataDX_min': round(float(dataDX_min['dx__min']) * 1000, 1),
                'dataDX_max': round(float(dataDX_max['dx__max']) * 1000, 1),
                'dataDY_min': round(float(dataDY_min['dy__min']) * 1000, 1),
                'dataDY_max': round(float(dataDY_max['dy__max']) * 1000, 1),
            }
            station_data_list.append(temp)
            break
        temp = {
            'id': count,
            'title': '历史点',
            'category': '历史点',
            'X': round(float(i['x']), 4),
            'Y': round(float(i['y']), 4),
            'N方向': round(float(i['dx']) * 1000, 1),
            'E方向': round(float(i['dy']) * 1000, 1),
            'dataX_min': round(float(dataX_min['x__min']), 4),
            'dataX_max': round(float(dataX_max['x__max']), 4),
            'dataY_min': round(float(dataY_min['y__min']), 4),
            'dataY_max': round(float(dataY_max['y__max']), 4),
            'dataDX_min': round(float(dataDX_min['dx__min']) * 1000, 1),
            'dataDX_max': round(float(dataDX_max['dx__max']) * 1000, 1),
            'dataDY_min': round(float(dataDY_min['dy__min']) * 1000, 1),
            'dataDY_max': round(float(dataDY_max['dy__max']) * 1000, 1),
        }
        station_data_list.append(temp)
        count += 1
    return JsonResponse({
        'isError': 'false',
        'data': station_data_list,
        'message': '发送成功'
    }, safe=False)


# 查询某一断面点的空间变化数据
@csrf_exempt
def query_space_displacement_data(request):
    dot_name = request.POST.get("dot_name")
    time_type = request.POST.get("time_type")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")
    if dot_name[0:2] == 'XA':
        query_data = XaStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataH_min = query_data.aggregate(Min('h'))
        dataH_max = query_data.aggregate(Max('h'))
        serializer = XaStationsDataSerializer(query_data, many=True)
    elif dot_name[0:2] == 'XY':
        query_data = XyStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataH_min = query_data.aggregate(Min('h'))
        dataH_max = query_data.aggregate(Max('h'))
        serializer = XyStationsDataSerializer(query_data, many=True)
    else:
        query_data = JdStationsData.objects.filter(stationname=dot_name, starttime__range=[start_date, end_date]).all()
        dataX_min = query_data.aggregate(Min('x'))
        dataX_max = query_data.aggregate(Max('x'))
        dataY_min = query_data.aggregate(Min('y'))
        dataY_max = query_data.aggregate(Max('y'))
        dataH_min = query_data.aggregate(Min('h'))
        dataH_max = query_data.aggregate(Max('h'))
        serializer = JdStationsDataSerializer(query_data, many=True)
    if not serializer.data:
        return HttpResponse("没有查到对应数据！")
    station_data_list = [
        ['E方向', 'N方向', 'H方向', 'dataX_min', 'dataX_max', 'dataY_min', 'dataY_max', 'dataH_min', 'dataH_max', 'date'], ]
    for i in serializer.data:
        temp = [
            i['y'],
            i['x'],
            i['h'],
            dataX_min['x__min'],
            dataX_max['x__max'],
            dataY_min['y__min'],
            dataY_max['y__max'],
            dataH_min['h__min'],
            dataH_max['h__max'],
            i['endtime'],
        ]
        station_data_list.append(temp)
    return JsonResponse(station_data_list, safe=False)


# 查询每个断面点的最新数据
def query_all_station_latest_data(request):
    xy_section1_stations_name = ['XY1', 'XY2', 'XY3', 'XY11']
    xy_section2_stations_name = ['XY6', 'XY7', 'XY9', 'XY10', 'XY12']
    xy_section3_stations_name = ['XY4', 'XY5', 'XY8']
    xa_section1_stations_name = ['XA1', 'XA8', 'XA9', 'XA10']
    xa_section2_stations_name = ['XA2', 'XA13', 'XA14', 'XA15']
    xa_section3_stations_name = ['XA3', 'XA11', 'XA12', 'XA16']
    xa_section4_stations_name = ['XA4', 'XA5', 'XA6', 'XA7']
    jd_section1_stations_name = ['JD01', 'JD02', 'JD03', 'JD04', 'JD05', 'JD07', 'JD09', 'JD10', 'JD11']
    stations_latest_data = []
    i = 0
    # YX断面1
    for station_name in xy_section1_stations_name:
        query_data = XyStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XyStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XY断面1',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'displacement': math.sqrt(math.pow(round(dx * 1000, 1), 2) + math.pow(round(dy * 1000, 1), 2)),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # YX断面2
    for station_name in xy_section2_stations_name:
        query_data = XyStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XyStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XY断面2',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # YX断面3
    for station_name in xy_section3_stations_name:
        query_data = XyStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XyStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XY断面3',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # XA断面1
    for station_name in xa_section1_stations_name:
        query_data = XaStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XaStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XA断面1',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # XA断面2
    for station_name in xa_section2_stations_name:
        query_data = XaStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XaStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XA断面2',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # XA断面3
    for station_name in xa_section3_stations_name:
        query_data = XaStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XaStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XA断面3',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # XA断面4
    for station_name in xa_section4_stations_name:
        query_data = XaStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = XaStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'XA断面4',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    # JD断面1
    for station_name in jd_section1_stations_name:
        query_data = JdStationsData.objects.filter(stationname=station_name).order_by('-dataid')[:1]
        serializer = JdStationsDataSerializer(query_data, many=True)
        dx = float(serializer.data[0]['dx'])
        dy = float(serializer.data[0]['dy'])
        radian = math.atan(math.fabs(dy / dx))
        angle = radian_to_angle(radian, dx, dy)
        i += 1
        temp = {
            'index': i,
            'section': 'JD断面1',
            'stationName': serializer.data[0]['stationname'],
            'endtime': serializer.data[0]['endtime'],
            'b': serializer.data[0]['b'],
            'l': serializer.data[0]['l'],
            'dx': round(dx * 1000, 1),
            'dy': round(dy * 1000, 1),
            'dh': round(float(serializer.data[0]['dh']) * 1000, 1),
            'angle': angle

        }
        stations_latest_data.append(temp)
    return JsonResponse(stations_latest_data, safe=False)


# 弧度转角度
def radian_to_angle(radian, dx, dy):
    M_DEG = 57.2957795130823
    angle = radian * M_DEG
    a = math.floor(angle)
    b = (angle - a) * 60
    c = math.floor(b)
    d = (b - c) * 60
    angle = a + c / 100 + d / 10000
    if dx > 0 and dy > 0:
        angle = angle
    elif dx < 0 < dy:
        angle = 180 - angle
    elif dx < 0 and dy < 0:
        angle = 180 + angle
    else:
        angle = 360 - angle
    return round(angle, 2)
