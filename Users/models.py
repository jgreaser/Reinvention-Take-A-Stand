from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32, null=True)