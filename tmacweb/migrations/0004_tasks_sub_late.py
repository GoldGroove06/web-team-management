# Generated by Django 5.0.7 on 2024-08-22 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tmacweb', '0003_alter_tasks_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasks',
            name='sub_late',
            field=models.BooleanField(default=False),
        ),
    ]
