from django.db import models

class Title(models.Model):
    name = models.CharField(max_length=50, default='')

class Questions(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    questions = models.CharField(max_length=250)
    answers = models.CharField(max_length=1)
    images_path = models.CharField(max_length=100, null=True)
    number = models.IntegerField()
    descriptions = models.CharField(max_length=250,null=True)