from flask import Flask, render_template, request, jsonify
import json
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from rememberence_bridge import calculate_biorhythms, generate_thoughts
except ImportError:
    calculate_biorhythms = lambda a, s: {'MNF':5}
    generate_thoughts = lambda b: {'State': 0}

app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend/templates')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/api/biorhythms', methods=['POST'])
def get_biorhythms():
    data = request.json
    animal = data.get('animal', 'Rat')
    star = data.get('star', 'Aries')
    bios = calculate_biorhythms(animal, star)
    thoughts = generate_thoughts(bios)
    return jsonify({'biorhythms': bios, 'thoughts': thoughts})

if __name__ == '__main__':
    app.run(debug=True, port=5000)