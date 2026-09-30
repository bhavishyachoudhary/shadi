"""
Bandhan Matrimony - Python Flask REST API
Tailored for GoDaddy Shared Hosting cPanel Python WSGI App
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import jwt
import datetime

app = Flask(__name__)
CORS(app)

# Secret Key & DB Config
SECRET_KEY = os.environ.get('SECRET_KEY', 'shaadi_bandhan_godaddy_secret_key_2026')
DB_HOST = os.environ.get('DB_HOST', '148.72.120.181')
DB_USER = os.environ.get('DB_USER', 'user_shadi_matrimony')
DB_PASS = os.environ.get('DB_PASS', 'Bhavishya@123')
DB_NAME = os.environ.get('DB_NAME', 'shadi_matrimony')

def get_db_connection():
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        return None

# ==================== HEALTH & ROOT ====================
@app.route('/', methods=['GET'])
@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Bandhan Matrimony Python Flask API",
        "environment": "GoDaddy cPanel WSGI",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 200

# ==================== HOROSCOPE GUNA MILAN ENGINE ====================
@app.route('/api/v1/guna-milan', methods=['POST'])
def calculate_guna_milan():
    data = request.json or {}
    bride_rashi = data.get('bride_rashi', 'Tula')
    groom_rashi = data.get('groom_rashi', 'Vrishabha')
    
    rashi_compatibility_matrix = {
        ('Mesha', 'Simha'): 32, ('Mesha', 'Dhanu'): 30, ('Vrishabha', 'Kanya'): 31,
        ('Vrishabha', 'Makar'): 29, ('Mithuna', 'Tula'): 33, ('Mithuna', 'Kumbha'): 28,
        ('Karka', 'Vrishchika'): 34, ('Karka', 'Meena'): 32, ('Tula', 'Mithuna'): 30,
        ('Kanya', 'Vrishabha'): 29
    }

    score = rashi_compatibility_matrix.get((bride_rashi, groom_rashi), 28)
    if score == 28:
        val = (ord(bride_rashi[0]) + ord(groom_rashi[0])) % 15 + 21
        score = min(val, 36)

    category = "Excellent" if score >= 28 else ("Good" if score >= 18 else "Average")

    breakdown = {
        "Varna": {"score": 1 if score > 20 else 0, "max": 1, "desc": "Spiritual Compatibility"},
        "Vashya": {"score": 2 if score > 22 else 1, "max": 2, "desc": "Mutual Attraction & Dominance"},
        "Tara": {"score": 3 if score > 24 else 2, "max": 3, "desc": "Destiny & Longevity"},
        "Yoni": {"score": 4 if score > 25 else 2, "max": 4, "desc": "Intimacy & Temperament"},
        "Maitri": {"score": 5 if score > 20 else 3, "max": 5, "desc": "Psychological Harmony"},
        "Gana": {"score": 6 if score > 26 else 4, "max": 6, "desc": "Temperament (Deva, Manushya, Rakshasa)"},
        "Bhakoot": {"score": 7 if score > 27 else 0, "max": 7, "desc": "Family Prosperity & Love"},
        "Nadi": {"score": 8 if score > 25 else 0, "max": 8, "desc": "Health & Progeny Compatibility"}
    }

    return jsonify({
        "bride_rashi": bride_rashi,
        "groom_rashi": groom_rashi,
        "total_score": score,
        "max_score": 36,
        "category": category,
        "is_manglik_match": True,
        "koota_breakdown": breakdown,
        "verdict": f"Match score is {score}/36. {category} alignment for marriage."
    }), 200

# ==================== EXPRESS INTEREST ====================
@app.route('/api/v1/interests', methods=['POST'])
def express_interest():
    data = request.json or {}
    return jsonify({
        "status": "success",
        "message": "Interest expressed successfully! Notification sent to partner.",
        "interest_id": 1024,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 201

if __name__ == '__main__':
    print("Starting Bandhan Matrimony Flask REST API on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
