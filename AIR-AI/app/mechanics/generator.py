import random
from typing import Dict, Optional

from .core import SpiritCharacter, StatBlock
from .data_loader import RememberenceData

DEFAULT_SKILLS = ['Strike', 'Guard', 'Whisper', 'Surge', 'Echo', 'Breach', 'Flow', 'Burst']
DEFAULT_NAMES = ['Astra', 'Nyx', 'Rune', 'Lira', 'Cora', 'Zeph', 'Nova', 'Vex']


def random_choice_from_list(values, default=None):
    if values:
        return random.choice(values)
    return default


def generate_character_payload(body: Optional[Dict] = None, data: Optional[RememberenceData] = None) -> Dict:
    body = body if isinstance(body, dict) else {}
    data = data if data is not None else RememberenceData.load_default()

    name = body.get('name') or random_choice_from_list(DEFAULT_NAMES, 'Spirit')
    level = max(1, int(body.get('level', 1)))

    animals = list(data.animals.keys())
    stars = list(data.stars.keys())
    types = list(data.types.keys())
    species_pool = list(data.species.keys())

    animal = body.get('animal') or random_choice_from_list(animals, 'Rat')
    star = body.get('star') or random_choice_from_list(stars, 'Aries')
    spirit_type = body.get('type') or random_choice_from_list(types, 'Warrior')
    species = body.get('species')

    if not species:
        engine = data.animals.get(animal)
        if engine and engine.species:
            species_choices = [entry['name'] for entry in engine.species if 'name' in entry]
            if species_choices:
                species = random_choice_from_list(species_choices)
        if not species:
            species = random_choice_from_list(species_pool, 'Avious')

    description = body.get('description') or f'A spirit born under {animal} and {star}, guided by {spirit_type} energy.'

    stats = StatBlock(
        HP=10 * level + random.randint(0, 10),
        ATK=3 * level + random.randint(0, 4),
        DEF=2 * level + random.randint(0, 3),
        SPD=2 * level + random.randint(0, 3),
        MP=8 * level + random.randint(0, 8),
    )

    skills = {
        'melee': body.get('meleeSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Strike'),
        'ranged': body.get('rangedSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Whisper'),
        'magic': body.get('magicSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Surge'),
        'step': body.get('stepSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Flow'),
        'special': body.get('specialSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Echo'),
        'trance': body.get('tranceSkill') or random_choice_from_list(DEFAULT_SKILLS, 'Burst'),
    }

    spirit = SpiritCharacter(
        name=name,
        level=level,
        animal=animal,
        star=star,
        species=species,
        type=spirit_type,
        description=description,
        stats=stats,
        skills=skills,
    )

    return spirit.as_dict()
