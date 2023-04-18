from rest_framework import serializers
from api.models import SectionPoint, XaStationsData, XyStationsData, JdStationsData


class SectionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionPoint
        fields = (
            'id',
            'pid',
            'value',
            'title',
            'database_type',
        )


class XaStationsDataSerializer(serializers.ModelSerializer):
    # 不加read_only=True 会限制post/put请求参数必传这两个字段
    endtime = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    class Meta:
        model = XaStationsData
        fields = (
            'dataid',
            'stationname',
            'stationtype',
            'endtime',
            'b',
            'l',
            'x',
            'y',
            'h',
            'dx',
            'dy',
            'dh',
            'd2',
            'd3',
        )


class XyStationsDataSerializer(serializers.ModelSerializer):
    # 不加read_only=True 会限制post/put请求参数必传这两个字段
    endtime = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    class Meta:
        model = XyStationsData
        fields = (
            'dataid',
            'stationname',
            'stationtype',
            'endtime',
            'b',
            'l',
            'x',
            'y',
            'h',
            'dx',
            'dy',
            'dh',
            'd2',
            'd3',
        )


class JdStationsDataSerializer(serializers.ModelSerializer):
    # 不加read_only=True 会限制post/put请求参数必传这两个字段
    endtime = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    class Meta:
        model = JdStationsData
        fields = (
            'dataid',
            'stationname',
            'stationtype',
            'endtime',
            'b',
            'l',
            'x',
            'y',
            'h',
            'dx',
            'dy',
            'dh',
            'd2',
            'd3',
        )

