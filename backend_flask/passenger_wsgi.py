# passenger_wsgi.py for GoDaddy cPanel Setup Python App
import sys, os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Import Flask application instance
from app import app as application
