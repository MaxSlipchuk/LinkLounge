# Generated by Django 4.2.5 on 2024-06-27 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='name',
            field=models.CharField(max_length=25),
        ),
    ]
