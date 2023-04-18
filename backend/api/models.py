from django.db import models

# Create your models here.


class JdStationsData(models.Model):
    dataid = models.IntegerField(db_column='DataID', primary_key=True)  # Field name made lowercase.
    stationname = models.CharField(db_column='StationName', max_length=45, blank=True, null=True)  # Field name made lowercase.
    stationtype = models.CharField(db_column='StationType', max_length=45, blank=True, null=True)  # Field name made lowercase.
    starttime = models.DateTimeField(db_column='StartTime', blank=True, null=True)  # Field name made lowercase.
    endtime = models.DateTimeField(db_column='EndTime', blank=True, null=True)  # Field name made lowercase.
    b = models.DecimalField(db_column='B', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    l = models.DecimalField(db_column='L', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    x = models.DecimalField(db_column='X', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    y = models.DecimalField(db_column='Y', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    h = models.DecimalField(db_column='H', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    std2d = models.DecimalField(db_column='Std2D', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    stdh = models.DecimalField(db_column='StdH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dx = models.DecimalField(db_column='DX', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dy = models.DecimalField(db_column='DY', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dh = models.DecimalField(db_column='DH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d2 = models.DecimalField(db_column='D2', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d3 = models.DecimalField(db_column='D3', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'jd_stations_data'


class Role(models.Model):
    id = models.BigAutoField(primary_key=True)
    role_name = models.CharField(max_length=32)
    description = models.TextField()

    class Meta:
        db_table = 'role'


class SectionPoint(models.Model):
    id = models.IntegerField(primary_key=True)
    pid = models.IntegerField(db_column='pId', blank=True, null=True)  # Field name made lowercase.
    value = models.CharField(max_length=45, blank=True, null=True)
    title = models.CharField(max_length=45, blank=True, null=True)
    database_type = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        db_table = 'section_point'


class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_name = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    note = models.TextField(blank=True, null=True)
    role_name = models.CharField(max_length=32, blank=True, null=True)
    user_company = models.CharField(max_length=64, blank=True, null=True)
    user_email = models.CharField(max_length=64, blank=True, null=True)
    user_mobile = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        db_table = 'user'


class XaStationsData(models.Model):
    dataid = models.IntegerField(db_column='DataID', primary_key=True)  # Field name made lowercase.
    stationname = models.CharField(db_column='StationName', max_length=45, blank=True, null=True)  # Field name made lowercase.
    stationtype = models.CharField(db_column='StationType', max_length=45, blank=True, null=True)  # Field name made lowercase.
    starttime = models.DateTimeField(db_column='StartTime', blank=True, null=True)  # Field name made lowercase.
    endtime = models.DateTimeField(db_column='EndTime', blank=True, null=True)  # Field name made lowercase.
    b = models.DecimalField(db_column='B', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    l = models.DecimalField(db_column='L', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    x = models.DecimalField(db_column='X', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    y = models.DecimalField(db_column='Y', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    h = models.DecimalField(db_column='H', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    std2d = models.DecimalField(db_column='Std2D', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    stdh = models.DecimalField(db_column='StdH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dx = models.DecimalField(db_column='DX', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dy = models.DecimalField(db_column='DY', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dh = models.DecimalField(db_column='DH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d2 = models.DecimalField(db_column='D2', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d3 = models.DecimalField(db_column='D3', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'xa_stations_data'


class XyStationsData(models.Model):
    dataid = models.IntegerField(db_column='DataID', primary_key=True)  # Field name made lowercase.
    stationname = models.CharField(db_column='StationName', max_length=45, blank=True, null=True)  # Field name made lowercase.
    stationtype = models.CharField(db_column='StationType', max_length=45, blank=True, null=True)  # Field name made lowercase.
    starttime = models.DateTimeField(db_column='StartTime', blank=True, null=True)  # Field name made lowercase.
    endtime = models.DateTimeField(db_column='EndTime', blank=True, null=True)  # Field name made lowercase.
    b = models.DecimalField(db_column='B', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    l = models.DecimalField(db_column='L', max_digits=20, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    x = models.DecimalField(db_column='X', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    y = models.DecimalField(db_column='Y', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    h = models.DecimalField(db_column='H', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    std2d = models.DecimalField(db_column='Std2D', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    stdh = models.DecimalField(db_column='StdH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dx = models.DecimalField(db_column='DX', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dy = models.DecimalField(db_column='DY', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    dh = models.DecimalField(db_column='DH', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d2 = models.DecimalField(db_column='D2', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.
    d3 = models.DecimalField(db_column='D3', max_digits=20, decimal_places=4, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'xy_stations_data'

