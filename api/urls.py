from django.urls import path
from .views import register_view, login_view,login_check,logout_view,public_user_profile
from .views import public_latest, blog_detail, my_uploads, teacher_pending, approve_content

urlpatterns = [
    path('register/', register_view),
    path('login/', login_view),
    path('activity/', login_check),
    path('logout/', logout_view),
    path('api/user/<str:username>/', public_user_profile),

    path('api/public-latest/', public_latest),
    path('api/blogs/<int:id>/', blog_detail),
    path('api/my-uploads/', my_uploads),
    path('api/teacher/pending/', teacher_pending),
    path('api/teacher/approve/<str:model>/<int:id>/', approve_content),
    
]