import importlib
import os

import pytest


def make_client(tmp_path, monkeypatch):
    state_file = tmp_path / 'rememberence_state.json'
    db_file = tmp_path / 'rememberence.db'
    monkeypatch.setenv('REMEMBERENCE_STATE_FILE', str(state_file))
    monkeypatch.setenv('REMEMBERENCE_DB_PATH', str(db_file))

    import app as app_module
    importlib.reload(app_module)
    from app import app

    return app.test_client(), app_module


def test_api_roll(tmp_path, monkeypatch):
    client, _ = make_client(tmp_path, monkeypatch)
    res = client.post('/api/roll', json={'formula': '2d4+1'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['formula'] == '2d4+1'
    assert isinstance(data['rolls'], list)
    assert data['modifier'] == 1
    assert data['total'] == sum(data['rolls']) + 1


def test_api_state_save_and_load(tmp_path, monkeypatch):
    client, _ = make_client(tmp_path, monkeypatch)
    spirit = {'name': 'TestSpirit', 'animal': 'Rat', 'star': 'Aries'}
    save = client.post('/api/state', json={'spirits': [spirit]})
    assert save.status_code == 200
    assert save.get_json()['state']['spirits'][0]['name'] == 'TestSpirit'

    load = client.get('/api/state')
    assert load.status_code == 200
    data = load.get_json()
    assert len(data['spirits']) == 1
    assert data['spirits'][0]['name'] == 'TestSpirit'


def test_api_spirit_simulate(tmp_path, monkeypatch):
    client, _ = make_client(tmp_path, monkeypatch)
    spirit = {'name': 'SimSpirit', 'animal': 'Rat', 'star': 'Aries', 'thoughts': {'State': 10, 'Emotion': 5}, 'loyaltyMap': {'Player': 60}}
    client.post('/api/spirits', json=spirit)

    sim = client.post('/api/simulate')
    assert sim.status_code == 200
    data = sim.get_json()
    assert 'state' in data
    assert any(s['name'] == 'SimSpirit' for s in data['state']['spirits'])
    assert data['state']['spirits'][0]['loyaltyMap']['Player'] in (59, 60, 61, 62)
    assert isinstance(data['state']['posts'], list)
