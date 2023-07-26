from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from api.models import User


# 添加用户
@csrf_exempt
def createUser(request):
    user_data = User.objects.all()
    user_name = request.POST.get("user_name")
    password = request.POST.get("password")
    role_name = request.POST.get("role_name")
    user_email = request.POST.get("user_email")
    user_company = request.POST.get("user_company")
    user_mobile = request.POST.get("user_mobile")
    note = request.POST.get("note")
    count = 0
    for item in user_data:
        if user_name == item.user_name:
            count += 1

    if count > 0:
        return JsonResponse({'status': 'error', 'msg': '该用户名已存在!'})
    User.objects.create(user_name=user_name, password=password, role_name=role_name, user_email=user_email,
                        user_company=user_company, user_mobile=user_mobile, note=note)
    return JsonResponse({'status': 'success', 'msg': '添加成功'})


# 查询所有用户
def queryAllUsers(request):
    user_data = User.objects.values()
    return JsonResponse(list(user_data), safe=False)


# 修改用户
@csrf_exempt
def modifyUser(request):
    user_name = request.POST.get("user_name")
    password = request.POST.get("password")
    role_name = request.POST.get("role_name")
    user_email = request.POST.get("user_email")
    user_company = request.POST.get("user_company")
    user_mobile = request.POST.get("user_mobile")
    note = request.POST.get("note")
    query_user = User.objects.filter(user_name=user_name).first()
    query_user.password = password
    query_user.role_name = role_name
    query_user.user_email = user_email
    query_user.user_company = user_company
    query_user.user_mobile = user_mobile
    query_user.note = note
    query_user.save()
    return HttpResponse("success")


# 删除用户
def deleteUser(request):
    User.objects.filter(id=request.GET.get('id')).delete()
    return HttpResponse("true")


# 用户登录
@csrf_exempt
def login(request):
    user_data = User.objects.all()
    user_name = request.POST.get("user_name")
    password = request.POST.get("password")
    count = 0
    for item in user_data:
        if user_name != item.user_name:
            count += 1

    if count == len(user_data):
        return JsonResponse({'status': 'error', 'msg': '该用户名不存在!'})
    query_user = User.objects.filter(user_name=user_name)
    for item in query_user:
        if password != item.password:
            return JsonResponse({'status': 'error', 'msg': '密码错误!请重新输入!'})
        return JsonResponse({'status': 'success', 'msg': '登录成功', 'token': 'user_success_login_and_save_user_info'})
