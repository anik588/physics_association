from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .models import User, Blog, Notes, NotesFolder, ResearchPaper, Video, Event, FrontSlider


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_approved')
    list_filter = ('role', 'is_approved')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('role',)}),
        ('Approval', {'fields': ('is_approved','is_moderator')}),  # ✅ Put is_approved here
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.is_approved:
            return [f.name for f in User._meta.fields]
        return [f.name for f in User._meta.fields if f.name != 'is_approved']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        if obj is None:
            return True
        return True  # you can refine this later

    def has_delete_permission(self, request, obj=None):
        return True


class ReadOnlyAdmin(admin.ModelAdmin):
    # Show some useful fields in the list view for each model
    list_display = ('__str__', 'id')
    # Disable add and change
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None):
        return False
    # Allow delete
    def has_delete_permission(self, request, obj=None):
        return True


# Register other models with ReadOnlyAdmin
admin.site.register(Blog, ReadOnlyAdmin)
admin.site.register(Notes, ReadOnlyAdmin)
admin.site.register(NotesFolder, ReadOnlyAdmin)
admin.site.register(ResearchPaper, ReadOnlyAdmin)
admin.site.register(Video, ReadOnlyAdmin)
admin.site.register(Event, ReadOnlyAdmin)
admin.site.register(FrontSlider, ReadOnlyAdmin)