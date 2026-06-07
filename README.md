# Project-Rememberence

This repository contains the Rememberence: Convergence web app, a Flask-based local frontend for the Rememberence TTRPG mechanics.

## Structure
- `AIR-AI/app/` - Flask backend, API endpoints, SQLite persistence, and local static assets.
- `AIR-AI/web/` - original frontend source (HTML/CSS/JS).
- `AIR-AI/app/static/` - served frontend files copied from `AIR-AI/web/`.
- `.github/workflows/python-app.yml` - CI workflow for backend tests.

## Run locally
1. Install dependencies:
```bash
python3 -m pip install -r requirements.txt
```
2. Start the Flask app:
```bash
python3 AIR-AI/app/app.py
```
3. Open the app in your browser:
```
http://127.0.0.1:5000/
```

## APIs
- `POST /api/roll` - roll dice using `NdM+K` notation.
- `GET /api/state` - read saved Rememberence state.
- `POST /api/state` - save a state object.
- `POST /api/state/clear` - reset the state.
- `GET /api/spirits` - list saved spirits.
- `POST /api/spirits` - create/update a spirit.
- `DELETE /api/spirits/<name>` - remove a spirit.
- `POST /api/simulate` - run a simulation tick.
- `POST /api/character` - create a character in SQLite.
- `GET /api/characters` - list characters.

## Testing
Run backend tests with:
```bash
cd AIR-AI/app
pytest -q
```

## Notes
- The app uses a JSON state file for Rememberence state and SQLite for saved characters.
- Frontend changes should be made in `AIR-AI/web/` and copied into `AIR-AI/app/static/` when deployed.
