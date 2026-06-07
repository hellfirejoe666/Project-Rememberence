from typing import Any


def decay_spirit_thoughts(spirit: Any) -> Any:
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


def decay_loyalty(spirit: Any) -> Any:
    if not isinstance(spirit.get('loyaltyMap'), dict):
        spirit['loyaltyMap'] = {}
    for target, score in list(spirit['loyaltyMap'].items()):
        if not isinstance(score, (int, float)):
            continue
        drag = 1 if score > 0 else -1
        new_score = int(max(-100, min(100, score - drag)))
        spirit['loyaltyMap'][target] = new_score
    return spirit


def create_default_post(spirit: Any) -> dict:
    return {
        'id': int(__import__('time').time() * 1000),
        'author': spirit.get('name', 'Spirit'),
        'content': f"{spirit.get('name', 'A spirit')} murmurs in the weave.",
        'timestamp': int(__import__('time').time()),
    }
