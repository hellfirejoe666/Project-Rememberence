import random
from typing import List, Optional

from .data_loader import RememberenceData


def _pick_pool(data: RememberenceData):
    pool = []
    pool.extend(list(data.species.keys()))
    pool.extend(list(data.types.keys()))
    pool.extend([icon.name for icon in data.icons.values() if getattr(icon, 'name', None)])
    # ensure uniqueness and filter empties
    return [p for p in sorted(set(pool)) if p]


def generate_name(kind: Optional[str] = None, n: int = 1, data: Optional[RememberenceData] = None) -> List[str]:
    """Generate names. Prefer the Markov implementation for natural names.

    Falls back to simple pool composition if insufficient data.
    """
    data = data or RememberenceData.load_default()
    # Build a candidate name list from species, types, icons, and class names
    candidates = []
    candidates.extend(list(data.species.keys()))
    candidates.extend(list(data.types.keys()))
    candidates.extend([icon.name for icon in data.icons.values() if getattr(icon, 'name', None)])
    candidates.extend(list(data.class_categories.keys()))
    # filter empties and ensure unique
    candidates = [c for c in sorted(set(candidates)) if c]

    if len(candidates) >= 3:
        # use Markov generator
        from .donjon_markov import generate_markov
        return generate_markov(candidates, n)

    # fallback simple composer
    pool = _pick_pool(data)
    if not pool:
        return [f'Spirit-{random.randint(1000,9999)}' for _ in range(n)]

    out = []
    for _ in range(n):
        a = random.choice(pool)
        b = random.choice(pool)
        if a == b:
            name = a
        else:
            name = f"{a} {b}" if random.random() < 0.5 else f"{a}{b}"
        out.append(name)
    return out


def normalize_kind(kind: Optional[str], data: RememberenceData) -> Optional[str]:
    if not kind:
        return kind
    key = kind.strip().lower()
    aliases = {
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
    if key in aliases:
        return aliases[key]
    for alias, target in aliases.items():
        if alias in key:
            return target
    for title in data.core_rules.dice_tables.keys():
        if key in title.lower():
            return title
    for title in data.core_rules.dice_tables.keys():
        if title.lower() in key:
            return title
    return kind


def generate_text(kind: Optional[str] = None, n: int = 1, data: Optional[RememberenceData] = None) -> List[str]:
    """Generate short descriptive text using dice-tables when possible.

    If a dice-table matches `kind`, pick entries from it. Otherwise produce
    templated descriptions referencing species/types.
    """
    data = data or RememberenceData.load_default()
    results = []
    kind = _normalize_kind(kind, data)
    # try exact dice-table title match
    tables = data.core_rules.dice_tables
    if kind:
        # try case-insensitive match
        for title, entry in tables.items():
            if kind.lower() in title.lower():
                values = entry.values or []
                for i in range(n):
                    if values:
                        results.append(random.choice(values))
                    else:
                        results.append(entry.title)
                return results

    # fallback: craft short text from species/types
    species = list(data.species.keys())
    types = list(data.types.keys())
    for i in range(n):
        s = random.choice(species) if species else 'Unknown'
        t = random.choice(types) if types else 'Arcane'
        results.append(f'A {t} site linked to the {s} lineage.')
    return results
