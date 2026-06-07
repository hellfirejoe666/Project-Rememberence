from flask import Flask, render_template, send_from_directory, request, jsonify
import json
import os
import time
import random
import re

from db import init_db, create_character, get_character, list_characters, delete_character

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
STATIC_DIR = os.path.join(FRONTEND_DIR, 'static')
TEMPLATES_DIR = os.path.join(FRONTEND_DIR, 'templates')
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='', template_folder=TEMPLATES_DIR)

# Initialize SQLite DB for characters
init_db()

STATE_FILE = os.environ.get('REMEMBERENCE_STATE_FILE') or os.path.join(os.path.dirname(__file__), "rememberence_state.json")

# Default empty state structure
DEFAULT_STATE = {
    "spirits": [],
    "posts": [],
    "postCounters": {"lastId": 0},
    "lastSaved": 0
}

def load_state_file():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                data = json.load(f)
            # Ensure all expected keys exist
            for key in DEFAULT_STATE:
                if key not in data:
                    data[key] = DEFAULT_STATE[key]
            return data
        except json.JSONDecodeError:
            print("Corrupted state file — resetting to default")
    return DEFAULT_STATE.copy()

def save_state_file(data):
    data["lastSaved"] = int(time.time())
    with open(STATE_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"State saved at {data['lastSaved']} — posts: {len(data.get('posts', []))}, spirits: {len(data.get('spirits', []))}")
    return data["lastSaved"]

# Serve the rendered homepage template
@app.route('/')
def serve_index():
    return render_template('home.html')

# Serve all static files (js, css, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Save full state — EXPLICIT DEEP MERGE for arrays/objects
@app.route('/save', methods=['POST'])
def save_state():
    try:
        incoming = request.get_json(force=True) or {}
        if not isinstance(incoming, dict):
            print("Invalid JSON received")
            return jsonify({"error": "Invalid JSON"}), 400

        current = load_state_file()

        # Explicit deep merge — NEVER lose arrays/objects
        if 'posts' in incoming:
            current['posts'] = incoming['posts'][:]
        if 'postCounters' in incoming:
            current['postCounters'] = incoming['postCounters'].copy()
        if 'spirits' in incoming:
            current['spirits'] = incoming['spirits'][:]

        # Log what we're actually saving
        print(f"Incoming save → posts received: {len(incoming.get('posts', []))}, counters: {incoming.get('postCounters')}")

        timestamp = save_state_file(current)

        return jsonify({
            "status": "saved",
            "timestamp": timestamp,
            "postCount": len(current.get("posts", [])),
            "spiritCount": len(current.get("spirits", []))
        })
    except Exception as e:
        print(f"Save error: {e}")
        return jsonify({"error": str(e)}), 500

# Load full state
@app.route('/load')
def load_state():
    data = load_state_file()
    return jsonify(data)

