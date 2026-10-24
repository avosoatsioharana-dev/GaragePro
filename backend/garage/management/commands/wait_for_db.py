import time
from django.core.management.base import BaseCommand
from django.db import connections
class Command(BaseCommand):
    help = 'Attend que la base de données soit accessible.'
    def handle(self, *args, **options):
        db_conn = None
        while not db_conn:
            try:
                db_conn = connections['default']
                db_conn.cursor()
            except Exception as exc:
                self.stdout.write(f'Base indisponible ({exc}); nouvelle tentative dans 2 secondes…')
                time.sleep(2)
        self.stdout.write(self.style.SUCCESS('Base de données accessible.'))
