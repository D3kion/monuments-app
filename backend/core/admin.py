from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext as _
from django_rest_passwordreset.admin import ResetPasswordToken


class MyUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name',
                                         'patronymic', 'email', 'job')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name',
                    'patronymic', 'is_staff')
    readonly_fields = ('last_login', 'date_joined')


User = get_user_model()
admin.site.register(User, MyUserAdmin)
admin.site.unregister(ResetPasswordToken)
