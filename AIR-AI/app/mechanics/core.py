from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass
class StatBlock:
    HP: int = 0
    ATK: int = 0
    DEF: int = 0
    SPD: int = 0
    MP: int = 0
    extras: Dict[str, int] = field(default_factory=dict)

    def as_dict(self):
        data = {
            'HP': self.HP,
            'ATK': self.ATK,
            'DEF': self.DEF,
            'SPD': self.SPD,
            'MP': self.MP,
        }
        data.update(self.extras)
        return data

@dataclass
class SpiritDefinition:
    name: str
    label: Optional[str] = None
    category: Optional[str] = None
    style: Optional[str] = None
    description: Optional[str] = None
    biorhythms: Dict[str, int] = field(default_factory=dict)
    elements: Optional[str] = None
    species: List[Dict[str, str]] = field(default_factory=list)
    types: List[Dict[str, str]] = field(default_factory=list)
    traits: List[str] = field(default_factory=list)
    attack_pattern: Optional[str] = None
    base_stats: Dict[str, int] = field(default_factory=dict)

    def as_dict(self):
        return {
            'name': self.name,
            'label': self.label,
            'category': self.category,
            'style': self.style,
            'description': self.description,
            'biorhythms': self.biorhythms,
            'elements': self.elements,
            'species': self.species,
            'types': self.types,
            'traits': self.traits,
            'attack_pattern': self.attack_pattern,
            'base_stats': self.base_stats,
        }

@dataclass
class SpiritCharacter:
    name: str
    level: int
    animal: str
    star: str
    species: str
    type: str
    description: str
    stats: StatBlock
    skills: Dict[str, str] = field(default_factory=dict)
    thoughts: Dict[str, int] = field(default_factory=lambda: {'State': 0})
    loyalty_map: Dict[str, int] = field(default_factory=dict)
    loyalty_rank: Dict[str, int] = field(default_factory=dict)

    def as_dict(self):
        return {
            'name': self.name,
            'level': self.level,
            'animal': self.animal,
            'star': self.star,
            'species': self.species,
            'type': self.type,
            'description': self.description,
            'stats': self.stats.as_dict(),
            'skills': self.skills,
            'thoughts': self.thoughts,
            'loyaltyMap': self.loyalty_map,
            'loyaltyRank': self.loyalty_rank,
        }
