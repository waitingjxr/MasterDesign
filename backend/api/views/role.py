from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.models import Role


# 添加角色
@csrf_exempt
def createRole(request):
    role_name = request.POST.get("role_name")
    description = request.POST.get("description")
    Role.objects.create(role_name=role_name, description=description)
    return HttpResponse("true")


# 查询所有角色
def queryAllRole(request):
    query_sets = Role.objects.values()
    return JsonResponse(list(query_sets), safe=False)


# 删除角色
def deleteRole(request):
    Role.objects.filter(id=request.GET.get('id')).delete()
    return HttpResponse("true")
