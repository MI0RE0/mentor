
from django.contrib import admin
from django.urls import path
from mentor import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.index,name='index'),
    path('main/',views.main,name='main'),
    path('save_data/', views.save_data, name='save_data'),
    path('main/question_box/',views.question_box,name ='question_box'),
   
]
