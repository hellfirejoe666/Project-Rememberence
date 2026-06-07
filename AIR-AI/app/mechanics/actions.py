from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, Optional


class CombatActionType(Enum):
    ATTACK = 'Attack'
    CHARGE = 'Charge'
    GUARD = 'Guard'
    DODGE = 'Dodge'
    SHIELD = 'Shield'
    DEFLECT = 'Deflect'
    BURST = 'Burst'
    CAST = 'Cast'
    COUNTER = 'Counter'


@dataclass
class ActionCost:
    hp: int = 0
    mp: int = 0
    spd: int = 0


@dataclass
class ActionResult:
    success: bool
    message: str
    cost: ActionCost = field(default_factory=ActionCost)
    data: Optional[Dict[str, Any]] = None


def build_action_cost(hp: int = 0, mp: int = 0, spd: int = 0) -> ActionCost:
    return ActionCost(hp=hp, mp=mp, spd=spd)
