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


def test_mechanics_class_data_loader():
    from mechanics.data_loader import RememberenceData

    data = RememberenceData.load_default()
    assert 'Melee' in data.class_categories
    melee = data.class_categories['Melee']
    assert melee.control_stats == ['STR', 'FND']
    assert any(skill.name == 'One Handed' for skill in melee.skills)
    assert len(melee.skills) == 6


def test_mechanics_icon_loader():
    from mechanics.data_loader import RememberenceData

    data = RememberenceData.load_default()
    assert any(icon.name == 'Avian' for icon in data.icons.values())
    avian = next(icon for icon in data.icons.values() if icon.name == 'Avian')
    assert 'Biorhythms' in avian.sections
    assert 'Combat' in avian.sections
    assert 'Class Styles' in avian.sections
    assert data.icon_lore.get('Heroes.txt')


def test_mechanics_icon_construct_and_faction_parsing():
    from mechanics.data_loader import RememberenceData

    data = RememberenceData.load_default()
    key_icon = next(icon for icon in data.icons.values() if icon.filename == 'Key.txt' and icon.category == 'Eternals')
    assert key_icon.faction is not None
    assert key_icon.faction.name == 'Crusher'
    assert len(key_icon.constructs) > 0
    assert key_icon.constructs[0].name
    assert key_icon.chaos_shard is not None
    assert key_icon.chaos_shard.name


def test_mechanics_core_and_rune_loader():
    from mechanics.data_loader import RememberenceData

    data = RememberenceData.load_default()
    assert '5-Biorhythms.txt' in data.core_rules.guide_sections
    assert data.core_rules.biorhythms.get('MNF') is not None
    assert data.core_rules.biorhythms['MNF'].dominant is not None
    assert '6-Dice Table.txt' in data.core_rules.guide_sections
    assert any('Search D6' in title for title in data.core_rules.dice_tables)
    assert data.runes.runes.get('Cu') is not None
    assert data.runes.runes['Cu'].description is not None


def test_mechanics_data_loader():
    from mechanics.data_loader import RememberenceData

    data = RememberenceData.load_default()
    assert 'Rat' in data.animals
    assert 'Aries' in data.stars
    assert any('HP' in entry.base_stats for entry in data.types.values())


def test_mechanics_generator_payload():
    from mechanics.generator import generate_character_payload

    payload = generate_character_payload({'level': 2})
    assert payload['level'] == 2
    assert payload['name']
    assert payload['animal']
    assert payload['star']
    assert payload['type']
    assert payload['species']
    assert isinstance(payload['stats'], dict)
    assert 'HP' in payload['stats']


def test_api_generate_name_text_routes(tmp_path, monkeypatch):
    client, _ = make_client(tmp_path, monkeypatch)
    res_name = client.post('/api/generate/name', json={'n': 4})
    assert res_name.status_code == 200
    data_name = res_name.get_json()
    assert isinstance(data_name.get('names'), list)
    assert len(data_name['names']) == 4
    assert all(isinstance(n, str) for n in data_name['names'])

    res_text = client.post('/api/generate/text', json={'type': 'Dungeons', 'n': 3})
    assert res_text.status_code == 200
    data_text = res_text.get_json()
    assert isinstance(data_text.get('texts'), list)
    assert len(data_text['texts']) == 3
    assert all(isinstance(t, str) for t in data_text['texts'])

    res_worlds = client.post('/api/generate/text', json={'type': 'worlds', 'n': 2})
    assert res_worlds.status_code == 200
    data_worlds = res_worlds.get_json()
    assert isinstance(data_worlds.get('texts'), list)
    assert len(data_worlds['texts']) == 2
    assert all(isinstance(t, str) for t in data_worlds['texts'])

    res_buildings = client.post('/api/generate/text', json={'type': 'buildings', 'n': 2})
    assert res_buildings.status_code == 200
    data_buildings = res_buildings.get_json()
    assert isinstance(data_buildings.get('texts'), list)
    assert len(data_buildings['texts']) == 2
    assert all(isinstance(t, str) for t in data_buildings['texts'])

    res_search = client.post('/api/generate/search', json={'category': 'buildings', 'n': 2})
    assert res_search.status_code == 200
    data_search = res_search.get_json()
    assert data_search.get('category')
    assert isinstance(data_search.get('results'), list)
    assert len(data_search['results']) == 2
    assert all(isinstance(r, str) for r in data_search['results'])

    res_map = client.post('/api/generate/map', json={'category': 'dungeons', 'n': 3})
    assert res_map.status_code == 200
    data_map = res_map.get_json()
    assert data_map.get('category')
    assert data_map.get('mapName')
    assert data_map.get('mapLayout')
    assert isinstance(data_map['mapLayout'], list)
    assert len(data_map['mapLayout']) == 12
    assert all(isinstance(row, list) for row in data_map['mapLayout'])
    assert all(len(row) == 12 for row in data_map['mapLayout'])
    assert isinstance(data_map.get('tileLegend'), dict)
    assert data_map.get('mapTheme')
    assert isinstance(data_map.get('mapDetails'), list)
    assert len(data_map['mapDetails']) == 3
    assert all(isinstance(r, str) for r in data_map['mapDetails'])


def test_mechanics_module_exports():
    from mechanics import (
        TurnState,
        CombatResolutionResult,
        EffectManager,
        mono_cost_for_level,
        TierSystem,
        TimeCycle,
        BattleBoard,
        perform_perception_check,
        EnvironmentState,
    )

    assert TurnState is not None
    assert CombatResolutionResult is not None
    assert EffectManager is not None
    assert callable(mono_cost_for_level)
    assert TierSystem is not None
    assert TimeCycle is not None
    assert BattleBoard is not None
    assert callable(perform_perception_check)
    assert EnvironmentState is not None