# Clear everything (used by clear-timeline)
@app.route('/clear', methods=['POST'])
def clear_state():
    try:
        save_state_file(DEFAULT_STATE.copy())
        return jsonify({"status": "cleared", "message": "The echoes return to silence."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def normalize_spirit(spirit):
    if not isinstance(spirit, dict):
        return {}
    spirit.setdefault('name', spirit.get('name', 'Spirit'))
    spirit.setdefault('loyaltyMap', spirit.get('loyaltyMap', {}))
    spirit.setdefault('loyaltyRank', spirit.get('loyaltyRank', {}))
    spirit.setdefault('thoughts', spirit.get('thoughts', {}))
    spirit.setdefault('animal', spirit.get('animal', 'Rat'))
    spirit.setdefault('star', spirit.get('star', 'Aries'))
    spirit.setdefault('species', spirit.get('species', 'Unknown'))
    spirit.setdefault('type', spirit.get('type', 'Neutral'))
    return spirit


def find_spirit(state, name):
    for spirit in state.get('spirits', []):
        if spirit.get('name', '').lower() == name.lower():
            return spirit
    return None


DEFAULT_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Boar']
DEFAULT_STARS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
DEFAULT_SPECIES = ['Avious', 'Merr', 'Geneshan', 'Iniris', 'Reptoid', 'Wolfin', 'Goki', 'Tigris', 'Demon', 'Grimm', 'Drakian', 'Chimera', 'Mannequin']
DEFAULT_TYPES = ['NaGi', 'NaFi', 'NaWi', 'NaZi', 'NaTe', 'NaDin', 'Neutral']
DEFAULT_SKILLS = ['Strike', 'Guard', 'Whisper', 'Surge', 'Echo', 'Breach', 'Flow', 'Burst']


def random_choice_from_list(values, default=None):
    return random.choice(values) if values else default


def generate_character_payload(body=None):
    body = body if isinstance(body, dict) else {}
    name = body.get('name') or f"{random_choice_from_list(['Astra','Nyx','Rune','Lira','Cora','Zeph','Nova','Vex'])}"
    level = max(1, int(body.get('level', 1)))
    animal = body.get('animal') or random_choice_from_list(DEFAULT_ANIMALS)
    star = body.get('star') or random_choice_from_list(DEFAULT_STARS)
    species = body.get('species') or random_choice_from_list(DEFAULT_SPECIES)
    spirit_type = body.get('type') or random_choice_from_list(DEFAULT_TYPES)
    description = body.get('description', 'A newly formed spirit of the weave.')
    stats = {
        'HP': 10 * level + random.randint(0, 10),
        'ATK': 3 * level + random.randint(0, 4),
        'DEF': 2 * level + random.randint(0, 3),
        'SPD': 2 * level + random.randint(0, 3),
        'MP': 8 * level + random.randint(0, 8)
    }
    spirit = {
        'name': name,
        'description': description,
        'level': level,
        'animal': animal,
        'star': star,
        'species': species,
        'type': spirit_type,
        'loyaltyMap': {},
        'loyaltyRank': {},
        'thoughts': {'State': 0},
        'stats': stats,
        'skills': {
            'melee': body.get('meleeSkill') or random_choice_from_list(DEFAULT_SKILLS),
            'ranged': body.get('rangedSkill') or random_choice_from_list(DEFAULT_SKILLS),
            'magic': body.get('magicSkill') or random_choice_from_list(DEFAULT_SKILLS),
            'step': body.get('stepSkill') or random_choice_from_list(DEFAULT_SKILLS),
            'special': body.get('specialSkill') or random_choice_from_list(DEFAULT_SKILLS),
            'trance': body.get('tranceSkill') or random_choice_from_list(DEFAULT_SKILLS)
        }
    }
    return spirit


def decay_spirit_thoughts(spirit):
    thought = spirit.get('thoughts', {})
    if not isinstance(thought, dict):
        thought = {}
    for key, value in list(thought.items()):
        if key == 'State':
            continue
        if isinstance(value, (int, float)):
            change = -1 if value > 0 else 1
            thought[key] = int(max(-100, min(100, value + change)))
    thought['State'] = sum(int(v) for k, v in thought.items() if k != 'State')
    spirit['thoughts'] = thought
    return spirit


def decay_loyalty(spirit):
    if not isinstance(spirit.get('loyaltyMap'), dict):
        spirit['loyaltyMap'] = {}
    for target, score in list(spirit['loyaltyMap'].items()):
        if not isinstance(score, (int, float)):
            continue
        drag = 1 if score > 0 else -1
        new_score = int(max(-100, min(100, score - drag)))
        spirit['loyaltyMap'][target] = new_score
    return spirit


def create_default_post(spirit):
    return {
        'id': int(time.time() * 1000),
        'author': spirit.get('name', 'Spirit'),
        'content': f"{spirit.get('name', 'A spirit')} murmurs in the weave.",
        'timestamp': int(time.time())
    }


@app.route('/api/roll', methods=['POST'])
def api_roll():
    body = request.get_json(silent=True) or {}
    formula = (body.get('formula') or '1d20').replace(' ', '')
    m = re.match(r'^(?:(\d*)d(\d+))(?:([+-]\d+))?$', formula)
    if not m:
        return jsonify({'error': 'Invalid roll formula. Use NdM+K format, e.g. 2d6+1'}), 400
    n = int(m.group(1)) if m.group(1) else 1
    sides = int(m.group(2))
    mod = int(m.group(3)) if m.group(3) else 0
    rolls = [random.randint(1, sides) for _ in range(n)]
    total = sum(rolls) + mod
    return jsonify({'formula': formula, 'rolls': rolls, 'modifier': mod, 'total': total})


@app.route('/api/state', methods=['GET'])
def api_get_state():
    return jsonify(load_state_file())


@app.route('/api/state', methods=['POST'])
def api_save_state():
    body = request.get_json(silent=True) or {}
    if not isinstance(body, dict):
        return jsonify({'error': 'Invalid JSON'}), 400
    current = load_state_file()
    if 'spirits' in body:
        current['spirits'] = [normalize_spirit(s) for s in body.get('spirits', [])]
    if 'posts' in body:
        current['posts'] = body.get('posts', [])[:]
    if 'postCounters' in body:
        current['postCounters'] = body.get('postCounters', {}).copy()
    if 'lastSaved' in body:
        current['lastSaved'] = int(body.get('lastSaved', current.get('lastSaved', 0)))
    timestamp = save_state_file(current)
    return jsonify({'status': 'saved', 'timestamp': timestamp, 'state': current})


@app.route('/api/state/clear', methods=['POST'])
def api_clear_state():
    save_state_file(DEFAULT_STATE.copy())
    return jsonify({'status': 'cleared'})


@app.route('/api/spirits', methods=['GET'])
def api_list_spirits():
    state = load_state_file()
    return jsonify(state.get('spirits', []))


@app.route('/api/spirits/<string:name>', methods=['GET'])
def api_get_spirit(name):
    state = load_state_file()
    spirit = find_spirit(state, name)
    if not spirit:
        return jsonify({'error': 'Spirit not found'}), 404
    return jsonify(spirit)


@app.route('/api/spirit/load/<string:name>', methods=['GET'])
def api_load_spirit(name):
    return api_get_spirit(name)


@app.route('/api/character/generate', methods=['POST'])
def api_generate_character():
    body = request.get_json(silent=True) or {}
    character = generate_character_payload(body)
    return jsonify({'status': 'generated', 'character': character})


@app.route('/api/spirits', methods=['POST'])
def api_add_spirit():
    body = request.get_json(silent=True) or {}
    spirit = normalize_spirit(body)
    state = load_state_file()
    existing = find_spirit(state, spirit['name'])
    if existing:
        existing.update(spirit)
        message = 'updated'
    else:
        state.setdefault('spirits', []).append(spirit)
        message = 'created'
    save_state_file(state)
    return jsonify({'status': message, 'spirit': spirit})


@app.route('/api/spirits/<string:name>', methods=['DELETE'])
def api_delete_spirit(name):
    state = load_state_file()
    spirits = state.get('spirits', [])
    new_spirits = [s for s in spirits if s.get('name', '').lower() != name.lower()]
    state['spirits'] = new_spirits
    save_state_file(state)
    return jsonify({'deleted': len(spirits) != len(new_spirits)})


@app.route('/api/simulate', methods=['POST'])
def api_simulate():
    state = load_state_file()
    updated = []
    for spirit in state.get('spirits', []):
        spirit = normalize_spirit(spirit)
        spirit = decay_spirit_thoughts(spirit)
        spirit = decay_loyalty(spirit)
        updated.append(spirit)
    state['spirits'] = updated
    if random.random() < 0.4 and updated:
        author = random.choice(updated).get('name', 'Spirit')
        state.setdefault('posts', []).append(create_default_post({'name': author}))
    save_state_file(state)
    return jsonify({'status': 'simulated', 'state': state})


@app.route('/api/character', methods=['POST'])
def api_create_character():
    body = request.get_json(silent=True) or {}
    name = body.get('name', 'Unnamed')
    data = body.get('data', {})
    cid = create_character(name, data)
    return jsonify({'id': cid})


@app.route('/api/characters')
def api_list_characters():
    return jsonify(list_characters())


@app.route('/api/character/<int:cid>')
def api_get_character(cid):
    c = get_character(cid)
    if not c:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(c)


@app.route('/api/character/<int:cid>', methods=['DELETE'])
def api_delete_character(cid):
    ok = delete_character(cid)
    return jsonify({'deleted': ok})


if __name__ == '__main__':
    print("Biblio Remembrancia server awakening...")
    app.run(debug=True, port=5000, use_reloader=True)