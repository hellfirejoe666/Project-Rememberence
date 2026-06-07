from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class SkillDefinition:
    id: int
    name: str
    alias: Optional[str] = None
    description: str = ''
    atk: int = 0
    defense: int = 0
    spd: int = 0
    pattern: Optional[str] = None
    traits: List[str] = field(default_factory=list)
    category: Optional[str] = None
    control_stats: List[str] = field(default_factory=list)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'alias': self.alias,
            'description': self.description.strip(),
            'atk': self.atk,
            'def': self.defense,
            'spd': self.spd,
            'pattern': self.pattern,
            'traits': self.traits,
            'category': self.category,
            'control_stats': self.control_stats,
        }


@dataclass
class SkillCategory:
    name: str
    flavor: Optional[str] = None
    description: Optional[str] = None
    control_stats: List[str] = field(default_factory=list)
    skills: List[SkillDefinition] = field(default_factory=list)

    def as_dict(self):
        return {
            'name': self.name,
            'flavor': self.flavor,
            'description': self.description,
            'control_stats': self.control_stats,
            'skills': [skill.as_dict() for skill in self.skills],
        }
