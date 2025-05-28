from django.urls import path
from api import views  # Import all views as namespace
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Auth
    path('register/', views.register_view),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('activity/', views.login_check),
    path('api/<username>/edit/', views.account_edit, name='account_edit'),
    
    #reset passwords
    path('send-reset-link/', views.send_reset_link, name='send_reset_link'),
    path('reset-password/', views.reset_password_view, name='reset_password_view'),
    path('update-password/', views.update_password, name='update_password'),
    
    
    
    # Public Lists
    path('api/public/<str:model>/', views.public_list_view),
    path('api/user/<username>/', views.user_profile),
    
    # Public Detail View (verified only)
    path('api/public/<str:model>/<int:id>/', views.public_detail_view),

    # Create Content (POST)
    path('api/create/<str:model>/', views.create_content_view),

    # Update or Delete Content (POST or DELETE)
    path('api/edit/<str:model>/<int:id>/', views.rud_content_view),

    # Teacher - Pending and Approve
    path('api/teacher/pending/', views.teacher_pending),
    path('api/teacher/approve/<str:model>/<int:id>/', views.approve_content, name='approve_content'),
    
    # User-specific uploads
    path('api/my-uploads/', views.my_uploads),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)