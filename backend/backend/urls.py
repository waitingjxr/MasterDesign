
from django.contrib import admin
from django.urls import path, include
from api.views import role, user, section_point

 
urlpatterns = [
    path('admin/', admin.site.urls),

    # 角色管理api
    path('api/role/add', role.createRole),
    path('api/role/queryAll', role.queryAllRole),
    path('api/role/delete', role.deleteRole),

    # 用户管理api
    path('api/user/add', user.createUser),
    path('api/user/queryAll', user.queryAllUsers),
    path('api/user/modify', user.modifyUser),
    path('api/user/delete', user.deleteUser),
    path('api/user/login', user.login),

    # 断面点管理
    path('api/section_point/queryAll', section_point.query_all_section_point),
    path('api/section_point/queryDisplacementData', section_point.query_displacement_change_data),
    path('api/section_point/queryScatterData', section_point.query_scatter_data),
    path('api/section_point/querySpaceDisplacementData', section_point.query_space_displacement_data),
    path('api/section_point/queryAllStationLatestData', section_point.query_all_station_latest_data),
    path('api/section_point/queryMineAllStationLatestData', section_point.query_mine_all_stations),
]