from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_approved')
    list_filter = ('role', 'is_approved')
    search_fields = ('username', 'email')



    # 🔒 All fields read-only except is_approved (if not already approved)
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.is_approved:
            # once approved → make everything read-only
            return [f.name for f in User._meta.fields]
        return [f.name for f in User._meta.fields if f != 'is_approved']

    # ❌ Disallow adding new users
    def has_add_permission(self, request):
        return False

    # ✅ Allow editing only is_approved field (once)
    def has_change_permission(self, request, obj=None):
        if obj is None:
            return True
        return not obj.is_approved  # allow change only if not yet approved

    # ✅ Allow deletion if needed
    def has_delete_permission(self, request, obj=None):
        return True
