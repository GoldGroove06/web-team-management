# Generated by Django 5.0.7 on 2024-08-20 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tmacweb', '0002_tasks_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasks',
            name='status',
            field=models.CharField(default='tasks', max_length=20),
        ),
    ]
