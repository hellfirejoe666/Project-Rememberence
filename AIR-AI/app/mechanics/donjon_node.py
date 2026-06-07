import json
import os
import re
import shutil
import subprocess
from typing import Any, Dict, List, Optional

from .data_loader import RememberenceData

NODE_BINARY = shutil.which('node') or shutil.which('nodejs')
BRIDGE_SCRIPT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'generators', 'donjon', 'bridge.js')
)


def _normalize_key(title: str) -> str:
    if not title:
        return ''
    key = title.split(';', 1)[0].strip()
    return key


_CATEGORY_ALIASES = {
    'search': 'Search D6',
    'spirits': 'Search D6',
    'world': 'Search D6',
    'worlds': 'Search D6',
    'portals': 'Search D6',
    'runes': 'Search D6',
    'structures': 'Structures D6',
    'buildings': 'Structures D6',
    'cities': 'Structures D6',
    'towns': 'Structures D6',
    'dungeons': 'Dungeons D6',
    'caves': 'Dungeons D6',
    'shrines': 'Dungeons D6',
    'treasure': 'Treasure D6',
    'gear': 'Gear D6',
    'melee': 'Melee D6',
    'ranged': 'Ranged D6',
    'magic': 'Magic D6',
    'step': 'Step D6',
    'special': 'Special D6',
    'trance': 'Trance D6',
    'types': 'Types D6 * 4 (D24)',
    'species': 'Species D6 * 6 (D36)',
}


def _normalize_kind(kind: Optional[str], data: RememberenceData) -> Optional[str]:
    if not kind:
        return kind
    key = kind.strip().lower()
    if key in _CATEGORY_ALIASES:
        return _CATEGORY_ALIASES[key]
    for alias, target in _CATEGORY_ALIASES.items():
        if alias in key:
            return target
    for title in data.core_rules.dice_tables.keys():
        if key in title.lower():
            return title
    for title in data.core_rules.dice_tables.keys():
        if title.lower() in key:
            return title
    return kind


def _clean_name(text: str) -> Optional[str]:
    if not text or len(text) < 2:
        return None
    if re.search(r'[\d\(\)\[\]{}<>.,;:]|\.txt|\-|/', text):
        return None
    if not re.match(r'^[A-Za-z][A-Za-z ]+$', text):
        return None
    return text.strip()


def _build_name_set(data: RememberenceData) -> Dict[str, List[str]]:
    candidates: List[str] = []
    candidates.extend(list(data.species.keys()))
    candidates.extend(list(data.types.keys()))
    candidates.extend(list(data.animals.keys()))
    candidates.extend(list(data.stars.keys()))
    candidates.extend(list(data.class_categories.keys()))
    candidates.extend([icon.name for icon in data.icons.values() if getattr(icon, 'name', None)])

    cleaned = [_clean_name(c) for c in candidates]
    cleaned = [c for c in cleaned if c]

    return {
        'default': sorted(set(cleaned)),
        'species': sorted({c for c in cleaned if c in data.species}),
        'types': sorted({c for c in cleaned if c in data.types}),
        'classes': sorted({c for c in cleaned if c in data.class_categories}),
    }


def _build_gen_data(data: RememberenceData) -> Dict[str, Any]:
    gen_data: Dict[str, Any] = {}
    for title, entry in data.core_rules.dice_tables.items():
        key = _normalize_key(title)
        if not key:
            continue
        gen_data[key] = entry.values
    return gen_data


def _node_available() -> bool:
    return bool(NODE_BINARY and os.path.exists(BRIDGE_SCRIPT))


def _run_node(action: str, kind: Optional[str], n: int, data: RememberenceData) -> List[str]:
    if not _node_available():
        raise RuntimeError('Node.js bridge is not available')

    payload = {
        'action': action,
        'type': kind,
        'n': n,
        'nameSet': _build_name_set(data),
        'genData': _build_gen_data(data),
    }

    try:
        process = subprocess.run(
            [NODE_BINARY, BRIDGE_SCRIPT],
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            timeout=5,
            check=True,
        )
    except FileNotFoundError as exc:
        raise RuntimeError('Node.js is not installed') from exc
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f'Node bridge failed ({exc.returncode}): {exc.stderr.strip() or exc.stdout.strip()}'
        ) from exc
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError('Node bridge timed out') from exc

    try:
        output = json.loads(process.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError('Invalid JSON from Node bridge') from exc

    values = output.get('values')
    if not isinstance(values, list):
        raise RuntimeError('Node bridge returned unexpected values')
    return values


def generate_name(kind: Optional[str] = None, n: int = 1, data: Optional[RememberenceData] = None) -> List[str]:
    data = data or RememberenceData.load_default()
    return _run_node('name', kind, n, data)


def generate_text(kind: Optional[str] = None, n: int = 1, data: Optional[RememberenceData] = None) -> List[str]:
    data = data or RememberenceData.load_default()
    return _run_node('text', kind, n, data)
