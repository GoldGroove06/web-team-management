# Generated by Django 5.0.7 on 2024-08-22 17:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tmacweb', '0004_tasks_sub_late'),
    ]

    operations = [
        migrations.AlterField(
            model_name='members',
            name='project_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pj_id', to='tmacweb.projects'),
        ),
    ]
